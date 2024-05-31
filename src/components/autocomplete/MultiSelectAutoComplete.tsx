import { ChangeEvent, act, useReducer, useRef } from 'react'

import classes from './MultiSelectAutoComplete.module.css'
import { TApiCharacter } from '../../types/ram-api'
import DropdownIcon from '../UI/svg/DropdownIcon'

/** Types */

type TOption = TApiCharacter

type TStateSearchTerm = string

type TStateOptions = {
  original: TOption[]
  selected: TOption[]
  searchedAndFiltered: TOption[]
}

type TStateDropdown = {
  isVisible: boolean
}

type TState = {
  searchTerm: TStateSearchTerm
  options: TStateOptions
  dropdown: TStateDropdown
}

export enum EActionType {
  OPEN_DROPDOWN = 'OPEN_DROPDOWN',
  CLOSE_DROPDOWN = 'CLOSE_DROPDOWN',

  SET_SEARCH_TERM = 'SET_SEARCH_TERM',

  CHECK_OPTION = 'CHECK_OPTION',
  UNCHECK_OPTION = 'UNCHECK_OPTION',
  TOGGLE_OPTION_CHECK = 'TOGGLE_OPTION_CHECK',
  UNCHECK_ALL_OPTIONS = 'UNCHECK_ALL_OPTIONS',
}

export type TAction =
  | { type: EActionType.OPEN_DROPDOWN }
  | { type: EActionType.CLOSE_DROPDOWN }
  | {
      type: EActionType.SET_SEARCH_TERM
      payload: {
        searchTerm: TStateSearchTerm
      }
    }
  | {
      type: EActionType.CHECK_OPTION
      payload: {
        checkedOptionId: TOption['id']
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
        toggledOptionId: TOption['id']
      }
    }

type TMultiSelectAutoCompleteProps = {
  options: TOption[]
}

/**    Constants */

const INITIAL_STATE: TState = {
  searchTerm: '',
  options: {
    original: [],
    selected: [],
    searchedAndFiltered: [],
  },
  dropdown: {
    isVisible: false,
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
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          //   ...prevState.dropdown,
          isVisible: true,
        },
      }

    case EActionType.CLOSE_DROPDOWN:
      return {
        ...prevState,
        options: {
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          //   ...prevState.dropdown,
          isVisible: false,
        },
      }

    // Checking/Unchecking & Searching
    case EActionType.SET_SEARCH_TERM:
      if (action.payload.searchTerm.trim().length === 0) {
        console.log('searchTerm:', action.payload.searchTerm)

        return {
          searchTerm: INITIAL_STATE.searchTerm,
          options: {
            original: prevState.options.original,
            selected: prevState.options.selected,
            searchedAndFiltered: prevState.options.original,
          },
          dropdown: {
            isVisible: prevState.dropdown.isVisible,
          },
        }
      }

      const searchedAndFilteredOptions = prevState.options.original.filter(
        (option) =>
          option.name
            .toLowerCase()
            .includes(action.payload.searchTerm.toLowerCase())
      )
      return {
        searchTerm: action.payload.searchTerm,
        options: {
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: searchedAndFilteredOptions,
        },
        dropdown: {
          ...prevState.dropdown,
          //   isVisible: false,
        },
      }

    case EActionType.CHECK_OPTION:
      if (
        !prevState.options.selected.some(
          (selected) => selected.id === action.payload.checkedOptionId
        )
      ) {
        const selectedOption = prevState.options.original.find(
          (option) => option.id === action.payload.checkedOptionId
        )!
        const newSelectedOptions: TOption[] = [
          ...prevState.options.selected,
          selectedOption,
        ]

        return {
          searchTerm: prevState.searchTerm,
          options: {
            original: prevState.options.original,
            selected: newSelectedOptions,
            searchedAndFiltered: prevState.options.searchedAndFiltered,
          },
          dropdown: {
            isVisible: prevState.dropdown.isVisible,
          },
        }
      }

      // Else
      return {
        searchTerm: prevState.searchTerm,
        options: {
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
        },
      }
    case EActionType.UNCHECK_OPTION:
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

        console.log('newSelectedOptions:', newSelectedOptions)

        return {
          searchTerm: prevState.searchTerm,
          options: {
            original: prevState.options.original,
            selected: newSelectedOptions,
            searchedAndFiltered: prevState.options.searchedAndFiltered,
          },
          dropdown: {
            isVisible: prevState.dropdown.isVisible,
          },
        }
      }

      // Else
      return {
        searchTerm: prevState.searchTerm,
        options: {
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
        },
      }
    case EActionType.TOGGLE_OPTION_CHECK:
      if (
        !prevState.options.selected.some(
          (selected) => selected.id === action.payload.toggledOptionId
        )
      ) {
        // CHECK_OPTION
        const selectedOption = prevState.options.original.find(
          (option) => option.id === action.payload.toggledOptionId
        )!
        const newSelectedOptions: TOption[] = [
          ...prevState.options.selected,
          selectedOption,
        ]

        return {
          searchTerm: prevState.searchTerm,
          options: {
            original: prevState.options.original,
            selected: newSelectedOptions,
            searchedAndFiltered: prevState.options.searchedAndFiltered,
          },
          dropdown: {
            isVisible: prevState.dropdown.isVisible,
          },
        }
      }

      // Else: UNCHECK_OPTION
      const newSelectedOptions: TOption[] = prevState.options.selected.filter(
        (option) => {
          return option.id !== action.payload.toggledOptionId
        }
      )

      return {
        searchTerm: prevState.searchTerm,
        options: {
          original: prevState.options.original,
          selected: newSelectedOptions,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
        },
      }

    case EActionType.UNCHECK_ALL_OPTIONS:
      return {
        searchTerm: prevState.searchTerm,
        options: {
          original: prevState.options.original,
          selected: INITIAL_STATE.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          isVisible: prevState.dropdown.isVisible,
        },
      }

    default:
      return prevState
  }
}

