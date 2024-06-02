import { ChangeEvent, useEffect, useReducer, useRef } from 'react'

import classes from './MultiSelectAutoComplete.module.css'
import { TApiCharacter, TRickAndMortyApiUrl } from '../../types/ram-api'
import DropdownIcon from '../UI/svg/DropdownIcon'
import HighlightedOption from './option/HighlightedOption'
import axios from 'axios'

/** Types */

type TOption = TApiCharacter
type TApiUrl = TRickAndMortyApiUrl

type TStateSearchTerm = string

type TStateOptions = {
  selected: TOption[]
  filtered: TOption[]
  nextUrl: TApiUrl | null
}

type TStateDropdown = {
  isVisible: boolean
  isLoading: boolean
  error: string | null
}

type TState = {
  searchTerm: TStateSearchTerm
  options: TStateOptions
  dropdown: TStateDropdown
}

export enum EActionType {
  OPEN_DROPDOWN = 'OPEN_DROPDOWN',
  CLOSE_DROPDOWN = 'CLOSE_DROPDOWN',
  ENABLE_LOADING = 'ENABLE_LOADING',
  DISABLE_LOADING = 'DISABLE_LOADING',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',

  SET_SEARCH_TERM = 'SET_SEARCH_TERM',

  SET_FILTERED_OPTIONS = 'SET_FILTERED_OPTIONS',
  SET_FILTERED_OPTIONS_NOT_FOUND = 'SET_FILTERED_OPTIONS_NOT_FOUND',
  UPDATE_FILTERED_OPTIONS = 'UPDATE_FILTERED_OPTIONS',
  // CLEAR_FILTERED_OPTIONS = 'CLEAR_FILTERED_OPTIONS',

  CHECK_OPTION = 'CHECK_OPTION',
  UNCHECK_OPTION = 'UNCHECK_OPTION',
  TOGGLE_OPTION_CHECK = 'TOGGLE_OPTION_CHECK',
  UNCHECK_ALL_OPTIONS = 'UNCHECK_ALL_OPTIONS',
}

export type TAction =
  | { type: EActionType.OPEN_DROPDOWN }
  | { type: EActionType.CLOSE_DROPDOWN }
  | { type: EActionType.ENABLE_LOADING }
  | { type: EActionType.DISABLE_LOADING }
  | { type: EActionType.SET_ERROR }
  | { type: EActionType.CLEAR_ERROR }
  | {
      type: EActionType.SET_SEARCH_TERM
      payload: {
        searchTerm: TStateSearchTerm
      }
    }
  | {
      type: EActionType.SET_FILTERED_OPTIONS
      payload: {
        filteredOptions: TOption[]
        nextOptionsUrl: TApiUrl | null
      }
    }
  | {
      type: EActionType.SET_FILTERED_OPTIONS_NOT_FOUND
    }
  | {
      type: EActionType.UPDATE_FILTERED_OPTIONS
      payload: {
        moreFilteredOptions: TOption[]
        nextOptionsUrl: TApiUrl | null
      }
    }
  | {
      type: EActionType.CHECK_OPTION
      payload: {
        checkedOption: TOption
      }
    }
  | {
      type: EActionType.UNCHECK_OPTION
      payload: {
        uncheckedOptionId: TOption['id']
      }
    }
  | { type: EActionType.UNCHECK_ALL_OPTIONS }
  | {
      type: EActionType.TOGGLE_OPTION_CHECK
      payload: {
        toggledOption: TOption
      }
    }

// type TMultiSelectAutoCompleteProps = {
//   // options: TOption[]
// }

/**    Constants */

const INITIAL_STATE: TState = {
  searchTerm: '',
  options: {
    selected: [],
    filtered: [],
    nextUrl: null,
  },
  dropdown: {
    isVisible: false,
    isLoading: false, // or true logically?
    error: null,
  },
} as const

