const util = require("util");
const fs = require("fs");
var promiseReadFile = util.promisify(fs.readFile);
function readToDb() {
    return promiseReadFile('./db/db.json', "utf8")

};
var promiseWriteFile = util.promisify(fs.writeFile);
function writeToDb(data) {
    return promiseWriteFile('./db/db.json', JSON.stringify(data))

};
var allNotes = []
module.exports = function (app) {

    app.get("/api/notes", function (req, res) {
        readToDb().then((notes) => res.json(JSON.parse(notes))
        );
    });

    app.post("/api/notes", function (req, res) {
        console.log(req.body);
        readToDb().then((notes) => {
            var readNotes = JSON.parse(notes)
            readNotes.push(req.body)
            // allNotes.push(readNotes);
            return readNotes
        }).then((allNotes) =>
            writeToDb(allNotes).then(() =>
                readToDb().then((notes) => res.json(JSON.parse(notes)))
            ))
    });

    app.delete("/api/notes/:id", function (req, res) {
        var id= req.params.id
        console.log(req.params.id)
        readToDb().then((notes) => {
            var readNotes = JSON.parse(notes)
            const filteredNotes = readNotes.filter(note =>{
            if(note.id != id){ return note}});
            console.log(filteredNotes);
            return filteredNotes
        }).then((allNotes) =>
            writeToDb(allNotes).then(() =>
                readToDb().then((notes) => res.json(JSON.parse(notes)))
            ))
    });
};