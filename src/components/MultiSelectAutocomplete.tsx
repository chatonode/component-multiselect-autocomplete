import React, { useState, useRef, useCallback, useEffect } from 'react'
import classes from './MultiSelectAutocomplete.module.css'
import axios from 'axios'

type RickAndMortyApiUrl = `https://rickandmortyapi.com/api/${string}`

export type ApiCharacter = {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: {
    name: string
    url: RickAndMortyApiUrl
  }
  location: {
    name: string
    url: RickAndMortyApiUrl
  }
  image: `${RickAndMortyApiUrl}.jpeg`
  episode: RickAndMortyApiUrl[]
  url: RickAndMortyApiUrl
  created: string // '2017-11-04T18:48:46.250Z'
}

export type Option = ApiCharacter

type MultiSelectAutocompleteProps = {
  // options: Option[]
  onSelectionChange: (selectedOptions: Option[]) => void
}

const MultiSelectAutocomplete = ({
  // options,
  onSelectionChange,
}: MultiSelectAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(
          'https://rickandmortyapi.com/api/character'
        )
        const allResults = response.data.results

        let nextPage = response.data.info.next
        while (nextPage) {
          const nextResponse = await axios.get(nextPage)
          allResults.push(...nextResponse.data.results)
          nextPage = nextResponse.data.info.next
        }

        setOptions(allResults)
        setIsLoading(false)
      } catch (error) {
        setError('Error fetching data')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
      setDropdownVisible(true)
    } else {
      setFilteredOptions([])
    }
  }, [searchTerm, options])

  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  const handleInputChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    }, 300),
    []
  )

  const handleOptionClick = (option: Option) => {
    if (!selectedOptions.some((selected) => selected.id === option.id)) {
      const newSelectedOptions = [...selectedOptions, option]
      setSelectedOptions(newSelectedOptions)
      onSelectionChange(newSelectedOptions)
    }
    
    setSearchTerm('')
    setFilteredOptions([])
    setDropdownVisible(false)
    inputRef.current?.focus()
  }

  const handleRemoveOption = (option: Option) => {
    const newSelectedOptions = selectedOptions.filter(
      (selected) => selected.id !== option.id
    )
    setSelectedOptions(newSelectedOptions)
    onSelectionChange(newSelectedOptions)
  }

  const handleInputFocus = () => {
    setDropdownVisible(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false)
    }, 200) // Delay to allow click event on options to be registered
  }

  return (
    <div className={classes.multiSelectAutocomplete}>
      <div className={classes.selectedOptions}>
        {selectedOptions.map((option) => (
          <div key={option.id} className={classes.selectedOption}>
            {option.name}
            <button
              type="button"
              onClick={() => handleRemoveOption(option)}
              className={classes.removeButton}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={classes.input}
      />
      {isDropdownVisible && (
        <div className={classes.dropdown}>
          {isLoading && <div className={classes.loading}>Loading...</div>}
          {error && <div className={classes.error}>{error}</div>}
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={classes.option}
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.some(
                  (selectedOption) => selectedOption.id === option.id
                )}
                onChange={() => handleOptionClick(option)}
                // readOnly
              />
              <img src={option.image} alt={option.name} />
              <div className={classes.optionDetail}>
                <p>{option.name}</p>
                <span>
                  {option.episode.length} Episode
                  {option.episode.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectAutocomplete
