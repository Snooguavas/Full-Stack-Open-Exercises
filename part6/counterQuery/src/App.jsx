import CounterContext from './CounterContext';
import './App.css';
import { useContext } from 'react';

const Display = () => {
  const [counter] = useContext(CounterContext);
  return <div>{counter}</div>;
};

function App() {
  const [counter, counterDispatch] = useContext(CounterContext)
  return (
    <>
      <Display />
      <div>
        <button onClick={() => counterDispatch({ type: 'INC' })}>INC</button>
        <button onClick={() => counterDispatch({ type: 'DEC' })}>DEC</button>
        <button onClick={() => counterDispatch({ type: 'ZERO' })}>ZERO</button>
      </div>
    </>
  );
}

export default App;
