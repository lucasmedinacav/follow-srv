var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema;

try {
  userSchema = mongoose.model(
    "user",
    new Schema({
      login: { type: String, trim: true, unique: true },
      password: { type: String, trim: true },
      name: { type: String, trim: true },
      followers: [{idUser: String, name: String}],
      following: [{idUser: String, name: String}],
    })
  );
  userSchema.index({
    login: 1,
  }, {
      unique: true,
    });
} catch (e) {
  userSchema = mongoose.model("user");
}

module.exports = userSchema;
