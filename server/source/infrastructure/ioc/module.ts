import { PostApplicationService } from "../../application/services/post-application-service";
import { PostService } from "../../domain/services/post-service";
import { TimestampService } from "../../domain/services/timestamp-service";
import { PostDynamoDBRepository } from "../repositories/post-dynamodb-repository";
import { config, DynamoDB } from "aws-sdk"

export class Module {
    private readonly db: DynamoDB

    private readonly timestampService: TimestampService
    private readonly postService: PostService
    private readonly postRepository: PostDynamoDBRepository
    
    readonly postApplicationService: PostApplicationService

    constructor() {
        config.update({ region: 'us-west-2' })
        this.db = new DynamoDB({ apiVersion: '2012-08-10' })

        this.timestampService = new TimestampService();
        this.postService = new PostService(this.timestampService);
        this.postRepository = new PostDynamoDBRepository(this.db);
        this.postApplicationService = new PostApplicationService(this.postRepository, this.postService);
    }
}
