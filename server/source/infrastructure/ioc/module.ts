import { config, DynamoDB } from "aws-sdk";
import { PostApplicationService } from "../../application/services/post-application-service";
import { TimestampAgent } from "../agents/timestamp-agent";
import { PostDynamoDBRepository } from "../repositories/post-dynamodb-repository";

export class Module {
    private readonly db: DynamoDB

    private readonly timestampAgent: TimestampAgent
    private readonly postRepository: PostDynamoDBRepository
    
    readonly postApplicationService: PostApplicationService

    constructor() {
        config.update({ region: 'us-west-2' })
        this.db = new DynamoDB({ apiVersion: '2012-08-10' })

        this.timestampAgent = new TimestampAgent();
        this.postRepository = new PostDynamoDBRepository(this.db);
        this.postApplicationService = new PostApplicationService(this.postRepository, this.timestampAgent);
    }
}
