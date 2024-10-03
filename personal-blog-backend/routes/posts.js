const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Create a new post
router.post('/add', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get('/get/all_posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single post
router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

// Update a post
router.put('/:id', getPost, async (req, res) => {
  const { title, content } = req.body;
  if (title != null) res.post.title = title;
  if (content != null) res.post.content = content;

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Middleware to get post by ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

module.exports = router;
