const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const blogRouter = require('./blogRouter');

const {BlogPost} = require('.models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use('/blog-post', router);

BlogPost.create('Blog1', 'Bloggings', 'Elisabeth Miller', 'October 25th, 2018');
BlogPost.create('Blog2', 'Bloggings2', 'Elisabeth Miller', 'October 24th,2018');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/blog-post', (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'date'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const blog = BlogPost.create(req.body.title, req.body.content, req.body.author, req.body.date);
  res.status(201).json(blog);
});

router.put('/blog-[ost/:id', (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'date'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message); 
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPost.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: req.body.date
  });
  res.status(204).end();
});

router.delete('/blog-post/:id', (req, res) => {
  BlogPost.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});