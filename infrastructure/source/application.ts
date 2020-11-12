import { App } from "@aws-cdk/core";
import { PipelineStack } from "./pipeline/pipeline-stack";
import { SimpleStack } from "./sample/SimpleStack";
import { ServerStack } from "./server/server-stack";

const app = new App();

const REPOSITORY_NAME = "pipeline";

const serverStack = new ServerStack(app, "ServerStack");

const pipelineStack = new PipelineStack(app, "PipelineStack", {
    code: serverStack.code,
    repository: REPOSITORY_NAME,
});

const simpleStack = new SimpleStack(app, "SimpleStack");

app.synth();
