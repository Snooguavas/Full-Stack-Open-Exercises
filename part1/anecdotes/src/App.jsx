import { useState } from 'react'


const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
    )
  }
  
  const Anecdote = ({text, points, headline}) => {
    return (
      <div>
      <h1>{headline}</h1>
      <p>{text}</p>
      <p>Has {points} points.</p>
      </div>
      )
    }
    
    const App = () => {
      const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
      ]
      
      const [selected, setSelected] = useState(0)
      const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
      const [topVoted, setTopVoted] = useState(0)


      const selectRandom = () => {
        const random = Math.floor(Math.random() * anecdotes.length)
        setSelected(random);
      }


      const vote = () => {
        const newPoints = [...points]
        newPoints[selected] += 1
        setPoints(newPoints)
        if (newPoints[selected] > newPoints[topVoted]) {
          setTopVoted(selected)
        }
      }
      
      return (
        <>
        <Anecdote headline='Anecdote of the day' text={anecdotes[selected]} points={points[selected]} />
        <Button handleClick={selectRandom} text='Next Anecdote' />
        <Button handleClick={vote} text='Vote' />
        <Anecdote headline='Top voted anecdote' text={anecdotes[topVoted]} points={points[topVoted]} />
        
        </>
        )
      }
      
      export default App