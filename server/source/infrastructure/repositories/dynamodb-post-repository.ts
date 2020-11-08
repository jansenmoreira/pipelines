import { DynamoDB } from "aws-sdk";
import { GetItemInput, PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { PostRepository } from "../../application/repositories/post-repository";
import { Post } from "../../domain/entities/post";

export class PostDynamoDBRepository implements PostRepository {
    private static readonly TABLE_NAME: string = "Posts"

    constructor(private db: DynamoDB) {
    }

    async all(): Promise<Post[]> {
        const input: ScanInput = {
            TableName: PostDynamoDBRepository.TABLE_NAME
        }

        const output = await this.db.scan(input).promise();

        return output.Items.map(item => DynamoDB.Converter.unmarshall(item) as Post)
    }

    async getById(id: string): Promise<Post> {
        const input: GetItemInput = {
            TableName: PostDynamoDBRepository.TABLE_NAME,
            Key: { 'id': { S: id } }
        }

        const output = await this.db.getItem(input).promise();

        if (output.Item === undefined) {
            throw new Error("Post not found!")
        }

        return DynamoDB.Converter.unmarshall(output.Item) as Post;
    }

    async save(post: Post): Promise<void> {
        const input: PutItemInput = {
            TableName: PostDynamoDBRepository.TABLE_NAME,
            Item: DynamoDB.Converter.marshall(post)
        }

        await this.db.putItem(input).promise();
    }

}
