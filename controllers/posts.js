import User from "../models/user.js";
import Post from "../models/posts.js";

// ✅ Create Post
export const CreatePost = async (req, res) => {
  try {
    const { description } = req.body;
    const picturePath = req.file ? req.file.filename : "";

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.userPicturePath,
      likes: new Map(),
      comments: [],
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Posts (Feed)
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching posts for userId:", userId);
    const posts = await Post.find({ userId });
    console.log("Posts found:", posts.length);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// ✅ Like or Unlike a Post
export const likePosts = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Add a Comment to a Post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentText } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId: req.user._id,
      text: commentText,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Post Statistics for a User
export const countUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });

    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.size, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    res.status(200).json({
      stats: {
        totalPosts,
        totalLikes,
        totalComments,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
