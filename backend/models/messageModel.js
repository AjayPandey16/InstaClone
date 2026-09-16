const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  text: { type: String, required: true, maxlength: 1000, trim: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now, index: true },
});

messageSchema.index({ sender: 1, recipient: 1, date: -1 });

module.exports = mongoose.model('Message', messageSchema);
