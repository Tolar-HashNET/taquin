import React from 'react'

export const TolarButton = ({children, onClick}) => (
  <button className='tolar-button' onClick={onClick}>
      {children}
  </button>
)
