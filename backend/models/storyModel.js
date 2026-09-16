const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  image: { type: String, required: true },
  caption: { type: String, default: '', maxlength: 150, trim: true },
  expiresAt: { type: Date, required: true, index: true },
  date: { type: Date, default: Date.now },
});

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);
