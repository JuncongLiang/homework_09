const express = require("express");
const path = require("path");
const fs = require("fs");
const notesData = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//Default page route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Note page route
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//API route
function writeToDB(notes) {
    notes = JSON.stringify(notes, 0, 2);
    
    fs.writeFileSync("./db/db.json", notes, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

//API Get Requests
app.get("/api/notes", function (req, res) {
    res.json(notesData);
});

//API POST Requests
app.post("/api/notes", function (req, res) {

//Set ID  
    if (notesData.length == 0) {
        req.body.id = 1;
    } else {
        req.body.id = notesData[notesData.length - 1].id + 1;
    }

    notesData.push(req.body);

    writeToDB(notesData);
    //console.log(notesData);
    res.json(req.body);
});


// Delete a note
app.delete("/api/notes/:id", function (req, res) {

    let id = req.params.id.toString();

    for (i = 0; i < notesData.length; i++) {

        if (notesData[i].id == id) {
            res.send(notesData[i]);
            notesData.splice(i, 1);
            break;
        }
    }

    writeToDB(notesData);

});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

