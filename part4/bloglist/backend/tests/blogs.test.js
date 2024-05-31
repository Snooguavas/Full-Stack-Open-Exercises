const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const listHelper = require('../utils/list_helper');
const forTesting = require('../utils/for_testing');

const User = require('../models/user');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const listWithOne = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
];
describe('blog posts tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of initialBlogs) {
      const blogObj = new Blog(blog);
      await blogObj.save();
    }

    await User.deleteMany({});
    const user = {
      username: 'michael',
      password: '12345',
      name: 'mike',
    };
    await api.post('/api/users').send(user).expect(201);
  });

  test('dummy returns 1', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);

    assert.strictEqual(result, 1);
  });

  describe('total likes', () => {
    test('many are calculated correctly', () => {
      const result = listHelper.totalLikes(initialBlogs);

      assert.strictEqual(result, 36);
    });

    test('list with one is equal to the likes of that one', () => {
      const result = listHelper.totalLikes(listWithOne);

      assert.strictEqual(result, 7);
    });

    test('empty list equals to zero', () => {
      const result = listHelper.totalLikes([]);

      assert.strictEqual(result, 0);
    });
  });

  test('can find author with most blogs', () => {
    const topAuthor = forTesting.mostBlogs(initialBlogs);

    assert.strictEqual(topAuthor.author, 'Robert C. Martin');
    assert.strictEqual(topAuthor.blogs, 3);
  });

  test('finds author with most likes', () => {
    const topAuthor = forTesting.mostLikes(initialBlogs);

    assert.strictEqual(topAuthor.author, 'Edsger W. Dijkstra');
    assert.strictEqual(topAuthor.likes, 17);
  });

  describe('favorite blog', () => {
    test('finds favorite in list of many', () => {
      const result = listHelper.favoriteBlog(initialBlogs);

      assert.deepStrictEqual(result, initialBlogs[2]);
    });

    test('list of one returns that one', () => {
      const result = listHelper.favoriteBlog(listWithOne);

      assert.deepStrictEqual(result, listWithOne[0]);
    });
  });

  test('blogs are returned as JSON', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('id is returned and named correctly', async () => {
    const res = await api.get('/api/blogs');
    const blogsList = res.body;
    for (let blog of blogsList) {
      assert(blog.hasOwnProperty('id'));
    }
  });

  describe('creating blogs', () => {
    test('blog post can be created', async () => {
      const newBlog = {
        title: 'Test new blog',
        author: 'test author',
        url: 'https://test.test/',
        likes: 12,
      };

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'michael', password: '12345' })
        .expect(200);

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsInEnd = await listHelper.blogsInDb();

      assert.strictEqual(blogsInEnd.length, initialBlogs.length + 1);

      const titles = blogsInEnd.map((blog) => blog.title);
      assert(titles.includes(newBlog.title));
    });

    test('new blog request without token is rejected with proper statuscode', async () => {
      const newBlog = {
        title: 'Test new blog',
        author: 'test author',
        url: 'https://test.test/',
        likes: 12,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    });


    test('new blog with no likes is created with 0 likes', async () => {
      const newBlog = {
        title: 'blog with no likes',
        author: 'test author',
        url: 'https://test.test/',
      };

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'michael', password: '12345' })
        .expect(200);

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)
        .expect(201);

      assert.deepStrictEqual(res.body.likes, 0);
    });

    describe('invalid blogs cannot be created', () => {
      test('no url', async () => {
        const newBlog = {
          title: 'blog with no url',
          author: 'test author',
        };

        const loggedUser = await api
          .post('/api/login')
          .send({ username: 'michael', password: '12345' })
          .expect(200);

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${loggedUser.body.token}`)
          .send(newBlog)
          .expect(400);
      });

      test('no title', async () => {
        const newBlog = {
          author: 'test author',
          url: 'https://test.test/',
        };

        const loggedUser = await api
          .post('/api/login')
          .send({ username: 'michael', password: '12345' })
          .expect(200);

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${loggedUser.body.token}`)
          .send(newBlog)
          .expect(400);
      });
    });
  });

  describe('deleting a blog', () => {
    beforeEach(async () => {
      const newBlog = {
        title: 'test blog to delete',
        author: 'test author',
        url: 'https://test.test/',
        likes: 12,
      };

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'michael', password: '12345' })
        .expect(200);

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });

    test('a blog can be deleted', async () => {
      const blogsAtStart = await listHelper.blogsInDb();
      const blogToDelete = await Blog.findOne({ title: 'test blog to delete' });

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'michael', password: '12345' })
        .expect(200);

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(204);

      const blogsAtEnd = await listHelper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test('invalid id fails with statuscode 400', async () => {
      const invalidId = '123a';
      const blogsAtStart = await listHelper.blogsInDb();

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'michael', password: '12345' })
        .expect(200);

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(400);

      const blogsAtEnd = await listHelper.blogsInDb();

      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
    });
  });

  describe('updating a blog', () => {
    test('blogs likes can be updated', async () => {
      const blogsAtStart = await listHelper.blogsInDb();
      const updatedBlog = {
        ...blogsAtStart[0],
        likes: blogsAtStart[0].likes + 1,
      };

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(updatedBlog)
        .expect(200);

      const blogsAtEnd = await listHelper.blogsInDb();
      assert.deepStrictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes + 1);
    });
  });
});

describe('users tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', password: '123' });
    await user.save();
  });

  test('valid user can be created', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { username: 'snoo', name: 'mike', password: 'abc' };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);

    assert(usernames.includes(newUser.username));
  });

  test('duplicate usernames are rejected with proper statuscode', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { username: 'root', password: '123' };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('empty password is rejected', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { username: 'mike' };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('empty username is rejected', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { password: '123' };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('short password is rejected', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { username: 'mike', password: '12' };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('short username is rejected', async () => {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = { username: 'mi', password: '123' };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await listHelper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
