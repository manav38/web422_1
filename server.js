/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Manav Student ID: 174134239 Date: 2025-05-20
*
*  Published URL on Vercel:  
*
********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Basic root 
app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Manav"
  });
});

// route fir creating sites (POST request)
app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then(site => res.status(201).json(site))
    .catch(err => res.status(500).json({ message: err.message }));
});

// GET route for page, perPage, name.. 
app.get("/api/sites", (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;

  db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
    .then(sites => res.json(sites))
    .catch(err => res.status(500).json({ message: err.message }));
});

// route for viewing data on the basis of id
app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then(site => {
      if (site) res.json(site);
      else res.status(404).json({ message: "Site not found" });
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

// route for changing/updating any information
app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: err.message }));
});

// route for deleting any info
app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: err.message }));
});

// Starting the server right from the connection with the Mongo DB
console.log("Connecting to MongoDB...");
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
  });
