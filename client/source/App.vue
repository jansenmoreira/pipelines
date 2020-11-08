<template>
    <div class="app">
        <div class="create-post card">
            <form @submit="sendPost">
                <div class="create-post-title">
                    <label for="new-post-title">Título</label>
                    <input type="text" id="new-post-title" v-model="createPostCommand.title" />
                </div>
                <div class="create-post-content">
                    <label for="new-post-content">Conteúdo</label>
                    <textarea id="new-post-content" v-model="createPostCommand.content"> </textarea>
                </div>
                <div class="create-post-send">
                    <button>Enviar</button>
                </div>
            </form>
        </div>
        <template v-if="loading">
            <div class="card">
                Loading Data...
            </div>
        </template>
        <template v-if="!loading">
            <div class="posts">
                <div v-for="post of posts" :key="post.id" class="post card">
                    <div class="post-title">{{ post.title }}</div>
                    <div class="post-timestamp">{{ formattedDate(post.timestamp) }}</div>
                    <div class="post-content">{{ post.content }}</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

interface CreatePostCommand {
    readonly title: string;
    readonly content: string;
}

interface Post {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly timestamp: number;
}

@Component
export default class App extends Vue {
    private url: string;

    loading: boolean = true;
    posts: Post[] = [];

    createPostCommand: CreatePostCommand = {
        title: "",
        content: "",
    };

    async mounted() {
        await this.getConfig();
        await this.getPosts();
        this.loading = false;
    }

    private async getConfig(): Promise<void> {
        const response = await fetch("/config.json");
        const config = await response.json();
        this.url = config.api;
    }

    private async getPosts(): Promise<void> {
        const response = await fetch(this.url);
        const posts: Post[] = await response.json();
        this.posts = [...posts.sort((a, b) => -1 * (a.timestamp - b.timestamp))];
    }

    formattedDate(timestamp: number) {
        const date = new Date(timestamp);
        return date.toLocaleString("pt-BR");
    }

    async sendPost(event) {
        event.preventDefault();

        const createRespose = await fetch(this.url, {
            method: "POST",
            body: JSON.stringify(this.createPostCommand),
        });

        const id = (await createRespose.json()).id;

        const getResponse = await fetch(`${this.url}${id}`);

        const post = await getResponse.json();

        this.posts = [post, ...this.posts];

        this.createPostCommand = {
            title: "",
            content: "",
        };

        return false;
    }
}
</script>

<style>
html {
    font-size: 62.5%;
}

body {
    font-size: 1.6rem;
    font-family: Arial, Helvetica, sans-serif;
    background: #efefef;
}

.app {
    max-width: 800px;
    margin: 0 auto;
}

.card {
    margin: 2rem;
    padding: 2rem;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    background: #fff;
    border-radius: 0.5rem;
}

.posts .post-title {
    font-size: 2rem;
    font-weight: 700;
}

.posts .post-timestamp {
    color: #777;
    margin-top: 0.5rem;
}

.posts .post-content {
    margin-top: 1rem;
}

.create-post-title,
.create-post-content {
    margin-bottom: 1rem;
}

.create-post-title label,
.create-post-content label {
    font-weight: 700;
    display: block;
    line-height: 3rem;
}

.create-post-title input,
.create-post-content textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid #ccc;
    font-family: Arial, Helvetica, sans-serif;
    resize: vertical;
}

.create-post-send {
    text-align: right;
}

.create-post-send button {
    font-weight: 700;
    border: 1px solid #ccc;
    background-color: #eee;
    padding: 1rem;
}

.create-post-send button:hover {
    background-color: #ddd;
}
</style>
