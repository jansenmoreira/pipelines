import { Code } from "@aws-cdk/aws-lambda";
import { App } from "@aws-cdk/core";
import { PipelineStack } from "./pipeline/pipeline-stack";
import { SimpleStack } from "./sample/SimpleStack";
import { ServerStack } from "./server/server-stack";
import * as path from "path";
import { DEVELOPMENT_ENVIRONMENT, PRODUCTION_ENVIRONMENT, REPOSITORY_NAME } from "./environments";

const app = new App();

const pipelineSource = Code.fromCfnParameters();

const serverStack = new ServerStack(app, "ServerStack", {
    code: pipelineSource,
    bucketName: PRODUCTION_ENVIRONMENT.bucketName,
    env: { region: PRODUCTION_ENVIRONMENT.region },
});

const pipelineStack = new PipelineStack(app, "PipelineStack", {
    code: pipelineSource,
    repository: REPOSITORY_NAME,
    bucketName: PRODUCTION_ENVIRONMENT.bucketName,
});

const developmentStack = new ServerStack(app, "DevelopmentServerStack", {
    code: Code.fromAsset(path.resolve("../server/")),
    bucketName: DEVELOPMENT_ENVIRONMENT.bucketName,
    env: { region: DEVELOPMENT_ENVIRONMENT.region },
});

const simpleStack = new SimpleStack(app, "SimpleStack");

app.synth();
