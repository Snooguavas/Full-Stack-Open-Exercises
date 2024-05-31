const Person = ({person, deletePerson}) => {
    return (
        <div className="person">
        <li>{person.name}<br />{person.number}</li>
        <button className="delete-button" onClick={() => deletePerson(person)}>X</button>
        </div>
        )
    }
    
    export default Person