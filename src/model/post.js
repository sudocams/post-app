const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  instructions: { type: String, required: true },
  postDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  cost: { type: String, required: true },
  selectTutor: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", PostSchema);
