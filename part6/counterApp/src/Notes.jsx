import { useDispatch, useSelector } from 'react-redux';
import { toggleImportanceOf } from './reducers/noteReducer';
import noteService from './services/notes'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong>{note.important && 'Important'}</strong>
    </li>
  );
};

const Notes = () => {
  const dispatch = useDispatch();
  const notes = useSelector(({filter, notes}) => {
    if (filter === 'ALL') {
      return notes
    }
    return filter === 'IMPORTANT' 
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
  });

  const toggleNoteImportance = async (note) => {
    // dispatch(toggleImportanceOf(note.id))
    const changedNote = await noteService.changeImportance(note)
    dispatch(toggleImportanceOf(changedNote.id))
  }

  return (
    <ul>
      {notes.map((note) => (
        <Note
          note={note}
          key={note.id}
          handleClick={() => toggleNoteImportance(note)}
        />
      ))}
    </ul>
  );
};

export default Notes;
