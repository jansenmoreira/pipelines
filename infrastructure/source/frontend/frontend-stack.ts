import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
      
export class FrontEndStack extends Stack {
    readonly bucket: Bucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        this.bucket = new Bucket(this, `${id}ContentBucket`, {
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,        
            websiteIndexDocument: 'index.html',
            bucketName: "application-content-bucket"
        });
    }
}
