const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    provider_id: {
      type: String,
      required: true
    },
    provider_name: {
      type: String,
      required: true
    }
  },

  //optional settings for schema
  {
    //add "createdAt" and "updatedAt" to the schema
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
