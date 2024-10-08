# Multi-Select Autocomplete Example

This project is a demonstration of a multi-select autocomplete component built using React.js and TypeScript. It utilizes the [Rick and Morty API](https://rickandmortyapi.com/) to fetch character data for selection.

**[Live Demo](https://component-multiselect-autocomplete.vercel.app)**

## Technologies Used

- Vite.js
- React.js
- TypeScript
- Axios (for API requests)

## Installation

To run this project locally, follow these steps:

1. Clone this repository to your local machine using `git clone`.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Run the project using `npm run dev`.
5. Open your browser and navigate to `http://localhost:5173`(for more information, visit [Vite](https://vitejs.dev/).).

## Usage

Once the project is running, you will see a multi-select autocomplete input field.

- **Search:** Type in the input field to search for characters from the Rick and Morty series.
- **Dropdown:** Matching characters will be displayed in a dropdown list below the input field as you type.
- **Select:** You can select multiple characters from the dropdown by clicking on them or using keyboard navigation.
- **Display:** Selected characters will appear as tags within the input field.
- **Remove:** To remove a selected character, click the 'X' icon next to the tag or uncheck the corresponding character in the dropdown list.

## Acknowledgements

This project was created by Chato Node. It is based on a coding [challenge](https://github.com/sahinkutlu/frontend-case/tree/main) provided by [AdCreative.ai](https://adcreative.ai/), and it utilizes the [Rick and Morty API](https://rickandmortyapi.com/) for fetching data.

## Future Improvements

- Navigation with arrow keys between selected options and the dropdown list
- Testing error states
- Unit tests indeed!
