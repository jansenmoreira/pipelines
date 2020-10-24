import { App } from '@aws-cdk/core';
import { ServerStack } from './server/server-stack';
import { ClientStack } from './client/client-stack';
import { PipelineStack } from './pipeline/pipeline-stack';

const REPOSITORY_NAME = "pipeline";

const app = new App();

const clientStack = new ClientStack(app, 'ClientStack');

const serverStack = new ServerStack(app, 'ServerStack');

const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  code: serverStack.code,
  repository: REPOSITORY_NAME
});

app.synth();
