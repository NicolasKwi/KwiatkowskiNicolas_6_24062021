const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");

//routes
const authRoutes = require('./routes/authentification');
const saucesRoutes = require('./routes/sauces');

const path = require('path');

// app
const app = express();

// adresse de base : 'mongodb+srv://admintotal:<password>@projet.xr3kx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// Veillez à remplacer l'adresse SRV par la vôtre et la chaîne <PASSWORD> par votre mot de passe utilisateur MongoDB
mongoose
  .connect(
   
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//middleware global
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//body parser deprecier -> app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// ***** ROUTES *****
app.use('/api/auth',authRoutes)
app.use('/api/sauces',saucesRoutes)


module.exports = app;
