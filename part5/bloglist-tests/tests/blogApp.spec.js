const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog, likeBlog, getBlogElement } = require('./helper');
const { create } = require('domain');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');

    await request.post('http://localhost:3001/api/users', {
      data: { name: 'mike', username: 'mike', password: '123' },
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to application')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mike', '123');
      await expect(page.getByText('mike logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mike', 'wrong');
      await expect(
        page.getByText('invalid username or password')
      ).toBeVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mike', '123');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created in testing',
        'playwright',
        'test-url'
      );
      await expect(
        page.getByText('a blog created in testing', { exact: true })
      ).toBeVisible();
    });

    describe('when there are some blogs', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blog one', 'some author', 'some-url');
        await createBlog(page, 'blog two', 'some author', 'some-url');
        await createBlog(page, 'blog three', 'some author', 'some-url');
      });

      test('a blog can be liked', async ({ page }) => {
        const blogElement = await getBlogElement(page, 'blog one');
        await blogElement.getByTestId('view-button').click();

        await expect(blogElement.getByText('likes: 0')).toBeVisible();
        await blogElement.getByTestId('like-button').click();
        await expect(blogElement.getByText('likes: 1')).toBeVisible();
      });

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept();
        });
        const blogElement = await getBlogElement(page, 'blog two');
        await blogElement.getByTestId('delete-button').click();

        await expect(page.getByText('removed blog two')).toBeVisible();
        await expect(blogElement).not.toBeVisible();
      });

      test('delete button is only visible to the blog creator', async ({
        page,
        request,
      }) => {
        await request.post('http://localhost:3001/api/users', {
          data: { name: 'someone', username: 'userTwo', password: '123' },
        });

        await page.getByTestId('logout-button').click();
        await loginWith(page, 'userTwo', '123');

        await createBlog(page, 'blog from user two', 'user two', 'nourl');

        const ownBlog = await getBlogElement(page, 'blog from user two');
        await expect(ownBlog.getByTestId('delete-button')).toBeVisible();

        const otherBlog = await getBlogElement(page, 'blog one');
        await expect(otherBlog.getByTestId('delete-button')).not.toBeVisible();
      });

      test('blogs are arranged according to likes', async ({ page }) => {
        await likeBlog(page, 'blog two', 2);
        await likeBlog(page, 'blog three', 1);
        await page.pause();
        const blogList = await page.locator('li');
        await expect(blogList.nth(0)).toHaveText(/blog two/);
        await expect(blogList.nth(1)).toHaveText(/blog three/);
        await expect(blogList.nth(2)).toHaveText(/blog one/);
      });
    });
  });
});
