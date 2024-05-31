const reverse = (string) => {
  return string.split('').reverse().join('');
};

const average = (array) => {
  const reducer = (item, sum) => {
    return item + sum;
  };
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const mostBlogs = (blogs) => {
  let authors = {};
  for (let blog of blogs) {
    if (authors.hasOwnProperty(blog.author)) {
      authors = { ...authors, [blog.author]: authors[blog.author] + 1 };
    } else {
      authors = { ...authors, [blog.author]: 1 };
    }
  }
  let max = 0;
  let topAuthor = {};
  Object.keys(authors).forEach((a) => {
    if (authors[a] > max) {
      topAuthor = { author: a, blogs: authors[a] };
      max = authors[a];
    }
  });
  return topAuthor;
};

const mostLikes = (blogs) => {
  let authors = {};
  for (let blog of blogs) {
    if (authors.hasOwnProperty(blog.author)) {
      authors = { ...authors, [blog.author]: authors[blog.author] + blog.likes };
    } else {
      authors = { ...authors, [blog.author]: blog.likes };
    }
  }
  let max = 0;
  let topAuthor = {};
  Object.keys(authors).forEach((a) => {
    if (authors[a] > max) {
      topAuthor = { author: a, likes: authors[a] };
      max = authors[a];
    }
  });
  return topAuthor;
};


module.exports = {
  reverse,
  average,
  mostBlogs,
  mostLikes
};
