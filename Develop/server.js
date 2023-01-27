const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");


app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
    console.log("GET METHOD WORKING");
  });
});
app.post("/api/notes", (req, res) => {
  const newNote = createNote(req.body, notes);
  res.json(newNote);

    }
);

const createNote = (body, notesArray) => {
  const newNote = body;
  body.id = notesArray.length + 1;
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, 2)
  );
  return newNote;
};

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id);
  res.json(true);
});
const deleteNote = (noteID) => {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (note.id == noteID) {
      notes.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notes)
      );
      break;
    }
  }
};
// delete
// app.listen on port 3001?
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);