// in Node.js we will import files using this syntax
const express = require("express");
const db = require("./data/hubs-model.js"); // import database file

const server = express();

server.use(express.json()); // needed to parse JSON from body

server.get("/", (req, res) => {
  res.send({ api: "up and running..." });
});

//list of hubs GET /hubs
server.get("/hubs", (req, res) => {
  // get the list of hubs from the database
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      console.log("error on GET /hubs", err);
      res
        .status(500)
        .json({ errorMessage: "error getting list of hubs from database" });
    });
});

// add a hub
server.post("/hubs", (req, res) => {
  // get the data the client sent
  const hubData = req.body; // express does not know how to parse JSON

  // call the db and add the hub
  db.add(hubData)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(err => {
      console.log("error on GET /hubs", err);
      res.status(500).json({ errorMessage: "error adding the hub" });
    });
});

// remove a hub by its id
server.delete("/hubs/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (!removed) {
        // there was no hub with that id
        res.status(404).json({ message: "hub not found" });
      } else {
        res.status(200).json({ message: "hubs removes successfully", removed });
      }
    })
    .catch(err => {
      console.log("error on DELETE /hubs", err);
      res.status(500).json({ errorMessage: "error removing the hub" });
    });
});

// update a hub, passing the id and the changes

const port = 4000;
server.listen(port, () => console.log(`/n** API running on port ${port} **/n`));
