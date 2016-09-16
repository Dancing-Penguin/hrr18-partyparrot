var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  memberSince: {type:Date, default: Date.now},
  profilePhoto: { data: Buffer, contentType: String },
  eventsPromoted: Number
});
module.exports = mongoose.model("User", userSchema);