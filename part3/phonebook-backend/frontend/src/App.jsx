import { useState, useEffect } from "react";
import "./App.css";
import personService from "./services/persons";
import AddForm from "./modules/AddForm";
import Search from "./modules/Search";
import Person from "./modules/Person";

const Notification = ({ text, color }) => {
  return !text ? null : (
    <div className={`notification u-color-${color}`}>{text}</div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [toSearch, setToSearch] = useState("");
  const [notificationText, setNotificationText] = useState(null);
  const [notificationColor, setNotificationColor] = useState("");

  useEffect(() => {
    personService.getAll().then((savedPersons) => setPersons(savedPersons));
  }, []);

  const createNotification = (text, color, duration) => {
    setNotificationText(text);
    setNotificationColor(color);
    setTimeout(() => setNotificationText(null), duration);
  };

  const peopleToShow = !toSearch
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(toSearch.toLowerCase())
      );

  const handleSearchChange = (event) => {
    setToSearch(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewPerson({ ...newPerson, name: event.target.value });
  };

  const handleNumberChange = (event) => {
    setNewPerson({ ...newPerson, number: event.target.value });
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (newPerson.name && newPerson.number) {
      for (let person of persons) {
        if (person.name === newPerson.name) {
          if (person.number === newPerson.number) {
            createNotification(
              `${person.name} is already added to phone book!`,
              "red",
              2000
            );
            return;
          }
          if (
            window.confirm(
              `${person.name} is already added to phone book! replace old number with new one?`
            )
          ) {
            const changedPerson = { ...person, number: newPerson.number };
            personService
              .update(person.id, changedPerson)
              .then((returnedPerson) =>
                setPersons(
                  persons.map((p) => (p.id !== person.id ? p : returnedPerson))
                )
              );
          }
          return;
        }
      }
      const personObject = { name: newPerson.name, number: newPerson.number };
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewPerson({ name: "", number: "" });
          createNotification(`Added ${returnedPerson.name}`, "green", 2000);
          return;
        })
        .catch((error) => {
          if (error.response.data.includes("validation failed")) {
            createNotification("Enter a valid name and number", "red", 3000)
          }
        });
    } else {
      createNotification("Enter a name and number", "red", 2000);
    }
  };

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then((returnedPerson) => {
          setPersons(persons.filter((p) => p.id !== person.id));
          createNotification(`Removed ${person.name}`, "red", 2000);
        })
        .catch((error) => {
          createNotification(`Already removed ${person.name}`, "red", 2000);
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  return (
    <div className="phonebook">
      <div className="header-box">
        <h1 className="header">Phonebook</h1>
      </div>

      <div className="content">
        <div className="sidebar">
          <AddForm
            handleSubmit={addPerson}
            handleNameChange={handleNameChange}
            handleNumberChange={handleNumberChange}
            newPerson={newPerson}
          />
          <Search handleSearchChange={handleSearchChange} />
        </div>

        <Notification text={notificationText} color={notificationColor} />
        <div className="person-list">
          <h2>Numbers</h2>
          <ul>
            {peopleToShow.map((person) => (
              <Person
                person={person}
                key={person.id}
                deletePerson={deletePerson}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
