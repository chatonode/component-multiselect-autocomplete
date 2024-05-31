// import { memo } from 'react'

// const DropdownIcon = () => {
//   return (
//     <svg
//       version="1.0"
//       xmlns="http://www.w3.org/2000/svg"
//       width="50px"
//       height="50px"
//       viewBox="0 0 50 50"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       <g
//         transform="translate(0,46) scale(0.1,-0.1)"
//         fill="#475569"
//         stroke="none"
//       >
//         <path d="M193 274 c-6 -16 81 -114 102 -114 21 0 108 98 102 114 -9 23 -195 23 -204 0z" />
//       </g>
//     </svg>
//   )
// }

// export default memo(DropdownIcon)

import { memo } from 'react'
import classes from './DropdownIcon.module.css'

const DropdownIcon = () => (
  <svg
    fill="#475569"
    className={classes.icon}
    viewBox="-6.5 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <title>dropdown</title>
      <path d="M18.813 11.406l-7.906 9.906c-0.75 0.906-1.906 0.906-2.625 0l-7.906-9.906c-0.75-0.938-0.375-1.656 0.781-1.656h16.875c1.188 0 1.531 0.719 0.781 1.656z"></path>
    </g>
  </svg>
)

export default memo(DropdownIcon)
