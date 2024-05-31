const Blog = require('../models/blog');
const User = require('../models/user');

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return blog.likes + sum;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (favorite, current) => {
    if (current.likes > favorite.likes) {
      return current;
    }
    return favorite;
  };

  return blogs.reduce(reducer, blogs[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogsInDb,
  usersInDb,
};
