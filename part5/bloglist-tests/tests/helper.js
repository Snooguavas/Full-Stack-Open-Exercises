const loginWith = async (page, username, password) => {
  await page.getByTestId('username-input').fill(username);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('login-button').click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New blog' }).click();

  await page.getByTestId('title-input').fill(title);
  await page.getByTestId('author-input').fill(author);
  await page.getByTestId('url-input').fill(url);
  await page.getByTestId('post-button').click();

  await page.getByText(title, { exact: true }).waitFor();
};

const likeBlog = async (page, blogTitle, likesAmount) => {
  const blog = await getBlogElement(page, blogTitle);
  await blog.getByTestId('view-button').click();
  for (let i = 0; i < likesAmount; i++) {
  await blog.getByTestId('like-button').click();
  await blog.getByText(`likes: ${i + 1}`).waitFor()
  }
};

const getBlogElement = async (page, blogTitle) => {
  const blogText = await page.getByText(blogTitle, { exact: true });
  return await blogText.locator('..');
};

export { loginWith, createBlog, likeBlog, getBlogElement };
