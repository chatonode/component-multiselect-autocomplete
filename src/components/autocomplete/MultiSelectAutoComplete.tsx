import classes from './MultiSelectAutoComplete.module.css'
import { useEffect, useReducer } from 'react'
import { TApiCharacter } from '../../types/ram-api'

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
        checkedOption: TOption
      }
    }
  | {
      type: EActionType.UNCHECK_OPTION
      payload: {
        uncheckedOption: TOption
      }
    }
  | { type: EActionType.UNCHECK_ALL_OPTIONS }

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
      return {
        searchTerm: action.payload.searchTerm,
        options: {
          original: prevState.options.original,
          selected: prevState.options.selected,
          searchedAndFiltered: prevState.options.searchedAndFiltered,
        },
        dropdown: {
          ...prevState.dropdown,
          //   isVisible: false,
        },
      }

    case EActionType.CHECK_OPTION:

    case EActionType.UNCHECK_OPTION:

    case EActionType.UNCHECK_ALL_OPTIONS:

    default:
      return prevState
  }
}

const MultiSelectAutoComplete = (props: TMultiSelectAutoCompleteProps) => {
  const [state, dispatch] = useReducer(multiSelectAutoCompleteReducer, {
    searchTerm: INITIAL_STATE.searchTerm,
    options: {
      original: props.options, // Saving fetched (from the parent) data initially
      selected: INITIAL_STATE.options.selected,
      searchedAndFiltered: INITIAL_STATE.options.searchedAndFiltered,
    },
    dropdown: {
      isVisible: INITIAL_STATE.dropdown.isVisible,
    },
  })

  return (
    <>
      <div className={classes.container}>
        <div className={classes['search-input-container']}>
          {/* {Selected Option(s) with 'name', if each option exists} */}
          <input className={classes['search-input']} />
        </div>
        <button className={classes['dropdown-arrow-button']}>
          <span>{/* {dropdown arrow button icon} */}</span>
        </button>
      </div>
      {/* {Dropdown} */}
    </>
  )
}

export default MultiSelectAutoComplete
