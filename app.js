
const express = require('express');
const axios = require('axios');
const lodashh = require('lodash');

const app = express();
app.use(express.json());

const URL = 'https://intent-kit-16.hasura.app/api/rest/BLOGS';
const SECRET = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get(URL, {
      headers: {
        'x-hasura-admin-secret': SECRET
      }
    });

    const BLOGS = response.data;
    const TOTAL_BLOGS = BLOGS.length;
    const LONGEST_BLOG = lodashh.maxBy(BLOGS, 'title.length').title;
    const BLOG_PRIVACY = lodashh.filter(BLOGS, blog => blog.title.toLowerCase().includes('privacy'));
    const UNIQUE_TITLES = lodashh.uniqBy(BLOGS, 'title').map(blog => blog.title);

    const stats = {
      TOTAL_BLOGS,
      LONGEST_BLOG,
      BLOG_PRIVACY: BLOG_PRIVACY.length,
      UNIQUE_TITLES
    };

    res.json(stats);
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/blog-search', (req, res) => {
  const query = req.query.query.toLowerCase(); 
  try {
    const MATCHING_BLOGS = lodashh.filter(BLOGS, blog => blog.title.toLowerCase().includes(query));

    res.json(MATCHING_BLOGS);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

