var mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const postSchema = new mongoose.Schema({
  caption: { type: String, default: '', maxlength: 2_200, trim: true },
  image: { type: String, required: true },
  likes: [likesSchema],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 300, trim: true },
    date: { type: Date, default: Date.now },
  }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ date: -1 });

module.exports = mongoose.model("Post", postSchema);