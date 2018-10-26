const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const blogRouter = require('./blogRouter');
const bodyParser = require('body-parser');

const {BlogPost} = require('.models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use('/blog-post', router);

BlogPost.create('Title', 'Content', 'Author', 'Date');
BlogPost.create('Blog', 'Blogging', 'Elisabeth Miller', 'October 24th,2018');

app.get('/', (req, res) => {
  res.json(BlogPost.get());
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
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

app.put('/blog-posts/:id', jsonParser, (req, res) => {
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

app.delete('/blog-post/:id', (req, res) => {
  BlogPost.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});