const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'mike avi',
        username: 'mike',
        password: '123',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes');
    await expect(locator).toBeVisible();
    // await expect(
    //   page.getByText('Browser can execute only JavaScript')
    // ).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mike', '123');
    await expect(page.getByText('Hello, mike!')).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mike', '123');
    });

    test('a note can be created', async ({ page }) => {
      createNote(page, 'a note created by playwright');
      await expect(
        page.getByText('created a note created by playwright')
      ).toBeVisible();
    });

    describe('and several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note');
        await createNote(page, 'second note');
        await createNote(page, 'third note');
      });

      test.only('importance can be changed', async ({ page }) => {
        await page.pause()
        const noteText = await page.getByText('second note')
        const noteElement = await noteText.locator('..')
        await noteElement
          .getByRole('button', { name: 'Set Unimportant' })
          .click();
        await expect(noteElement.getByText('Set Important')).toBeVisible();
      });
    });
  });

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mike', ' wrong');
    const notificationDiv = await page.locator('.notification');
    await expect(notificationDiv).toContainText('wrong credentials');

    await expect(page.getByText('Hello, mike!')).not.toBeVisible();
  });
});
