const mongoose = require("mongoose");

// setting up the type  of data for the database (schema)
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name can not be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// setting up the model
module.exports = mongoose.model("Task", TaskSchema);
