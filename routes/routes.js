// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

module.exports = app => {

    fs.readFile('db/db.json', "utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        // API Routes
        // =============================================================
        app.get("/api/notes", function (req, res) {
            res.json(notes);
        }); // APP GET API

        // post new notes
        app.post("/api/notes", function (req, res) {
            // Validate request body
            if (!req.body.title) {
                return res.json({ error: "Missing required title" });
            }

            // Copy request body and generate ID
            let newNote = { ...req.body, id: uuidv4() }

            // Push note to dbJSON array - saves data in memory
            notes.push(newNote);

            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) {
                    return res.json({ error: "Error writing to file" });
                }
                return console.log("newNote added " + newNote.title);
            });  
        }); // APP POST API

        // Deletes a note with specific id
        app.delete("/api/notes/:id", function (req, res) {
            let deleteId = req.params.id;
            notes = notes.filter(function (note) {
                // console.log("note.id " + note.id);
                return note.id != deleteId;
            });
            // console.log("notes " + notes);
            console.log("Deleted note with id " + req.params.id);

            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) {
                    return res.json({ error: "Error writing to file" });
                }
                return true;
            });
        }); // APP DELETE API


        // Routes
        // =============================================================
        // Display notes.html
        app.get("/notes", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        // If no matching route default to home page
        app.get("*", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

    });


}




