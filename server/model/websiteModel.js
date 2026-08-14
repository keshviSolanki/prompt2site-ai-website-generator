import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["ai", "user"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const websiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Website",
    },

    latestCode: {
      type: String,
      required: true,
    },

    conversation: [messageSchema],

    deployed: {
      type: Boolean,
      default: false,
    },

    deployeUrl: {
      type: String,
    },

    //url ni aagl random word j uniqly identify krava uniq word lagavsu jthi khabar pdse k deploye kyru k ny
    slug: {
      type: String,
      unique: true,
      sparse: true, // ghani website ma create time a null rakhi to support kre uniqe hova chhata
    },
  },
  { timestamps: true },
);

const website = mongoose.model("website", websiteSchema);
export default website;
