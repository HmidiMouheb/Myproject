const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postDate: { type: Number, required: true },
  postTitle: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  postDescription: { type: String, required: false },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
    unique: true
  },
  postImages: { type: String, required: true },
  likers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reporters: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Post", PostSchema);
