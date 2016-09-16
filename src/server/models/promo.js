var mongoose = require('mongoose');

var promoSchema = new mongoose.Schema({
  promoter: String,
  event: String,
  link: String
});

module.exports = mongoose.model("Promo", promoSchema);