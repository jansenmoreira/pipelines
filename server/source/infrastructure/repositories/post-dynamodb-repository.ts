import { DynamoDB } from "aws-sdk";
import { GetItemInput, PutItemInput, QueryInput } from "aws-sdk/clients/dynamodb";
import { Post } from "../../domain/entities/post";
import { PostRepository } from "./post-repository";



export class PostDynamoDBRepository implements PostRepository {
    private static readonly TABLE_NAME: string = "Posts"


    constructor(private db: DynamoDB) {
    }

    async all(): Promise<Post[]> {
        const input: QueryInput = {
            TableName: PostDynamoDBRepository.TABLE_NAME
        }

        const output = await this.db.query(input).promise();

        if (output.Items === undefined) {
            throw new Error("Posts not found!")
        }

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
