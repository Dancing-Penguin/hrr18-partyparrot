var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  memberSince: {type:Date, default: Date.now},
  profilePhoto: { data: Buffer, contentType: String },
});
module.exports = mongoose.model("User", userSchema);