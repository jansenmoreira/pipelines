import { App } from "@aws-cdk/core";
import { PipelineStack } from "./pipeline/pipeline-stack";
import { ServerStack } from "./server/server-stack";

const REPOSITORY_NAME = "pipeline";

const app = new App();

const serverStack = new ServerStack(app, "ServerStack");

const pipelineStack = new PipelineStack(app, "PipelineStack", {
    code: serverStack.code,
    repository: REPOSITORY_NAME,
});

app.synth();
