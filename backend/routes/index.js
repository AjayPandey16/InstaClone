const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Notification = require('../models/notificationModel');
const Message = require('../models/messageModel');
const Story = require('../models/storyModel');
const { requireAuth, signToken } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
];

const pickAvatar = (value = 'guest') => {
  const seed = typeof value === 'string' ? value : JSON.stringify(value);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DEFAULT_AVATARS[Math.abs(hash) % DEFAULT_AVATARS.length];
};

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

const publicUser = (user, viewerId) => ({
  _id: user._id,
  username: user.username,
  name: user.name,
  bio: user.bio,
  avatar: user.avatar,
  date: user.date,
  followers: user.followers?.length || 0,
  isYouFollowed: user.followers?.some((follower) => follower.userId.toString() === viewerId.toString()) || false,
});

const sendError = (res, error) => res.status(400).json({ success: false, msg: error.message });

router.get('/health', (req, res) => res.json({ success: true, service: 'instaclone-api' }));

router.post('/signUp', async (req, res) => {
  try {
    const { username, name, email, pwd } = req.body;
    if (!username || !name || !email || !pwd || pwd.length < 6) {
      return res.status(400).json({ success: false, msg: 'Username, name, email and a 6 character password are required' });
    }
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (existing) return res.status(409).json({ success: false, msg: 'Email or username already exists' });
    const user = await User.create({
      username,
      name,
      email,
      avatar: pickAvatar(username),
      password: await bcrypt.hash(pwd, 12),
    });
    return res.status(201).json({ success: true, msg: 'User created successfully', userId: user._id });
  } catch (error) { return sendError(res, error); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.pwd || '', user.password))) {
      return res.status(401).json({ success: false, msg: 'Invalid email or password' });
    }
    return res.json({ success: true, msg: 'User logged in successfully', token: signToken(user._id.toString()), userId: user._id });
  } catch (error) { return sendError(res, error); }
});

router.post('/createPost', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, msg: 'An image is required' });
    const post = await Post.create({ caption: req.body.caption || '', image: req.file.filename, uploadedBy: req.userId });
    return res.status(201).json({ success: true, msg: 'Post created successfully', postId: post._id });
  } catch (error) { return sendError(res, error); }
});

router.post('/createStory', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, msg: 'An image is required' });
    const story = await Story.create({ userId: req.userId, image: req.file.filename, caption: req.body.caption || '', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    return res.status(201).json({ success: true, storyId: story._id });
  } catch (error) { return sendError(res, error); }
});

router.post('/getStories', requireAuth, async (req, res) => {
  try {
    const followedUsers = await User.find({ 'followers.userId': req.userId }).select('_id');
    const followedIds = followedUsers.map((user) => user._id);
    const stories = await Story.find({ userId: { $in: [req.userId, ...followedIds] }, expiresAt: { $gt: new Date() } }).sort({ date: -1 }).populate('userId', 'username avatar');
    return res.json({ success: true, data: stories });
  } catch (error) { return sendError(res, error); }
});

router.post('/getPosts', requireAuth, async (req, res) => {
  try {
    const followedUsers = await User.find({ 'followers.userId': req.userId }).select('_id');
    const followedIds = followedUsers.map((user) => user._id);
    const posts = await Post.find({ uploadedBy: { $in: [req.userId, ...followedIds] } }).sort({ date: -1 }).limit(50).populate('uploadedBy', 'username name avatar date followers');
    const data = posts.filter((post) => post.uploadedBy).map((post) => ({
      post: {
        _id: post._id, caption: post.caption, likes: post.likes.length, comments: post.comments.length,
        image: post.image, date: post.date, isYouLiked: post.likes.some((like) => like.userId.toString() === req.userId.toString()),
        isYouSaved: post.savedBy.some((id) => id.toString() === req.userId.toString()),
      },
      user: publicUser(post.uploadedBy, req.userId),
    }));
    return res.json({ success: true, msg: 'Posts fetched successfully', data });
  } catch (error) { return sendError(res, error); }
});

router.post('/toggleLike', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });
    const existing = post.likes.find((like) => like.userId.toString() === req.userId.toString());
    if (existing) post.likes.pull(existing._id);
    else {
      post.likes.push({ userId: req.userId });
      if (post.uploadedBy.toString() !== req.userId.toString()) await Notification.create({ recipient: post.uploadedBy, actor: req.userId, type: 'like', post: post._id });
    }
    await post.save();
    return res.json({ success: true, action: existing ? 'dislike' : 'like', likes: post.likes.length });
  } catch (error) { return sendError(res, error); }
});

