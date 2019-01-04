# ChatQL: An AWS AppSync Chat Starter App written in Angular

### Quicklinks
 - [Introduction](#introduction)
 - [Features](#features)
 - [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend setup](#backend-setup)
   - [Application Walkthrough](#application-walkthrough)
   - [AWS Pinpoint Analytics](#aws-pinpoint-analytics)
 - [Building, Deploying and Publishing](#building-deploying-and-publishing)
 - [Clean Up](#clean-up)

## Introduction

This is a Starter Angular Progressive Web Application (PWA) that uses AWS AppSync to implement offline and real-time capabilities in a chat application as part of the blog post https://aws.amazon.com/blogs/mobile/building-a-serverless-real-time-chat-application-with-aws-appsync/. In the chat app, users can have conversations with other users and exchange messages. The application demonstrates GraphQL Mutations, Queries and Subscriptions using AWS AppSync. You can use this for learning purposes or adapt either the application or the GraphQL Schema to meet your needs.

![ChatQL Overview](/media/chatql.png)

## Features

- PWA: A Progressive Web Application takes advantage of the latest technologies such as Service Workers to combine the best of web and mobile apps. Think of it as a website built using web technologies but that acts and feels like an app in a mobile device.

- GraphQL Mutations (`src/app/graphql/mutations`)
  - Create users
  - Create conversations and link them to users
  - Create messages in a conversations

- GraphQL Queries (`src/app/graphql/queries`)
  - Get all users
  - Get all messages in a conversation
  - Get all user related conversations

- GraphQL Subscriptions (`src/app/graphql/subscriptions`)
  - Real time updates for new messages in conversations

- Authentication
  - The app uses Cognito User Pools to onboard users and authenticate them into the app
- Authorization
  - The app uses JWT Tokens from Cognito User Pools as the authorization mechanism

## Getting Started

#### Prerequisites

* [AWS Account](https://aws.amazon.com/mobile/details) with appropriate permissions to create the related resources
* [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) `(pip install awscli --upgrade --user)`
* [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli) (configured for a region where [AWS AppSync is available](https://docs.aws.amazon.com/general/latest/gr/rande.html#appsync_region)) `(npm install -g @aws-amplify/cli)`
* [Angular CLI](https://github.com/angular/angular-cli) `(npm install -g @angular/cli)`


### Backend Setup

1. First, clone this repository and navigate to the created folder:
    ```bash
    $ git clone https://github.com/aws-samples/aws-mobile-appsync-chat-starter-angular.git
    $ cd aws-mobile-appsync-chat-starter-angular
    ```

2. Set up your AWS resources the Amplify CLI:
    ```bash
    $ amplify init
    ```

3. Install the required modules:

    ```bash
    $ npm install
    ```

4. Add authentication and analytics to the project with the default options:

    ```bash
    $ amplify add auth
    $ amplify add analytics
    ```

4. Create the cloud resources by pushing the changes:

    ```bash
    $ amplify push
    ```

5. In `./src/aws-exports.js`, look up the ID of the Cognito User Pool that was created

    ```bash
    $ grep aws_user_pools_id src/aws-exports.js
    ```

    From here there are 2 options:
    * Deploy from the AWS Console
    * Deploy with CloudFormation

### Deploy from the AWS Console    

1. Navigate to the AWS AppSync console using the URL: http://console.aws.amazon.com/appsync/home

2. Click on **Create API**, select **Create with Wizard** with the **Chat App** option. Click **Start**.
   
3. Enter a API name of your choice, select the Region and the Amazon Cognito User Pool ID you retrieved from `./src/aws-exports.js`. 

4. After the API is deployed, in the **Getting Started** page scroll down to the **Integrate with your App** section,  select **JavaScript**, copy the full `amplify codegen` command and back to the local project folder paste and execute it:

    ```bash
    $ amplify add codegen --apiId xxxxxxxxxxxxxx
    ```
5. Start the application:

    ```bash
    $ amplify serve
    ```

    or
    ```bash
    $ ng serve
    ```

### Deploy with CloudFormation

1. Deploy the included Cloudformation template to launch a stack that will create an IAM Service Role, DynamoDB tables, an AppSync API, a GraphQL schema, Data Sources, and Resolvers.

    ```bash
    $ aws cloudformation create-stack --stack-name ChatQL --template-body file://backend/deploy-cfn.yml --parameters ParameterKey=userPoolId,ParameterValue=<AWS_USER_POOLS_ID> --capabilities CAPABILITY_IAM --region <YOUR_REGION>
    ```

    When the stack is done deploying, you can view its output. Make note of the GraphQL API Identifier 'ChatQLApiId'.

    ```bash
    aws cloudformation describe-stacks --stack-name ChatQL --query Stacks[0].Outputs --region <YOUR_REGION>
    ```

1. Point your browser to the [AWS AppSync Console](https://console.aws.amazon.com/appsync/home) (keeping mind of the region), and select the API (named 'ChatQL') created in the previous step. In the **Getting Started** page scroll down to the **Integrate with your App** section,  select **JavaScript**, copy the full `amplify codegen` command and back to the local project folder paste and execute it:

    ```bash
    $ amplify add codegen --apiId xxxxxxxxxxxxxx
    ```

2. Finally, execute the following command to install your project package dependencies and run the application locally:
      ```bash
    $ amplify serve
    ```

    or
    ```bash
    $ ng serve
    ```

3. Access your ChatQL app at http://localhost:4200. Sign up different users and test real-time/offline messaging using different browsers.

### Application Walkthrough

The application is composed of the main app module and 2 independent feature modules:

* auth.module
* chat-app.module

Both modules make use of AWS Amplify, which is initialized with the `./src/aws-exports.js` configuration in `./src/app.module.ts`. The auth.module allows to easily onboard users in the app. To sign up to use the app, a user provides his username, password and email address. Upon succesful sign-up, a confirmation code is sent to the user's email address to confirm the account. The code can be used in the app to confirm the account, after which a user can sign in and access the chat portion of the app.

In the chat, a user can see a list of other users who have registered after sign in to the app for the first time. A user can click on a name to initiate a new conversation (`./src/app/chat-app/chat-user-list`) or can click on an existing conversation to resume it (`./src/app/chat-app/chat-convo-list`). Inside of a conversation, a user automatically receives new messages via subscriptions (`./src/app/chat-app/chat-message-view/`). When a user sends a message, the message is initially displayed with a grey check mark. This indicates that receipt confirmation from the backend server has not been received. The checkmark turns green upon confirmation the message was received by the backend. This is easily implemented by including the `isSent` flag, set to false, when we send the `createMessage` mutation. In the mutation, we request for the `isSent` flag to be returned from the backend. The flag is set to true on the backend and when returned, our template updates the css class associated with the checkmark (see `./src/src/app/chat-app/chat-message`).

![Application Overview](/media/chatql-app.png)

### AWS Pinpoint Analytics

1. The `./src/aws-exports.js` file also provides the Amazon Pinpoint project details to start collecting analytics data from the chat activity in the application. AWS Amplify is configured to send custom events to Pinpoint when a conversation is created  (`/src/app/chat-user-list/chat-user-list.component.ts`) and when a message is sent (`/src/app/chat-input/chat-input.component.ts`).

1. Navigate to the Amazon Pinpoint console and select the project with the same name as your amplify project: https://console.aws.amazon.com/pinpoint/home

      Click on **Analytics** in the top right corner of the console to open the Amazon Pinpoint console. Click on **Analytics** on the left, then select the **Events** tab to see your application's events. Use the Event dropdown menu to see data from your custom events (`Chat MSG Sent` or `New Conversation`).

## Building, Deploying and Publishing

1. Execute `amplify add hosting` from the project's root folder and follow the prompts to create a S3 bucket (DEV) and/or a CloudFront distribution (PROD).

1. Build and publish the application:

```bash
    $ amplify publish
```

2. If you are deploying a CloudFront distribuiton, be mindful it needs to be replicated across all points of presence globally and it might take up to 15 minutes to do so.

3. Access your public ChatQL application using the S3 Website Endpoint URL or the CloudFront URL returned by the `amplify publish` command. Share the link with friends, sign up some users, and start creating conversations and exchanging messages. Be mindful PWAs require SSL, in order to test PWA functionality access the CloudFront URL (HTTPS) from a mobile device and add the site to the mobile home screen.

## Clean Up

To clean up the project, you can simply delete the stack you created or use the Amplify CLI, depending on how you deployed the application.

```bash
$ aws cloudformation delete-stack --stack-name ChatQL --region <YOUR_REGION>
```

or use:

```
$ amplify delete
```

