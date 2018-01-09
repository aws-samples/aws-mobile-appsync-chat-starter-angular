#!/usr/bin/env bash

export REGION=us-east-1

echo -n "Enter the your AWS Account Number and press [ENTER]: "
read ACCOUNT

aws iam create-role --role-name AppSyncServiceRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal": {"Service": "appsync.amazonaws.com"},"Action":"sts:AssumeRole"}]}' | grep Arn | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/roleArn
SERVICE_ROLE_ARN=$(cat /tmp/roleArn)
echo "Created the Service Role " $SERVICE_ROLE_ARN

aws cognito-idp create-user-pool --pool-name ChatQL --region $REGION | grep Id | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/userPool
USERPOOL=$(cat /tmp/userPool)
echo "Created the User Pool ID " $USERPOOL

aws cognito-idp create-user-pool-client --user-pool-id $USERPOOL --client-name ChatQL --region $REGION | grep ClientId | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/userPoolAppId
USERPOOLAPPID=$(cat /tmp/userPoolAppId)
echo "Created the User Pool Application ID" $USERPOOLAPPID

aws cognito-idp create-user-pool-domain --user-pool-id $USERPOOL --domain chatql-$ACCOUNT --region $REGION
echo "Created the User Pool Domain " chatql-$ACCOUNT.auth.$REGION.amazoncognito.com

aws appsync --region $REGION create-graphql-api --name ChatQL --authentication-type AMAZON_COGNITO_USER_POOLS --user-pool-config userPoolId=$USERPOOL,awsRegion=us-east-1,defaultAction=ALLOW | grep apiId | awk '{print $2}' | xargs |sed -e 's/^"//'  -e 's/"$//' -e 's/,$//' > /tmp/apiId
API_ID=$(cat /tmp/apiId)
echo "Created an GraphQL API ID " $API_ID

aws appsync start-schema-creation --api-id $API_ID --definition file://schema.graphql --region $REGION

echo "Creating Schema..."
sleep 7 

aws dynamodb create-table --table-name ChatQL_ConversationTable \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "ChatQL_ConversationTable DDB Table created"

aws dynamodb create-table --table-name ChatQL_MessageTable \
 --attribute-definitions AttributeName=conversationId,AttributeType=S AttributeName=createdAt,AttributeType=S AttributeName=sender,AttributeType=S \
 --key-schema AttributeName=conversationId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
 --global-secondary-indexes IndexName=sender-conversationId-index,KeySchema=["{AttributeName=sender,KeyType=HASH}","{AttributeName=conversationId,KeyType=RANGE}"],Projection={ProjectionType=ALL},ProvisionedThroughput="{ReadCapacityUnits=5,WriteCapacityUnits=5}" \
 --local-secondary-indexes IndexName=sender,KeySchema=["{AttributeName=conversationId,KeyType=HASH}","{AttributeName=createdAt,KeyType=RANGE}"],Projection={ProjectionType=ALL} \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "ChatQL_MessageTable DDB Table created"

aws dynamodb create-table --table-name ChatQL_UserConversationsTable \
 --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=conversationId,AttributeType=S \
 --key-schema AttributeName=userId,KeyType=HASH AttributeName=conversationId,KeyType=RANGE \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "ChatQL_UserConversationsTable DDB Table created"

aws dynamodb create-table --table-name ChatQL_UserTable \
 --attribute-definitions AttributeName=cognitoId,AttributeType=S \
 --key-schema AttributeName=cognitoId,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --region $REGION > /dev/null

echo "ChatQL_UserTable DDB Table created"

echo "DDB Tables created!"

