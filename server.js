const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPost} = require('.models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('commom'));

BlogPost.create('Title', 'Content', 'Author', 'Date');
BlogPost.create('Blog', 'Blogging', 'Elisabeth Miller', 'October 24th,2018');

app.get('/blog-posts', (req, res) => {
  res.json(BlogPost.get());
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
    id: 
  })
}