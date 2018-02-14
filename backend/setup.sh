#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

echo -n "Enter your AWS Account Number and press [ENTER]: "
read ACCOUNT
echo

POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["dynamodb:BatchGetItem","dynamodb:DescribeTable","dynamodb:GetItem","dynamodb:ListTables","dynamodb:Query","dynamodb:Scan","dynamodb:BatchWriteItem","dynamodb:DeleteItem","dynamodb:PutItem","dynamodb:UpdateItem"],"Resource":[<TABLE_ARNS>]}]}'
TABLES=("Conversations" "Users" "Messages" "UserConversations")
REGION=$(cat ../src/aws-exports.js | grep aws_project_region | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
PREFIX=$(cat ../src/aws-exports.js | grep aws_resource_name_prefix | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
USERPOOL=$(cat ../src/aws-exports.js | grep aws_user_pools_id | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
TABLE_PREFIX="ChatQL_${PREFIX}"

echo "Working in region: ${REGION}"
echo

aws dynamodb create-table --table-name "${TABLE_PREFIX}_Conversations" \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "${TABLE_PREFIX}_Conversations DDB Table created"

aws dynamodb create-table --table-name "${TABLE_PREFIX}_Messages" \
 --attribute-definitions AttributeName=conversationId,AttributeType=S AttributeName=createdAt,AttributeType=S \
 --key-schema AttributeName=conversationId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "${TABLE_PREFIX}_Messages DDB Table created"

aws dynamodb create-table --table-name "${TABLE_PREFIX}_UserConversations" \
 --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=conversationId,AttributeType=S \
 --key-schema AttributeName=userId,KeyType=HASH AttributeName=conversationId,KeyType=RANGE \
 --global-secondary-indexes IndexName=conversationId-index,KeySchema=["{AttributeName=conversationId,KeyType=HASH}"],Projection={ProjectionType=ALL},ProvisionedThroughput="{ReadCapacityUnits=5,WriteCapacityUnits=5}" \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "${TABLE_PREFIX}_UserConversations DDB Table created"

aws dynamodb create-table --table-name "${TABLE_PREFIX}_Users" \
 --attribute-definitions AttributeName=cognitoId,AttributeType=S \
 --key-schema AttributeName=cognitoId,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "${TABLE_PREFIX}_Users DDB Table created"

echo "DDB Tables created!"
echo

TABLE_ARNS=""
ARN_PREFIX="arn:aws:dynamodb:$REGION:$ACCOUNT:table"
for table in ${TABLES[@]}; do
  TABLE_ARNS="$TABLE_ARNS\"$ARN_PREFIX/${TABLE_PREFIX}_$table\","
done
TABLE_ARNS="$TABLE_ARNS\"$ARN_PREFIX/${TABLE_PREFIX}_UserConversations/index/conversationId-index\""
UPDATED_POLICY=${POLICY/<TABLE_ARNS>/$TABLE_ARNS}
aws iam create-role --role-name "$PREFIX-AppSyncServiceRole" --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal": {"Service": "appsync.amazonaws.com"},"Action":"sts:AssumeRole"}]}' | grep Arn | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/roleArn
aws iam put-role-policy --role-name "$PREFIX-AppSyncServiceRole" --policy-name dynamodb-access --policy-document "$UPDATED_POLICY"
SERVICE_ROLE_ARN=$(cat /tmp/roleArn)
echo "Created the Service Role: $SERVICE_ROLE_ARN"
echo

aws appsync --region $REGION create-graphql-api --name "ChatQL" --authentication-type AMAZON_COGNITO_USER_POOLS --user-pool-config userPoolId=$USERPOOL,awsRegion=$REGION,defaultAction=ALLOW | grep apiId | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/apiId
API_ID=$(cat /tmp/apiId)
echo -n "Creating a GraphQL API $API_ID: "

aws appsync start-schema-creation --api-id $API_ID --definition file://schema.graphql --query status --output text --region $REGION

echo "Creating Schema..."
sleep 7

for table in ${TABLES[@]}; do
  echo "Creating datasource $table"
  aws appsync create-data-source --api-id $API_ID \
   --name "$table" \
   --type AMAZON_DYNAMODB \
   --service-role-arn $SERVICE_ROLE_ARN \
   --dynamodb-config "{\"tableName\" : \"${TABLE_PREFIX}_$table\", \"awsRegion\" : \"$REGION\"}" \
   --region $REGION > /dev/null
done

echo "AppSync datasources created!"

echo -n "Creating resolvers"

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createConversation \
 --data-source-name Conversations \
 --request-mapping-template file://resolvers/Mutation.createConversation.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createMessage \
 --data-source-name Messages \
 --request-mapping-template file://resolvers/Mutation.createMessage.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createUserConversations \
 --data-source-name UserConversations \
 --request-mapping-template file://resolvers/Mutation.createUserConversations.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createUser \
 --data-source-name Users \
 --request-mapping-template file://resolvers/Mutation.createUser.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name UserConversations \
 --field-name conversation \
 --data-source-name Conversations \
 --request-mapping-template file://resolvers/UserConversations.conversation.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name UserConversations \
 --field-name associated \
 --data-source-name UserConversations \
 --request-mapping-template file://resolvers/UserConversations.associated.request \
 --response-mapping-template file://resolvers/UserConversations.associated.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name User \
 --field-name conversations \
 --data-source-name UserConversations \
 --request-mapping-template file://resolvers/User.conversations.request \
 --response-mapping-template file://resolvers/User.conversations.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name User \
 --field-name messages \
 --data-source-name Messages \
 --request-mapping-template file://resolvers/User.messages.request \
 --response-mapping-template file://resolvers/User.messages.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name me \
 --data-source-name Users \
 --request-mapping-template file://resolvers/Query.me.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessage \
 --data-source-name Messages \
 --request-mapping-template file://resolvers/Query.allMessage.request \
 --response-mapping-template file://resolvers/Query.allMessage.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessageFrom \
 --data-source-name Messages \
 --request-mapping-template file://resolvers/Query.allMessageFrom.request \
 --response-mapping-template file://resolvers/Query.allMessageFrom.response \
 --region $REGION > /dev/null

echo -n "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessageConnection \
 --data-source-name Messages \
 --request-mapping-template file://resolvers/Query.allMessageConnection.request \
 --response-mapping-template file://resolvers/Query.allMessageConnection.response \
 --region $REGION > /dev/null

echo "."
aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allUser \
 --data-source-name Users \
 --request-mapping-template file://resolvers/Query.allUser.request \
 --response-mapping-template file://resolvers/Query.allUser.response \
 --region $REGION > /dev/null

echo "AppSync Resolvers created!"
