import express from 'express';

const router = express.Router();
// Initialize categories array to save data in memory
const posts = [];

// Get all posts
router.get('/', (req, res) => {
  res.status(200).json(posts);
});

// Get posts by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;

  const postByCategory = posts.filter((p) => p.category === category);

  res.status(200).json(postByCategory);
});

// Get post by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.status(200).json(post);
});

// Create post
router.post('/', (req, res) => {
  const { title, image, description, category } = req.body;

  if (!title || !image || !description || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newPost = {
    id: Date.now().toString(),
    ...req.body
  };

  posts.push(newPost);

  res.status(201).json(newPost);
});

// Create post comment
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const newComment = {
    id: new Date().toString(),
    author,
    content
  };

  if (!post.comments) post.comments = [];

  post.comments.push(newComment);

  res.status(201).json(newComment);
});

// Update post
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const categoryIndex = posts.findIndex((p) => p.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const updatedCategory = { ...posts[categoryIndex] };
  for (const key in updatedCategory) {
    if (req.body[key]) updatedCategory[key] = req.body[key];
  }

  posts[categoryIndex] = { ...updatedCategory };

  res.status(200).json(updatedCategory);
});

// Delete post
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const categoryIndex = posts.findIndex((p) => p.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  posts.splice(categoryIndex, 1);

  res.status(204).send();
});

export default router;
