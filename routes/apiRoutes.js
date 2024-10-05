const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Generates unique IDs

const router = express.Router();

// Path to the JSON file
const dbPath = path.join(__dirname, '../db/db.json');

// Helper functions to read and write notes
const readNotes = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeNotes = (notes) => {
  fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2));
};

// GET /api/notes - Retrieve all notes
router.get('/notes', (req, res) => {
  try {
    const notes = readNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// POST /api/notes - Add a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note title and text are required' });
  }

  const newNote = { id: uuidv4(), title, text };

  try {
    const notes = readNotes();
    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// DELETE /api/notes/:id - Delete a note by its ID
router.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  try {
    let notes = readNotes();
    notes = notes.filter(note => note.id !== id);
    writeNotes(notes);
    res.json({ message: 'Note deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
