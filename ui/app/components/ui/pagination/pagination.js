import React from 'react'

export const Pagination = ({currentPage, changePage, prevDisabled, nextDisabled}) => (
  <section className='pagination'>
      <button disabled={prevDisabled}  className={`pagination__change`} onClick={() => changePage(-1)}>Previous</button>
      <span className='pagination__page'>{currentPage}</span>
      <button disabled={nextDisabled} className={`pagination__change`} onClick={() => changePage(1)}>Next</button>
  </section>
)
