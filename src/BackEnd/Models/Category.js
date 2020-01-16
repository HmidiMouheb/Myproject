const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true, unique: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }]
});

module.exports = mongoose.model("Category", CategorySchema);
