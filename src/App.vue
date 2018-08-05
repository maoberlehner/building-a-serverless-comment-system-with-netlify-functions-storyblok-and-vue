<template>
  <div
    id="app"
    class="App o-container o-container--s o-vertical-spacing o-vertical-spacing--xxl"
  >
    <template v-if="story">
      <div class="App__article o-vertical-spacing">
        <h1>{{ story.content.title }}</h1>
        <div
          class="o-content"
          v-html="md(story.content.text)"
        />
      </div>

      <div class="App__comments o-vertical-spacing o-vertical-spacing--l">
        <h2>Comments</h2>

        <form
          class="App__commentForm o-vertical-spacing o-vertical-spacing--s"
          @submit.prevent="addComment"
        >
          <div>
            <label for="title">Title</label>
            <input
              id="title"
              v-model="title"
            >
          </div>

          <div>
            <label for="text">Text</label>
            <textarea
              id="text"
              v-model="text"
              rows="5"
            />
          </div>
          <button>Add comment</button>
        </form>

        <div class="App__commentListing o-vertical-spacing">
          <div
            v-for="comment in comments"
            :key="comment.uuid"
            class="App__comment o-vertical-spacing o-content"
          >
            <h3>{{ comment.content.title }}</h3>
            <p>{{ comment.content.text }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import marked from 'marked';

import api from './utils/api';

export default {
  name: `App`,
  data() {
    return {
      newComments: [],
      story: null,
      text: ``,
      title: ``,
    };
  },
  computed: {
    comments() {
      if (!this.story) return this.newComments;

      // Merge the comments from the API
      // response with the newly created
      // comments and sort them by
      // creation date.
      return [
        ...this.story.content.comments,
        ...this.newComments,
      ].sort((a, b) => a.created_at < b.created_at);
    },
  },
  created() {
    this.loadStory();
    this.md = marked;
  },
  methods: {
    async addComment() {
      const { text, title } = this;

      this.text = ``;
      this.title = ``;

      // Add the comment immediately and hope
      // that the request succeeds. This is
      // called "optimistic UI".
      this.newComments.push({
        content: {
          text,
          title,
        },
        created_at: new Date().toISOString(),
        uuid: Date.now(),
      });

      // Send the data to the endpoint
      // provided by our Serverless Function.
      await axios.post(`.netlify/functions/add-comment`, {
        articleId: this.story.id,
        text,
        title,
      });
    },
    async loadStory() {
      // Load the story with the slug `home`
      // and all comments related to the story.
      const response = await api.get(`cdn/stories/home`, { resolve_relations: `comments` });
      this.story = response.data.story;
    },
  },
};
</script>

<style lang="scss">
@import './assets/scss/settings/spacings';
@import './assets/scss/generic/base';
@import '{
  .o-container,
  .o-container--s,
} from ~@avalanche/object-container';
@import '{
  .o-vertical-spacing,
  .o-vertical-spacing--s,
  .o-vertical-spacing--l,
  .o-vertical-spacing--xxl,
} from ~@avalanche/object-vertical-spacing';
@import './assets/scss/objects/content';

.App {
  padding-top: setting-spacing(xl);
  padding-bottom: setting-spacing(xl);

  &__comment {
    padding: setting-spacing(m);
    border: 1px solid #dedede;
    font-size: 0.75em;
  }

  input,
  textarea {
    display: block;
    padding: setting-spacing(s);
    width: 100%;
    border: 1px solid #dedede;
  }
}
</style>
