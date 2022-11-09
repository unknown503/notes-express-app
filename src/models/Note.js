const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", NoteSchema);