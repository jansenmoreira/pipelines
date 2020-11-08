import { Post } from "../../domain/entities/post";
import { IdAgent } from "../agents/id-agent";
import { TimestampAgent } from "../agents/timestamp-agent";
import { CreatePostCommand } from "../commands/create-post-command";
import { GetPostsQuery } from "../queries/get-post-query";
import { ListPostsQuery } from "../queries/list-posts-query";
import { PostRepository } from "../repositories/post-repository";

export class PostApplicationService {

    constructor(private postRepository: PostRepository, 
                private timestampAgent: TimestampAgent,
                private idAgent: IdAgent) {
    }

    async listPosts(query: ListPostsQuery): Promise<Post[]> {
        return await this.postRepository.all();
    }

    async getPost(query: GetPostsQuery): Promise<Post> {
        return await this.postRepository.getById(query.id);
    }

    async createPost(command: CreatePostCommand): Promise<string> {
        const id = this.idAgent.generate()
        const timestamp = this.timestampAgent.now()

        const post: Post = {
            id: id,
            title: command.title,
            content: command.content,
            timestamp: timestamp,
        }

        await this.postRepository.save(post);

        return id;
    }

}
