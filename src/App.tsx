// import { useEffect, useState } from 'react'
// import axios from 'axios'

import { TApiCharacter } from './types/ram-api'
import classes from './App.module.css'

import MultiSelectAutoComplete from './components/autocomplete/MultiSelectAutoComplete'

function App() {
  // const [characters, setCharacters] = useState<TApiCharacter[]>([])
  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  // const selectionChangeHandler = (options: TApiCharacter[]) => {
  //   console.log('Selection is changed...')
  //   console.log(options)
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true)
  //       const response = await axios.get(
  //         'https://rickandmortyapi.com/api/character'
  //       )
  //       const allResults: TApiCharacter[] = response.data.results

  //       let nextPage = response.data.info.next
  //       while (nextPage) {
  //         const nextResponse = await axios.get(nextPage)
  //         allResults.push(...nextResponse.data.results)
  //         nextPage = nextResponse.data.info.next
  //       }

  //       // console.log('allResults', allResults)

  //       setCharacters(allResults)
  //       setIsLoading(false)
  //     } catch (error) {
  //       setError('Error fetching data!')
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [])

  return (
    <>
      <main>
        <h1>Multi-Select Autocomplete Example</h1>
        <h3>
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rick and Morty API
          </a>
        </h3>
        {/* {isLoading && <div className={classes.loading}>Loading...</div>}
        {error && <div className={classes.error}>{error}</div>}
        {!isLoading && (
          <MultiSelectAutoComplete
          // options={characters}
          />
        )} */}
        <MultiSelectAutoComplete />
      </main>
    </>
  )
}

export default App
