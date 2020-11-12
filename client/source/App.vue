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
          />
        </div>
        <div class="create-post-content">
          <label for="new-post-content">Conteúdo</label>
          <textarea id="new-post-content" v-model="createPostCommand.content">
          </textarea>
        </div>
        <div class="create-post-send">
          <button
            :disabled="
              createPostCommand.title === '' || createPostCommand.content === ''
            "
          >
            Enviar
          </button>
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

  isSendPostEnabled() {
    if (this.createPostCommand.title === "") {
      return false;
    }

    if (this.createPostCommand.content === "") {
      return false;
    }

    return true;
  }

  async sendPost(event) {
    event.preventDefault();

    if (!this.isSendPostEnabled()) {
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
