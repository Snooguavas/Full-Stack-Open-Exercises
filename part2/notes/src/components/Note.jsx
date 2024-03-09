const Note = ({ note, toggleImportance }) => {
    const label = note.important
                    ? 'Set Unimportant'
                    : 'Set Important'
    return (
        <li>
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
        </li>
        )
    }
    
    export default Note