const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    images:[{url:String}]
  },
  {
    timestamps: true,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