router.post('/toggleSave', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });
    const saved = post.savedBy.some((id) => id.toString() === req.userId.toString());
    if (saved) post.savedBy.pull(req.userId); else post.savedBy.push(req.userId);
    await post.save();
    return res.json({ success: true, action: saved ? 'unsaved' : 'saved' });
  } catch (error) { return sendError(res, error); }
});

router.post('/addComment', requireAuth, async (req, res) => {
  try {
    const text = req.body.text?.trim();
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });
    if (!text || text.length > 300) return res.status(400).json({ success: false, msg: 'Comment must be 1 to 300 characters' });
    post.comments.push({ userId: req.userId, text });
    await post.save();
    if (post.uploadedBy.toString() !== req.userId.toString()) await Notification.create({ recipient: post.uploadedBy, actor: req.userId, type: 'comment', post: post._id });
    return res.json({ success: true, comment: post.comments[post.comments.length - 1] });
  } catch (error) { return sendError(res, error); }
});

router.post('/toggleFollow', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    if (user._id.toString() === req.userId.toString()) return res.status(400).json({ success: false, msg: "You can't follow yourself" });
    const existing = user.followers.find((follower) => follower.userId.toString() === req.userId.toString());
    if (existing) user.followers.pull(existing._id);
    else {
      user.followers.push({ userId: req.userId });
      await Notification.create({ recipient: user._id, actor: req.userId, type: 'follow' });
    }
    await user.save();
    return res.json({ success: true, action: existing ? 'Unfollow' : 'Follow', followers: user.followers.length });
  } catch (error) { return sendError(res, error); }
});

router.post('/getUsers', requireAuth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('-password').sort({ username: 1 });
    return res.json({ success: true, data: users });
  } catch (error) { return sendError(res, error); }
});

router.post('/getUserDetails', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    const posts = await Post.find({ uploadedBy: user._id }).sort({ date: -1 });
    return res.json({ success: true, data: { ...publicUser(user, req.userId), posts: posts.length, isThisYou: user._id.toString() === req.userId.toString() } });
  } catch (error) { return sendError(res, error); }
});

router.post('/getMyPosts', requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({ uploadedBy: req.body.userId }).sort({ date: -1 });
    return res.json({ success: true, data: posts });
  } catch (error) { return sendError(res, error); }
});

router.post('/updateProfile', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { $set: { name: req.body.name, bio: req.body.bio, avatar: req.body.avatar } }, { new: true, runValidators: true }).select('-password');
    return res.json({ success: true, data: user });
  } catch (error) { return sendError(res, error); }
});

router.post('/getNotifications', requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId }).sort({ date: -1 }).limit(30).populate('actor', 'username avatar');
    await Notification.updateMany({ recipient: req.userId, read: false }, { $set: { read: true } });
    return res.json({ success: true, data: notifications });
  } catch (error) { return sendError(res, error); }
});

router.post('/getMessageUsers', requireAuth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('username name avatar').sort({ username: 1 });
    return res.json({ success: true, data: users });
  } catch (error) { return sendError(res, error); }
});

router.post('/getMessages', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ sender: req.userId, recipient: req.body.userId }, { sender: req.body.userId, recipient: req.userId }] }).sort({ date: 1 }).limit(100).populate('sender', 'username');
    await Message.updateMany({ sender: req.body.userId, recipient: req.userId, read: false }, { $set: { read: true } });
    return res.json({ success: true, data: messages });
  } catch (error) { return sendError(res, error); }
});

router.post('/sendMessage', requireAuth, async (req, res) => {
  try {
    const text = req.body.text?.trim();
    const recipient = await User.findById(req.body.userId).select('_id');
    if (!recipient) return res.status(404).json({ success: false, msg: 'User not found' });
    if (!text || text.length > 1000) return res.status(400).json({ success: false, msg: 'Message must be 1 to 1000 characters' });
    const message = await Message.create({ sender: req.userId, recipient: recipient._id, text });
    return res.status(201).json({ success: true, data: message });
  } catch (error) { return sendError(res, error); }
});

module.exports = router;
