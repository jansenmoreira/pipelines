import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront/lib/web_distribution';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
      
export class FrontEndStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        const bucket = new Bucket(this, `${id}ContentBucket`, {
            publicReadAccess: true,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "404.html",
            bucketName: `application-content-bucket-${this.account}`
        });
    }
}
