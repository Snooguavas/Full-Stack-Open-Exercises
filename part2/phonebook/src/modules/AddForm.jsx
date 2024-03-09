const AddForm = ({handleSubmit, handleNameChange, handleNumberChange, newPerson}) => {
    return (
        <div className="add-form">
        <h2>Add new</h2>
        <form onSubmit={handleSubmit}>
        <div>
        <input placeholder="Name" value={newPerson.name} onChange={handleNameChange}/><br />
        <input placeholder="Number" value={newPerson.number} onChange={handleNumberChange} />
        </div>
        <div>
        <button className="add-button" type="submit">add</button>
        </div>
        </form>
        </div>
        )
    }
    
    export default AddForm