const multiSelectAutoCompleteReducer = (
  prevState: TState,
  action: TAction
): TState => {
  switch (action.type) {
    // Opening/Closing Dropdown
    case EActionType.OPEN_DROPDOWN:
      return {
        ...prevState,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          isVisible: true,
          isLoading: prevState.dropdown.isLoading,
          error: prevState.dropdown.error,
        },
      }

    case EActionType.CLOSE_DROPDOWN:
      return {
        ...prevState,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          isVisible: false,
          isLoading: prevState.dropdown.isLoading,
          error: prevState.dropdown.error,
        },
      }

    case EActionType.ENABLE_LOADING:
      return {
        ...prevState,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
          isLoading: true,
          error: prevState.dropdown.error,
        },
      }

    case EActionType.DISABLE_LOADING:
      return {
        ...prevState,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
          isLoading: false,
          error: prevState.dropdown.error,
        },
      }

    // Searching
    case EActionType.SET_SEARCH_TERM:
      // If trimmed search term has 0 characters
      if (action.payload.searchTerm.trim().length === 0) {
        return {
          searchTerm: INITIAL_STATE.searchTerm,
          options: {
            selected: prevState.options.selected,
            filtered: prevState.options.filtered,
            nextUrl: prevState.options.nextUrl,
          },
          dropdown: {
            ...prevState.dropdown,
          },
        }
      }

      // Else
      return {
        searchTerm: action.payload.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    // Filtered Options
    case EActionType.SET_FILTERED_OPTIONS:
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: action.payload.filteredOptions,
          nextUrl: action.payload.nextOptionsUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    case EActionType.SET_FILTERED_OPTIONS_NOT_FOUND:
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: [],
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    case EActionType.UPDATE_FILTERED_OPTIONS:
      const updatedFilteredOptions = [
        ...prevState.options.filtered,
        ...action.payload.moreFilteredOptions,
      ]
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: updatedFilteredOptions,
          nextUrl: action.payload.nextOptionsUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    // Checking/Unchecking/Toggling Option
    case EActionType.CHECK_OPTION:
      // If already unchecked
      if (
        !prevState.options.selected.some(
          (selected) => selected.id === action.payload.checkedOption.id
        )
      ) {
        const selectedOption = prevState.options.filtered.find(
          (option) => option.id === action.payload.checkedOption.id
        )!
        const newSelectedOptions: TOption[] = [
          ...prevState.options.selected,
          selectedOption,
        ]

        return {
          searchTerm: prevState.searchTerm,
          options: {
            selected: newSelectedOptions,
            filtered: prevState.options.filtered,
            nextUrl: prevState.options.nextUrl,
          },
          dropdown: {
            ...prevState.dropdown,
          },
        }
      }

      // Else
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    case EActionType.UNCHECK_OPTION:
      // If already checked
      if (
        prevState.options.selected.some(
          (selected) => selected.id === action.payload.uncheckedOptionId
        )
      ) {
        const newSelectedOptions: TOption[] = prevState.options.selected.filter(
          (option) => {
            return option.id !== action.payload.uncheckedOptionId
          }
        )

        return {
          searchTerm: prevState.searchTerm,
          options: {
            selected: newSelectedOptions,
            filtered: prevState.options.filtered,
            nextUrl: prevState.options.nextUrl,
          },
          dropdown: {
            ...prevState.dropdown,
          },
        }
      }

      // Else
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: prevState.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }
    case EActionType.TOGGLE_OPTION_CHECK:
      // If: already unchecked
      if (
        !prevState.options.selected.some(
          (selected) => selected.id === action.payload.toggledOption.id
        )
      ) {
        // CHECK_OPTION
        const selectedOption = prevState.options.filtered.find(
          (option) => option.id === action.payload.toggledOption.id
        )!
        const newSelectedOptions: TOption[] = [
          ...prevState.options.selected,
          selectedOption,
        ]

        return {
          searchTerm: prevState.searchTerm,
          options: {
            selected: newSelectedOptions,
            filtered: prevState.options.filtered,
            nextUrl: prevState.options.nextUrl,
          },
          dropdown: {
            ...prevState.dropdown,
          },
        }
      }

      // Else: If already checked
      // UNCHECK_OPTION
      const newSelectedOptions: TOption[] = prevState.options.selected.filter(
        (option) => {
          return option.id !== action.payload.toggledOption.id
        }
      )

      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: newSelectedOptions,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    case EActionType.UNCHECK_ALL_OPTIONS:
      return {
        searchTerm: prevState.searchTerm,
        options: {
          selected: INITIAL_STATE.options.selected,
          filtered: prevState.options.filtered,
          nextUrl: prevState.options.nextUrl,
        },
        dropdown: {
          ...prevState.dropdown,
        },
      }

    default:
      return prevState
  }
}

