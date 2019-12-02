// implement your API here
// Ok bud :)

//Bring in .env config parser
require("dotenv").config();
//Get express module
const express = require("express");
//Get CORS module
const cors = require("cors");
//Get DB module
const db = require("./data/db");

//Create server
const server = express();

//Get / Set port - Use the process env variable PORT, or if missing, use 4000 as fallback.
const port = process.env.PORT || 4000;

//Use JSON body parser.
server.use(express.json());

//Use CORS.
server.use(cors());

//Initial endpoint.
server.get("/", (req, res) => {
  res.status(200).json({ message: "Hello there :)" });
});

// GET /api/users - Returns list of users from the database.
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "There are no users in the database." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The users information could not be retrieved." });
    });
});

// GET /api/users/:id - Returns user whose ID matches parameter.
// Requires user ID.
server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

// POST /api/users - Creates a new user in the database.
// Requires name and bio for new user.
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (name && bio) {
    db.insert({ name: name, bio: bio })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => {
        res.status(500).json({ error: "There was an error while saving the user to the database." })
      });
  } else {
    res.status(400).json({ message: "Please provide a name and bio for the user." });
  }
});

// PUT /api/users/:id - Updates a user whose ID matches the parameter.
// Requires name, bio, and user ID.
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const { name, bio } = req.body;

  if (name && bio) {
    db.findById(id)
      .then(user => {
        if (user) {
          db.update(id, { name: name, bio: bio })
            .then(() => {
              res.status(200).json({ ...user, name: name, bio: bio });
            })
            .catch(error => {
              res.status(500).json({ error: "The user information could not be modified." });
            });
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
      })
      .catch(error => {
        res.status(500).json({ error: "The user information could not be modified." });
      });
  } else {
    res.status(400).json({ message: "Please provide a name and bio for the user." });
  }
});

// DELETE /api/users/:id - Deletes a user from the database.
// Requires user ID.
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) {
        db.remove(id)
          .then(() => {
            res.status(200).json(user);
          })
          .catch(error => {
            res.status(500).json({ error: "The user could not be removed." });
          });
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed." });
    });
});

//Start listening.
server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});