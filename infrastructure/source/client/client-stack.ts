import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
      
export class ClientStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        const bucket = new Bucket(this, `${id}ContentBucket`, {
            publicReadAccess: true,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            bucketName: 'jansenmoreira.com.br'
        });
    }
}
