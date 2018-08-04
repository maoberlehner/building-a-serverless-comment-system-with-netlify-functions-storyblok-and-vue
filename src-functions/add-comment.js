const axios = require(`axios`);
const slug = require(`slug`);

// You have to generate an API token in the
// Storyblok user interface.
const { API_TOKEN } = process.env;
const API_URL = `https://api.storyblok.com/v1/spaces`;
// You can find the folder id and the space id
// by navigating to the `Comments` folder in
// Storyblok and looking at the URL:
// https://app.storyblok.com/#!/me/spaces/46870/stories/index/191712
const COMMENT_FOLDER_ID = 191712;
const SPACE_ID = 46870;

// We create a new axios instance, pre-configured
// to handle Storyblok API requests.
const storyblok = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: API_TOKEN,
  },
});

function saveComment({ text, title }) {
  const timestamp = Math.round(Date.now() / 1000);

  return storyblok.post(`${SPACE_ID}/stories`, {
    // If you want to approve comments before
    // publishing, you can change this to `0`,
    publish: 1,
    story: {
      content: {
        component: `comment`,
        text,
        title,
      },
      name: title,
      parent_id: COMMENT_FOLDER_ID,
      // We use the current timestamp and the
      // given title to create a unique slug.
      slug: slug(`${title} ${timestamp}`),
    },
  });
}

exports.handler = async (event, context, callback) => {
  try {
    // Do not handle requests if the request
    // type is something other than `POST` or
    // if the request body is empty.
    if (event.httpMethod !== `POST` || !event.body) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ status: `Bad Request` }),
      });
      return;
    }

    const {
      text,
      title,
    } = JSON.parse(event.body);

    // Do not handle requests with missing data.
    if (!text || !title) {
      callback(null, {
        statusCode: 422,
        body: JSON.stringify({ status: `Unprocessable Entity` }),
      });
      return;
    }

    await saveComment({ text, title });

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ status: `success` }),
    });
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ status: `error` }),
    });
  }
};
