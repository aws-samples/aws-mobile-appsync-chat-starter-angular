#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

echo -n "Enter your AWS Account Number and press [ENTER]: "
read ACCOUNT
echo -n "Enter your AWS AppSync GraphQL API and press [ENTER]: "
read GRAPHQLAPI
echo

POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["dynamodb:BatchGetItem","dynamodb:DescribeTable","dynamodb:GetItem","dynamodb:ListTables","dynamodb:Query","dynamodb:Scan","dynamodb:BatchWriteItem","dynamodb:DeleteItem","dynamodb:PutItem","dynamodb:UpdateItem"],"Resource":[<TABLE_ARNS>]}]}'
TABLES=("Conversations" "Users" "Messages" "UserConversations")
REGION=$(cat ../src/aws-exports.js | grep aws_project_region | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
PREFIX=$(cat ../src/aws-exports.js | grep aws_resource_name_prefix | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
USERPOOL=$(cat ../src/aws-exports.js | grep aws_user_pools_id | awk '{print $2}' | sed -e "s/^'//" -e "s/',//")
TABLE_PREFIX="ChatQL_${PREFIX}"

aws appsync delete-graphql-api --api-id "$GRAPHQLAPI" --region $REGION > /dev/null 2>&1
if [ "$?" -ne 0 ]; then
  echo "Could not delete AppSync API $GRAPHQLAPI"
else
  echo "Deleting AppSync API $GRAPHQLAPI"
fi

for table in ${TABLES[@]}; do
  status=$(aws dynamodb delete-table --table-name "${TABLE_PREFIX}_$table" --query TableDescription.TableStatus --output text --region $REGION 2> /dev/null)
  echo "Deleting ${TABLE_PREFIX}_$table: ${status:-N/A}"
done

aws iam delete-role-policy --role-name "$PREFIX-AppSyncServiceRole" --policy-name dynamodb-access > /dev/null 2>&1
if [ "$?" -ne 0 ]; then
  echo "Could not delete role policy dynamodb-access"
else
  echo "Deleted role policy dynamodb-access"
fi

aws iam delete-role --role-name "$PREFIX-AppSyncServiceRole" > /dev/null 2>&1
if [ "$?" -ne 0 ]; then
  echo "Could not delete role $PREFIX-AppSyncServiceRole"
else
  echo "Deleted role $PREFIX-AppSyncServiceRole"
fi

echo
echo 'Done deleting resources.'
