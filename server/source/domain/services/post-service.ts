import { Post } from "../entities/post";
import { TimestampService } from "./timestamp-service";

export class PostService {

    constructor(private timestampService: TimestampService) {
        
    }

    createPost(id: string, title: string, content: string): Post {
        return {
            id: id,
            title: title,
            content: content,
            timestamp: this.timestampService.now(),
            replies: []
        }
    }
    
    addReply(post: Post, reply: string): Post {
        return {
            ...post,
            replies: [...post.replies, {
                timestamp: this.timestampService.now(),
                content: reply
            }]
        }
    }

}