const MultiSelectAutoComplete = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, dispatch] = useReducer(multiSelectAutoCompleteReducer, {
    searchTerm: INITIAL_STATE.searchTerm,
    options: {
      selected: INITIAL_STATE.options.selected,
      filtered: INITIAL_STATE.options.filtered,
      nextUrl: INITIAL_STATE.options.nextUrl,
    },
    dropdown: {
      isVisible: INITIAL_STATE.dropdown.isVisible,
      isLoading: INITIAL_STATE.dropdown.isLoading,
      error: INITIAL_STATE.dropdown.error,
    },
  })

  // console.log('State Dropdown:', state.dropdown)

  const openDropdownHandler = () => {
    dispatch({
      type: EActionType.OPEN_DROPDOWN,
    })
  }
  const closeDropdownHandler = () => {
    dispatch({
      type: EActionType.CLOSE_DROPDOWN,
    })
  }

  const toggleDropdownHandler = () => {
    if (state.dropdown.isVisible) {
      closeDropdownHandler()

      return
    }

    focusSearchInputHandler()
    openDropdownHandler()
  }

  const changeSearchTermHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: EActionType.OPEN_DROPDOWN,
    })
    dispatch({
      type: EActionType.SET_SEARCH_TERM,
      payload: {
        searchTerm: event.target.value,
      },
    })
  }

  const loadMoreHandler = () => {
    const fetchNextFilteredOptions = async (nextUrl: TApiUrl) => {
      dispatch({
        type: EActionType.ENABLE_LOADING,
      })

      try {
        const response = await axios.get(nextUrl)
        const data = response.data

        if (data.results && data.info) {
          dispatch({
            type: EActionType.UPDATE_FILTERED_OPTIONS,
            payload: {
              moreFilteredOptions: data.results,
              nextOptionsUrl: data.info.next,
            },
          })
        }

        dispatch({ type: EActionType.DISABLE_LOADING })
      } catch (error: any) {
        console.error(error)

        // TODO: add SET_ERROR action
        // TODO: add SET_IS_LOADING action
      }
    }

    if (state.options.nextUrl !== null) {
      // const timeout = setTimeout(() => {
      fetchNextFilteredOptions(state.options.nextUrl) // nextUrl!) when inside timeout
      //   console.log(state.dropdown)
      // }, 1000)

      // console.log(state.dropdown)

      // return
    }
  }

  useEffect(() => {
    const fetchFilteredOptions = async (searchTerm: TStateSearchTerm) => {
      dispatch({
        type: EActionType.ENABLE_LOADING,
      })
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${searchTerm}`
        )
        const data = response.data
        if (data.results && data.info) {
          dispatch({
            type: EActionType.SET_FILTERED_OPTIONS,
            payload: {
              filteredOptions: data.results,
              nextOptionsUrl: data.info.next,
            },
          })

          dispatch({ type: EActionType.DISABLE_LOADING })
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          dispatch({
            type: EActionType.SET_FILTERED_OPTIONS_NOT_FOUND,
          })

          dispatch({ type: EActionType.DISABLE_LOADING })

          return
        }

        console.error(error)

        // TODO: add SET_ERROR action
        // TODO: add SET_IS_LOADING action
      }
    }

    if (state.searchTerm.trim().length > 0) {
      fetchFilteredOptions(state.searchTerm)
    } else {
      dispatch({
        type: EActionType.SET_SEARCH_TERM,
        payload: {
          searchTerm: '',
        },
      })
    }
  }, [state.searchTerm])

  // const checkOptionHandler = (optionId: TOption['id']) => {
  //   dispatch({
  //     type: EActionType.CHECK_OPTION,
  //     payload: { checkedOptionId: optionId },
  //   })
  // }

  const uncheckOptionHandler = (optionId: TOption['id']) => {
    dispatch({
      type: EActionType.UNCHECK_OPTION,
      payload: { uncheckedOptionId: optionId },
    })
  }

  const toggleOptionCheckHandler = (option: TOption) => {
    dispatch({
      type: EActionType.TOGGLE_OPTION_CHECK,
      payload: {
        toggledOption: option,
      },
    })
  }

  // const uncheckAllOptionsHandler = () => {
  //   dispatch({
  //     type: EActionType.UNCHECK_ALL_OPTIONS,
  //   })
  // }

  const focusSearchInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const dropdownArrowClasses = `${classes['dropdown-arrow']}${
    state.dropdown.isVisible ? ` ${classes.active}` : ''
  }`

  return (
    <div className={classes.container}>
      <div className={classes['search-container']}>
        <div
          className={classes['search-input-container']}
          onClick={focusSearchInputHandler}
        >
          {state.options.selected.map((option) => {
            return (
              <div key={option.id} className={classes['selected-option']}>
                {option.name}
                <button
                  type="button"
                  className={classes['remove-selected-option']}
                  onClick={() => uncheckOptionHandler(option.id)}
                >
                  &times;
                </button>
              </div>
            )
          })}
          <input
            ref={inputRef}
            className={classes['search-input']}
            onChange={changeSearchTermHandler}
            placeholder="Search..."
          />
        </div>
        <span className={dropdownArrowClasses} onClick={toggleDropdownHandler}>
          <DropdownIcon />
        </span>
      </div>
      {/* {Dropdown} */}
      {state.dropdown.isVisible && (
        <div className={classes['dropdown-container']}>
          {/* {isLoading} */}
          {/* {error} */}
          {state.searchTerm.trim().length !== 0 &&
            state.options.filtered.length === 0 && (
              <div className={classes['no-results']}>No results found.</div>
            )}
          {state.options.filtered.length !== 0 &&
            state.options.filtered.map((option) => {
              const optionIsSelected = state.options.selected.some(
                (selectedOption) => selectedOption.id === option.id
              )

              return (
                <div
                  key={option.id}
                  className={`${classes.option}${
                    optionIsSelected ? ` ${classes.selected}` : ''
                  }`}
                  onClick={() => toggleOptionCheckHandler(option)}
                >
                  <input type="checkbox" checked={optionIsSelected} readOnly />
                  <img src={option.image} alt={option.name} />
                  <div className={classes['option-detail']}>
                    <p>
                      <HighlightedOption
                        text={option.name}
                        highlight={state.searchTerm}
                      />
                    </p>
                    <span>
                      {option.episode.length} Episode
                      {option.episode.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              )
            })}
          {state.options.filtered.length > 0 && state.options.nextUrl && (
            <div className={`${classes.navigation}`} onClick={loadMoreHandler}>
              {/* <span>{`<< First`}</span> */}
              {/* <span>{`< Previous`}</span> */}
              {/* <span>{`Next >`}</span> */}
              {/* <span>{`Last >>`}</span> */}
              <span>
                {state.dropdown.isLoading ? 'Loading...' : 'Load More...'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelectAutoComplete
