const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
require('mongoose-type-email');

const utilisateurSchema = mongoose.Schema({
  // userId: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
  password: { type: String, required: true },
});

utilisateurSchema.plugin(uniqueValidator);
utilisateurSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
