# CI/CD Pipelines Using AWS CDK

You will need to be logged in using [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)

## Bootstrap Accounts

```
cd infrastructure

npm run cdk bootstrap aws://unknown-account/us-west-2

# If you're going to deploy DevelopmentServerStack
npm run cdk bootstrap aws://unknown-account/us-west-1
```

## Pipeline Deployment

```
cd infrastructure
npm install
npm run build
npm run cdk synth
npm run cdk deploy PipelineStack
```

## Development Stack Deployment

```
cd infrastructure
npm install
npm run build
npm run cdk synth
npm run cdk deploy DevelopmentServerStack
```

## Running Local Client for Development

You will need to create a file called `config.json` inside `client/public` folder containing the api domain

```
{"api":"https://<apiGatewayId>.execute-api.us-west-2.amazonaws.com/"}
```

Then you can start the local development server

```
cd client
npm run install
npm run serve
```
