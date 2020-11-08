import { Post } from "../../domain/entities/post";

export interface PostRepository {
    all(): Promise<Post[]>;

    getById(id: string): Promise<Post>;

    save(post: Post): Promise<void>;
}
