const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  status: {
    type: Boolean,
  },
    description: {
    type: String,
    required: true
  },
  urgent: {
    type: Boolean
  },
  important: {
    type: Boolean
  },
  userId: {
   type: Schema.Types.ObjectId, ref: 'User'
  }
  });

const List = mongoose.model("List", listSchema);

module.exports = List;
