const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userImage: { type: String, required: false },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  userDate: { type: Number, required: true },
  termsAccepted: { type: String, required: true },
  likes:[{type:Schema.Types.ObjectId,ref:"Post"}],
  reports:[{type:Schema.Types.ObjectId,ref:"Post"}]
});

module.exports = mongoose.model("User", UserSchema);
