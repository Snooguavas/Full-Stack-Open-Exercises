import { useState } from 'react'


const Statistics = ({label, value}) => {
  return (
    <>
    <div>{label} {value}</div>
    </>
    )
  }
  
  const Button = ({handleClick, text}) => {
    return (
      <button onClick={handleClick}>{text}</button>
      )
    }
    
    const App = () => {
      const [good, setGood] = useState(0)
      const [neutral, setNeutral] = useState(0)
      const [bad, setBad] = useState(0)
      const [all, setAll] = useState(0)
      const [average, setAverage] = useState(0)
      const [positive, setPositive] = useState(0)

      // const [allStats, setAllStats]
      
      const calcStats = (good, bad, all) => {
        setAverage((good - bad) / all);
        setPositive((good / all) * 100);
      }
      
      const addGood = () => {
        const newGood = good + 1;
        setGood(newGood);
        const newAll = all + 1;
        setAll(newAll);
        calcStats(newGood, bad, newAll);
      }
      
      const addNeutral = () => {
        const newNeutral = neutral + 1;
        setNeutral(newNeutral);
        const newAll = all + 1;
        setAll(newAll);
        calcStats(good, bad, newAll);
      }
      
      const addBad = () => {
        const newBad = bad + 1;
        setBad(newBad);
        const newAll = all + 1;
        setAll(newAll);
        calcStats(good, newBad, newAll);
      }
      
      return (
        <div>
        <h1>Give Feedback</h1>
        <Button handleClick={addGood} text='Good' />
        <Button handleClick={addNeutral} text='Neutral' />
        <Button handleClick={addBad} text='Bad' />
        
        <h2>Statistics</h2>
        {/* <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/> */}
        <Statistics label='Good: ' value={good} />
        <Statistics label='Neutral: ' value={neutral} />
        <Statistics label='Bad: ' value={bad} />
        <Statistics label='Total Feedback Submissions: ' value={all} />
        <Statistics label='Average: ' value={average} />
        <Statistics label='Positive: ' value={`${positive}%`} />
        </div>
        
        )
      }
      
      export default App