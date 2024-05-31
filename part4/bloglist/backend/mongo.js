const mongoose = require('mongoose');
const config = require('./utils/config');
const Blog = require('./models/blog');

mongoose.connect(config.MONGODB_URI).then(() => {
  Blog.deleteMany({}).then(() => {
    mongoose.connection.close();
  });
});
