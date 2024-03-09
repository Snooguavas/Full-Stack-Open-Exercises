import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryFullView = ({country, show, toSearch}) => {
  const [showFull, setshowFull] = useState(show)
  useEffect(() => setshowFull(show), [toSearch])
  if (!showFull) {return <li>{country.name.common}<button onClick={() => setshowFull(!showFull)}>Show</button></li>}
  return (
  <>
    <li>
      {country.name.common}
      <button onClick={() => setshowFull(!showFull)}>Show</button>
      <h2 style={{fontSize: '80px', margin: 0}}>{country.flag}</h2>
      <ul>
       <h2>Capital</h2>
       {country.capital.map(capital => <li key={capital}>{capital}</li>)}
      </ul>
      <p>Area: {country.area}</p>
      <ul>
        <h2>Languages</h2>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
    </li>
    </>
  )
}

const CountryList = ({countriesToShow, toSearch}) => {
  if (countriesToShow.length > 10) {return <p>Too many matches, narrow your search</p>}
  let showFull = false
  if (countriesToShow.length === 1) {showFull = true}

  return (
    <ul>
      {countriesToShow.map(country => <CountryFullView country={country} show={showFull} toSearch={toSearch} key={country.name.common} />)}
      </ul>
      )
    }
    
    function App() {
      const [toSearch, setToSearch] = useState('')
      const [countries, setCountries] = useState([])
      const [countriesToShow, setCountriesToShow] = useState([])
      
      useEffect(() => {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => setCountries(response.data))
      }, [])
      
      
      const handleSearch = (event) => {
        const newSearch = event.target.value
        setToSearch(newSearch)
        if (toSearch) {
          setCountriesToShow(countries.filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase())))
        }
        else {
          setCountriesToShow(countries)
        }
      }
      
      
      return (
        <>
        <input placeholder='Search Countries' value={toSearch} onChange={handleSearch} />
        {!toSearch ? null : <CountryList toSearch={toSearch} countriesToShow={countriesToShow} />}
        </>
        )
      }
      
      export default App
      