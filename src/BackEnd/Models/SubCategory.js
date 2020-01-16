const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
