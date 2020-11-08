import { HttpApi, HttpMethod, LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
      
export class ServerStack extends Stack {
  public readonly code: any;
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
      
    this.code = Code.fromCfnParameters();

    const contentBucket = new Bucket(this, 'ContentBucket', {
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'error.html',
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY
    })

    const createPostFunction = new Function(this, 'CreatePostFunction', {
      code: this.code,
      handler: 'build/infrastructure/handlers/create-post-handler.handler',
      runtime: Runtime.NODEJS_12_X,
    });
      
    const listPostsFunction = new Function(this, 'ListPostsFunction', {
      code: this.code,
      handler: 'build/infrastructure/handlers/list-posts-handler.handler',
      runtime: Runtime.NODEJS_12_X,
    });

    const postsTable = new Table(this, 'PostsTable', {
        tableName: 'Posts',
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        }
    })

    postsTable.grantWriteData(createPostFunction);
    postsTable.grantReadData(listPostsFunction);
      
    const gateway = new HttpApi(this, 'Gateway', {
        apiName: 'Posts'
    });

    gateway.addRoutes({
        path: '/',
        methods: [ HttpMethod.POST ],
        integration: new LambdaProxyIntegration({
            handler: createPostFunction,
        })
    });

    gateway.addRoutes({
        path: '/',
        methods: [ HttpMethod.GET ],
        integration: new LambdaProxyIntegration({
            handler: listPostsFunction,
        })
    });

    new CfnOutput(this, `${id}Url`, {
        value: `https://${gateway.httpApiId}.execute-api.${this.region}.amazonaws.com/`
    });
  }
}
