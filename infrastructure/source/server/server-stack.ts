import { HttpApi, HttpMethod, LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime }  from '@aws-cdk/aws-lambda';
import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb"
      
export class ServerStack extends Stack {
  public readonly code: any;
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
      
    this.code = Code.fromCfnParameters();

    const postTable = new Table(this, "PostTable", {
        tableName: "POSTS",
        partitionKey: {
            name: "ID",
            type: AttributeType.STRING
        }
    })
      
    const createPostFunction = new Function(this, `CreatePostFunction`, {
      code: this.code,
      handler: 'build/infrastructure/handlers/create-post-handler.handler',
      runtime: Runtime.NODEJS_12_X,
    });

    postTable.grantWriteData(createPostFunction);
      
    const listPostsFunction = new Function(this, `ListPostsFunction`, {
      code: this.code,
      handler: 'build/infrastructure/handlers/list-posts-handler.handler',
      runtime: Runtime.NODEJS_12_X,
    });

    postTable.grantReadData(listPostsFunction);

    const createPostIntegration = new LambdaProxyIntegration({
        handler: createPostFunction,
    });

    const listPostsIntegration = new LambdaProxyIntegration({
        handler: listPostsFunction,
    });
      
    const postsGateway = new HttpApi(this, `PostsGateway`, {
        apiName: 'Posts',
        description: 'Api Gateway for Posts Lambda'
    });

    postsGateway.addRoutes({
        path: '/',
        methods: [ HttpMethod.POST ],
        integration: createPostIntegration
    });

    postsGateway.addRoutes({
        path: '/',
        methods: [ HttpMethod.GET ],
        integration: listPostsIntegration
    });

    new CfnOutput(this, `${id}Url`, {
        value: `https://${postsGateway.httpApiId}.execute-api.${this.region}.amazonaws.com/`
    });
  }
}
