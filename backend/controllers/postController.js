import Post from "../models/postModel.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, createdBy: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "username email");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