const MultiSelectAutoComplete = (props: TMultiSelectAutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, dispatch] = useReducer(multiSelectAutoCompleteReducer, {
    searchTerm: INITIAL_STATE.searchTerm,
    options: {
      original: props.options, // Saving fetched (from the parent) data initially
      selected: INITIAL_STATE.options.selected,
      searchedAndFiltered: props.options, // Unfiltered (from the parent) original data:
      //-> for accessing all during initial click without searching
    },
    dropdown: {
      isVisible: INITIAL_STATE.dropdown.isVisible,
    },
  })

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

  const toggleOptionCheckHandler = (optionId: TOption['id']) => {
    dispatch({
      type: EActionType.TOGGLE_OPTION_CHECK,
      payload: {
        toggledOptionId: optionId,
      },
    })
  }

  // const uncheckAllOptionsHandler = () => {
  //   dispatch({
  //     type: EActionType.UNCHECK_ALL_OPTIONS,
  //   })
  // }

  const focusSearchInputHandler = () => {
    // Check if the inputRef is not null and has a current property
    if (inputRef.current) {
      // Focus the input element
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
          {/* {Selected Option(s) with 'name', if each option exists} */}
          {/* <div className={classes['selected-options']}> */}
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
          {/* </div> */}
          <input
            ref={inputRef}
            className={classes['search-input']}
            onChange={changeSearchTermHandler}
            placeholder="search..."
          />
        </div>
        <span className={dropdownArrowClasses} onClick={toggleDropdownHandler}>
          {/* {dropdown arrow button icon} */}
          <DropdownIcon />
        </span>
      </div>
      {/* {Dropdown} */}
      {state.dropdown.isVisible && (
        <div className={classes['dropdown-container']}>
          {/* {isLoading} */}
          {/* {error} */}
          {state.searchTerm.trim().length !== 0 &&
            state.options.searchedAndFiltered.length === 0 && (
              <div className={classes['no-results']}>No results found...</div>
            )}
          {state.options.searchedAndFiltered.length !== 0 &&
            state.options.searchedAndFiltered.map((option) => {
              const optionIsSelected = state.options.selected.some(
                (selectedOption) => selectedOption.id === option.id
              )

              return (
                <div
                  key={option.id}
                  className={`${classes.option}${
                    optionIsSelected ? ` ${classes.selected}` : ''
                  }`}
                  onClick={() => toggleOptionCheckHandler(option.id)}
                >
                  <input type="checkbox" checked={optionIsSelected} readOnly />
                  <img src={option.image} alt={option.name} />
                  <div className={classes['option-detail']}>
                    <p>{option.name}</p>
                    <span>
                      {option.episode.length} Episode
                      {option.episode.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default MultiSelectAutoComplete