aws appsync create-data-source --api-id $API_ID \
 --name ChatQL_ConversationTable \
 --type AMAZON_DYNAMODB \
 --service-role-arn arn:aws:iam::244958302947:role/AppSyncServiceRole \
 --dynamodb-config "{\"tableName\" : \"ChatQL_ConversationTable\", \"awsRegion\" : \"$REGION\"}" \
 --region $REGION > /dev/null

 aws appsync create-data-source --api-id $API_ID \
 --name ChatQL_MessageTable \
 --type AMAZON_DYNAMODB \
 --service-role-arn arn:aws:iam::244958302947:role/AppSyncServiceRole \
 --dynamodb-config "{\"tableName\" : \"ChatQL_MessageTable\", \"awsRegion\" : \"$REGION\"}" \
 --region $REGION > /dev/null

aws appsync create-data-source --api-id $API_ID \
 --name ChatQL_UserConversationsTable \
 --type AMAZON_DYNAMODB \
 --service-role-arn arn:aws:iam::244958302947:role/AppSyncServiceRole \
 --dynamodb-config "{\"tableName\" : \"ChatQL_UserConversationsTable\", \"awsRegion\" : \"$REGION\"}" \
 --region $REGION > /dev/null

aws appsync create-data-source \
 --api-id $API_ID \
 --name ChatQL_UserTable \
 --type AMAZON_DYNAMODB \
 --service-role-arn arn:aws:iam::244958302947:role/AppSyncServiceRole \
 --dynamodb-config "{\"tableName\" : \"ChatQL_UserTable\", \"awsRegion\" : \"$REGION\"}" \
 --region $REGION > /dev/null

echo "AppSyncData Sources created!"

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createConversation \
 --data-source-name ChatQL_ConversationTable \
 --request-mapping-template file://resolvers/Mutation.createConversation.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createMessage \
 --data-source-name ChatQL_MessageTable \
 --request-mapping-template file://resolvers/Mutation.createMessage.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createUserConversations \
 --data-source-name ChatQL_UserConversationsTable \
 --request-mapping-template file://resolvers/Mutation.createUserConversations.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Mutation \
 --field-name createUser \
 --data-source-name ChatQL_UserTable \
 --request-mapping-template file://resolvers/Mutation.createUser.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name UserConversations \
 --field-name conversation \
 --data-source-name ChatQL_ConversationTable \
 --request-mapping-template file://resolvers/UserConversations.conversation.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name UserConversations \
 --field-name associated \
 --data-source-name ChatQL_UserConversationsTable \
 --request-mapping-template file://resolvers/UserConversations.associated.request \
 --response-mapping-template file://resolvers/UserConversations.associated.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name User \
 --field-name conversations \
 --data-source-name ChatQL_UserConversationsTable \
 --request-mapping-template file://resolvers/User.conversations.request \
 --response-mapping-template file://resolvers/User.conversations.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name User \
 --field-name messages \
 --data-source-name ChatQL_MessageTable \
 --request-mapping-template file://resolvers/User.messages.request \
 --response-mapping-template file://resolvers/User.messages.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name me \
 --data-source-name ChatQL_UserTable \
 --request-mapping-template file://resolvers/Query.me.request \
 --response-mapping-template file://resolvers/passthrough.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessage \
 --data-source-name ChatQL_MessageTable \
 --request-mapping-template file://resolvers/Query.allMessage.request \
 --response-mapping-template file://resolvers/Query.allMessage.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessageFrom \
 --data-source-name ChatQL_MessageTable \
 --request-mapping-template file://resolvers/Query.allMessageFrom.request \
 --response-mapping-template file://resolvers/Query.allMessageFrom.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allMessageConnection \
 --data-source-name ChatQL_MessageTable \
 --request-mapping-template file://resolvers/Query.allMessageConnection.request \
 --response-mapping-template file://resolvers/Query.allMessageConnection.response \
 --region $REGION > /dev/null

aws appsync create-resolver \
 --api-id $API_ID \
 --type-name Query \
 --field-name allUser \
 --data-source-name ChatQL_UserTable \
 --request-mapping-template file://resolvers/Query.allUser.request \
 --response-mapping-template file://resolvers/Query.allUser.response \
 --region $REGION > /dev/null

echo "AppSync Resolvers created!"