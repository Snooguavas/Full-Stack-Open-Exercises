import './App.css';

import VisibilityFilter from './VisibilityFilter';
import NewNote from './NewNote';
import Notes from './Notes';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initializeNotes } from './reducers/noteReducer';

const App = () => {
  const dispatch = useDispatch() 

  useEffect(() => {
   dispatch(initializeNotes())
  }, []);

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  );
};

export default App;
