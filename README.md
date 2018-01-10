Introduction
============

This is a Starter Angular progressive web application (PWA) that takes advantage of AWS AppSync offline and real-time capabilities to allow users to communicate via chat. A script creates a GraphQL Schema, a related API, an Amazon Cognito User Pool for AuthN/Z as well as provisions Amazon DynamoDB resources, then connects them appropriately with Resolvers. The application demonstrates GraphQL Mutations, Queries and Subscriptions using AWS AppSync. You can use this for learning purposes or adapt either the application or the GraphQL Schema to meet your needs.

<p align="center">
  <img src="screenshots/chatql.png">
</p>

## Pre-Reqs

* Valid AWS Account
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [NPM](https://www.npmjs.com/)
* [AWS Mobile CLI](https://github.com/aws/awsmobile-cli)
* [Angular CLI](https://github.com/angular/angular-cli)

## Features

- PWA: A progressive web application takes advantage of the latest technologies such as Service Workers to combine the best of web and mobile apps. Think of it as a website built using web technologies but that acts and feels like an app in a mobile device. 

- GraphQL Mutations (src/app/graphql/mutations)
  - Create messages
  - Create conversations and link them to the user
  - Create users

- GraphQL Queries (src/app/graphql/queries)
  - Get all users
  - Get all messages in a conversation
  - Get all user related conversations by Id

- GraphQL Subscriptions (src/app/graphql/subscriptions)
  - Real time updates for new messages in conversations

- Auth
  - The app uses JWT Tokens from Cognito User Pools as the AuthN/Z mechanism

Setup
============

1. Clone this repository and execute the shell script "setup.sh" from the folder "/backend". The script will create a Cognito User Pool, DynamoDB tables and an AppSync API in the us-east-1 region (to create resources in another region, find and replace all occurrences of "us-east-1" in the script). Use the information from the script results to fill up the details in the file "/src/app/config.ts" including the region:

```
export const CONFIG = {
  REGION: 'region here',
  COGNITO_USER_POOL: 'generated user pool from setup.sh script here',
  COGNITO_APP_ID: 'generated app id from setup.sh script here',
  COGNITO_DOMAIN: 'generated domain from setup.sh script here (<name>.auth.<region>.amazoncognito.com)',
  CLOUDFRONT_WEBSITE: 'http://localhost:4200'
};
```

2. From the the AWS Console, go to Amazon Cognito -> Cognito User Pools and select the user pool named "ChatQL" generated above. Under APP INTEGRATION -> APP CLIENT SETTINGS select the option COGNITO USER POOL, configure the options:

```
CALLBACK URL: http://localhost:4200/chat
SIGN OUT URL: http://localhost:4200
```

For ALLOWED OAUTH FLOWS, select IMPLICIT GRANT. For ALLOWED OAUTH SCOPES, select OPENID.

3. Go to the AWS AppSync Console and select the ChatQL API created on step 1. From the homepage of your GraphQL API (or you can click on "ChatQL" in the left hand navigation), select WEB at the bottom to download your "AppSync.js" configuration file into your project's "/src" directory.

4. Go to the root folder of the cloned repository and execute the following command to install all packages and dependencies:

```
npm install
```

5. Now execute the following command to run the application locally:

```
ng serve
```

6. Access your ChatQL app on http://localhost:4200

Host your ChatQL app in CloudFront and add Pinpoint Analytics with Mobile Hub and AWS Amplify
=============================================================================================

<p align="center">
   <a target="_blank" href="https://console.aws.amazon.com/mobilehub/home">
   <span>
       <img height="100%" src="https://s3.amazonaws.com/deploytomh/button-deploy-aws-mh.png"/>
   </span>
   </a>
</p>

1. Click on the button above, create a project called ChatQL in the region of choice and click NEXT. Select WEB as app platform with the default options and click ADD

2. Follow the instructions to setup and initialize the backend with the awsmobile CLI with the following info:

* Source Directory: src
* Distribution Directory: dist
* Build Command: ng build --prod

3. A file called "aws-exports.js" will be generated under the /src folder. Retrieve the details of the CloudFront distribution created by Mobile Hub (aws_content_delivery_cloudfront_domain)

4. Go to the settings of Cognito User Pools ChatQLUsers created earlier. Under APP INTEGRATION -> APP CLIENT SETTINGS select the option COGNITO USER POOL, modify the following options with the CloudFront Distribution details:

```
CALLBACK URL: https://d123456EXAMPLE.cloudfront.net/chat
SIGN OUT URL: https://d123456EXAMPLE.cloudfront.net
```

5. Go to the file “/src/app/config.ts” and replace 'http://localhost:4200' with the CloudFront Distribution details 'https://d123456EXAMPLE.cloudfront.net' (be mindful it should be https://)

6. Execute "awsmobile publish" (If there are any errors, copy the file backend/mobile-hub-project.yml to the folder awsmobilejs/backend/)

7. While the application is building, go back to the Mobile Hub console and select HOSTING & STREAMING -> EDIT YOUR CDN DISTRIBUTION -> ERROR PAGES -> CREATE CUSTOM ERROR RESPONSE. Use the following settings:

* HTTP Error Code: 403
* Minimun TTL: 0
* Customize Error Response: Yes
* Response Path: /index.html
* HTTP Response Code: 200

This step is necessary because of the way Angular internal routing works. An authenticated request will be redirected to /chat that doesn't exist on S3, only internally in the Angular application.

8. Waiting until the CloudFront settings are replicated (Status: Deployed)

9. Access your public ChatQL application using the CloudFront URL, share the link and start sending messages and creating conversations with other users.

10. The aws-exports.js file created by the awsmobile CLI provided the Amazon Pinpoint project details to start collection Analytics from the chat activity. AWS Amplify is configured to send custom events to Pinpoint when a message is sent and when a conversation is created (/src/app/chat-input/chat-input.component.ts and /src/app/chat-user-list/chat-user-list.component.ts)

11. After a couple of minutes go to the Amazon Pinpoint console, select the project, go to ANALYTICS -> EVENTS and select the specific event from the EVENT dropdown menu to see the data about the related event.

