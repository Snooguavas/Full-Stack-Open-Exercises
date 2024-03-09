import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

function App(props) {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  
  useEffect(() => {
    noteService.getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

const notesToShow = showAll 
? notes
: notes.filter(note => note.important)

const addNote = (event) => {
  event.preventDefault()
  if (newNote.length > 0){
    const noteObject = {content: newNote, important: Math.random() < 0.5}      
    
    noteService.create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }
  
}

const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}

const toggleImportance = id => {
  console.log(`importance of ${id} needs to be toggled`)
  const note = notes.find(n => n.id === id)
  const changedNote = {...note, important: !note.important}

  noteService.update(id, changedNote)
  .then(returnedNote => {
    setNotes(notes.map(n => n.id !== id ? n : returnedNote))
  })
  .catch(error => {
    console.log("doesn't exist")
    setNotes(notes.filter(n => n.id !== id))
  })
} 

return (
  <>
  <h1>Notes</h1>
  <ul>
  {notesToShow.map(note => <Note note={note} key={note.id} toggleImportance={() => toggleImportance(note.id)}/>)}
  </ul>
  
  <form onSubmit={addNote}>
  <input value={newNote} onChange={handleNoteChange} />
  <button type="submit">Send</button>
  <button onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Important' : 'Show All'}</button>
  </form>
  </>
  
  )
}

export default App
