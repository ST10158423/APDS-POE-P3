import express from 'express';
const router = express.Router();

// Dummy data for demonstration
let posts = [
  { id: 1, title: 'Post 1', content: 'This is the first post' },
  { id: 2, title: 'Post 2', content: 'This is the second post' }
];

// Route: GET "/"
// Description: Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// Route: GET "/:id"
// Description: Get a specific post by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === parseInt(id));
  if (!post) return res.status(404).json({ message: `Post with ID ${id} not found` });
  res.json(post);
});

// Route: POST "/upload"
// Description: Create a new post
router.post('/upload', (req, res) => {
  const { title, content } = req.body;

  // Create a new post object
  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };

  // Add the new post to the list of posts
  posts.push(newPost);

  // Send a response with the new post
  res.status(201).json(newPost);
});

// Route: PATCH "/:id"
// Description: Update a post by ID
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Find the post by ID
  const post = posts.find(p => p.id === parseInt(id));
  if (!post) return res.status(404).json({ message: `Post with ID ${id} not found` });

  // Update the post's properties
  if (title) post.title = title;
  if (content) post.content = content;

  res.json({ message: `Post with ID ${id} updated successfully`, post });
});

// Route: DELETE "/:id"
// Description: Delete a post by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Find the index of the post to be deleted
  const postIndex = posts.findIndex(p => p.id === parseInt(id));
  if (postIndex === -1) return res.status(404).json({ message: `Post with ID ${id} not found` });

  // Remove the post from the list
  const deletedPost = posts.splice(postIndex, 1);

  res.json({ message: `Post with ID ${id} deleted successfully`, deletedPost });
});

export default router;
