
// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const dbJSON = require("./db/db.json");

module.exports = function (app) {

    fs.readFile(dbJSON, "utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        // Thammarak API Routes
        // =============================================================
        // read the `db.json` file and return all saved notes as JSON
        app.get("/api/notes", function (req, res) {
            res.json(notes);
        });

        app.post("/api/notes", function (req, res) {
            // Validate request body
            if (!req.body.title) {
                return res.json({ error: "Missing required title" });
            }

            // Copy request body and generate ID
            const note = { ...req.body, id: uuidv4() }

            // Push note to dbJSON array - saves data in memory
            dbJSON.push(note);

            // Saves data to file by persisting in memory variable dbJSON to db.json file.
            // This is needed because when we turn off server we loose all memory data like pbJSON variable.
            // Saving to file allows us to read previous notes (before server was shutdown) from file.
            fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(dbJSON), (err) => {
                if (err) {
                    return res.json({ error: "Error writing to file" });
                }

                return res.json(note);
            });
        });

        // Routes
        // =============================================================

        // Thammarak display notes.html
        app.get("/notes", function (req, res) {
            res.sendFile(path.join(__dirname, "./public/notes.html"));
        });

        // Thammarak If no matching route default to home page
        app.get("*", function (req, res) {
            res.sendFile(path.join(__dirname, "./public/index.html"));
        });


    });


}



