import { Reply } from "../valueobjects/reply";

export interface Post {
    readonly id: string
    readonly title: string
    readonly content: string
    readonly timestamp: number
    readonly replies: Reply[]
}
