import { useState } from 'react'


const Statistics = ({allStats}) => {
  if (allStats.all === 0) {
    return <h3>No feedback given.</h3>
  }
  return (
    <table>
    <tbody>
    {Object.entries(allStats).map(([label, value]) => {
      return (
        <StatisticLine label={label} value={value} />
        )
      })}
      </tbody>
      </table>
      )
    }
    
    const StatisticLine = ({label, value}) => {
      return (
        <tr>
        <td>{label}</td>
        <td>{value}</td>
        </tr>
        )
      }
      
      const Button = ({handleClick, text}) => {
        return (
          <button onClick={handleClick}>{text}</button>
          )
        }
        
        const App = () => {
          
          const [allStats, setAllStats] = useState({good: 0, neutral: 0, bad: 0, all: 0, average: 0, positive: 0})      
          
          const calcStats = (good, bad, all) => {
            setAverage((good - bad) / all);
            setPositive((good / all) * 100);
          }
          
          const addGood = () => {
            const newGood = allStats.good + 1;
            const newAll = allStats.all + 1;
            setAllStats({...allStats, 
              good: newGood,
              all: newAll,
              average: (newGood - allStats.bad) / newAll,
              positive: (newGood / newAll) * 100});
            }
            
            const addNeutral = () => {
              const newNeutral = allStats.neutral + 1;
              const newAll = allStats.all + 1;
              setAllStats({...allStats, 
                neutral: newNeutral,
                all: newAll,
                average: (allStats.good - allStats.bad) / newAll,
                positive: (allStats.good / newAll) * 100});
              }
              
              const addBad = () => {
                const newBad = allStats.bad + 1;
                const newAll = allStats.all + 1;
                setAllStats({...allStats, 
                  bad: newBad,
                  all: newAll,
                  average: (allStats.good - newBad) / newAll,
                  positive: (allStats.good / newAll) * 100});
                }
                
                return (
                  <div>
                  <h1>Give Feedback</h1>
                  <Button handleClick={addGood} text='Good' />
                  <Button handleClick={addNeutral} text='Neutral' />
                  <Button handleClick={addBad} text='Bad' />
                  
                  <h2>Statistics</h2>
                  <Statistics allStats={allStats} />
                  
                  </div>
                  
                  )
                }
                
                export default App