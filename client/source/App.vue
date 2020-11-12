<template>
  <div class="app">
    <div class="create-post card">
      <form @submit="sendPost">
        <div class="create-post-title">
          <label for="new-post-title">Título</label>
          <input
            type="text"
            id="new-post-title"
            v-model="createPostCommand.title"
            required
          />
        </div>
        <div class="create-post-content">
          <label for="new-post-content">Conteúdo</label>
          <textarea
            id="new-post-content"
            v-model="createPostCommand.content"
            required
          >
          </textarea>
        </div>
        <div class="create-post-send">
          <button>Enviar</button>
        </div>
      </form>
    </div>
    <div class="posts">
      <div v-for="post of posts" :key="post.id" class="post card">
        <div class="post-title">{{ post.title }}</div>
        <div class="post-timestamp">{{ formattedDate(post.timestamp) }}</div>
        <div class="post-content">{{ post.content }}</div>
      </div>
    </div>
    <div v-if="loading" class="spinner">
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
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
    const response = await fetch(this.apiUrl("post"));
    const posts: Post[] = await response.json();
    this.posts = [...posts.sort((a, b) => -1 * (a.timestamp - b.timestamp))];
  }

  formattedDate(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR");
  }

  apiUrl(path: string): string {
    return `${this.url}${path}`;
  }

  async sendPost(event) {
    event.preventDefault();

    if (this.createPostCommand.title === "") {
      return;
    }

    if (this.createPostCommand.content === "") {
      return;
    }

    this.loading = true;

    const createRespose = await fetch(this.apiUrl("post"), {
      method: "POST",
      body: JSON.stringify(this.createPostCommand),
    });

    const id = (await createRespose.json()).id;

    const getResponse = await fetch(this.apiUrl(`post/${id}`));

    const post = await getResponse.json();

    this.posts = [post, ...this.posts];

    this.createPostCommand = {
      title: "",
      content: "",
    };

    this.loading = false;

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

.spinner {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
