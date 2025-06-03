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
require("pg"); // Required for Vercel with pg dependencies

const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Manav"
  });
});

app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then(site => res.status(201).json(site))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.get("/api/sites", (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;

  db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
    .then(sites => res.json(sites))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then(site => {
      if (site) res.json(site);
      else res.status(404).json({ message: "Site not found" });
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: err.message }));
});

app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: err.message }));
});


let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      console.log("Connecting to MongoDB...");
      await db.initialize(process.env.MONGODB_CONN_STRING);
      isConnected = true;
      console.log("MongoDB connected.");
    } catch (err) {
      console.error("MongoDB connection error:", err.message);
      res.status(500).json({ error: "MongoDB connection error" });
      return;
    }
  }

  return app(req, res); // Let Vercel handle it
};

module.exports = handler;
