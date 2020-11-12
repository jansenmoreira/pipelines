import { DynamoDB } from "aws-sdk";
import { IdAgent } from "../../application/agents/id-agent";
import { TimestampAgent } from "../../application/agents/timestamp-agent";
import { PostApplicationService } from "../../application/services/post-application-service";
import { DateTimestampAgent } from "../agents/date-timestamp-agent";
import { UuidIdAgent } from "../agents/uuid-id-agent";
import { PostDynamoDBRepository } from "../repositories/dynamodb-post-repository";

export class Module {
    private readonly db: DynamoDB;

    private readonly idAgent: IdAgent;
    private readonly timestampAgent: TimestampAgent;
    private readonly postRepository: PostDynamoDBRepository;

    readonly postApplicationService: PostApplicationService;

    constructor() {
        this.db = new DynamoDB({ apiVersion: "2012-08-10" });

        this.idAgent = new UuidIdAgent();
        this.timestampAgent = new DateTimestampAgent();
        this.postRepository = new PostDynamoDBRepository(this.db);

        this.postApplicationService = new PostApplicationService(
            this.postRepository,
            this.timestampAgent,
            this.idAgent
        );
    }
}
