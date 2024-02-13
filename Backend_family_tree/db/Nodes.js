const mongoose=require("mongoose");
const nodeSchema = new mongoose.Schema({
    index: Number,
    x: Number,
    y: Number,
    left: Object,
    right: Object,
    father: Object,
    mother: Object,
    spouse: Object,
    details: {
      name: String,
      age: String,
      dob: String,
      dod: String,
    },
  });
  
  module.exports = mongoose.model('Node', nodeSchema);