import { Post } from "../../domain/entities/post";
import { PostService } from "../../domain/services/post-service";
import { PostRepository } from "../../infrastructure/repositories/post-repository";
import { CreatePostCommand } from "../commands/create-post-command";
import { ReplyPostCommand } from "../commands/reply-post-dto";
import { ListPostsQuery } from "../queries/list-posts-query";

export class PostApplicationService {

    constructor(private postRepository: PostRepository, private postService: PostService) {

    }

    async listPosts(query: ListPostsQuery): Promise<Post[]> {
        return await this.postRepository.all();
    }

    async replyPost(command: ReplyPostCommand): Promise<void> {
        const post: Post = await this.postRepository.getById(command.postId);

        const updatedPost: Post = this.postService.addReply(post, command.content);

        await this.postRepository.save(updatedPost);
    }

    async createPost(command: CreatePostCommand): Promise<void> {
        const post: Post = this.postService.createPost(command.id, command.title, command.content);

        await this.postRepository.save(post);
    }

}
