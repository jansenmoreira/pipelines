import { App } from '@aws-cdk/core';
import { ApplicationStack } from './application/application-stack';
import { FrontEndStack } from './frontend/frontend-stack';
import { PipelineStack } from './pipeline/pipeline-stack';

const REPOSITORY_NAME = "pipeline";

const app = new App();

const frontEndStack = new FrontEndStack(app, 'FrontEndStack');

const applicationStack = new ApplicationStack(app, 'ApplicationStack');

const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  code: applicationStack.code,
  repository: REPOSITORY_NAME
});

app.synth();
