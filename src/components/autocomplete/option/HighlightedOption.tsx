import classes from './HighlightedOption.module.css'

type THighlightedOptionProps = {
  text: string
  highlight: string
}

const HighlightedOption = (props: THighlightedOptionProps) => {
  const parts = props.text.split(new RegExp(`(${props.highlight})`, 'gi'))
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === props.highlight.toLowerCase() ? (
          <span key={index} className={classes.highlight}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  )
}

export default HighlightedOption
