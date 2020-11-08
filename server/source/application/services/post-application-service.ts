import { Post } from "../../domain/entities/post";
import { TimestampAgent } from "../../infrastructure/agents/timestamp-agent";
import { PostRepository } from "../../infrastructure/repositories/post-repository";
import { CreatePostCommand } from "../commands/create-post-command";
import { ListPostsQuery } from "../queries/list-posts-query";

export class PostApplicationService {

    constructor(private postRepository: PostRepository, private timestampAgent: TimestampAgent) {
    }

    async listPosts(query: ListPostsQuery): Promise<Post[]> {
        return await this.postRepository.all();
    }

    async createPost(command: CreatePostCommand): Promise<void> {
        const post: Post = {
            id: command.id,
            title: command.title,
            content: command.content,
            timestamp: this.timestampAgent.now(),
        }
        await this.postRepository.save(post);
    }

}
