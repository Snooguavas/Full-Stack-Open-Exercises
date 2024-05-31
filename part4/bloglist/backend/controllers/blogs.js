const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, blogs } = request.body;
  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
    blogs: blogs || [],
  });

  const savedBlog = await blog.save();
  await savedBlog.populate('user', { username: 1, name: 1 });
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    console.log('user: ', request.user);
    const blog = await Blog.findById(request.params.id);
    if (request.user._id.toString() !== blog.user.toString()) {
      return response.status(401).json({ error: 'token invalid' });
    }
    await blog.deleteOne();
    response.status(204).end();
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
    author: body.author,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  await updatedBlog.populate('user', { username: 1, name: 1 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
