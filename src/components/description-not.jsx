import React from 'react'

const DescriptionNot = () =>
  (
    <div>
      <h2 style={{ marginTop: 0 }}>What is yourchoice not?</h2>
      <p>
        Yourchoice does <strong>not</strong> bind to the DOM.
      </p>
      <p>
        Yourchoice does <strong>not</strong> handle pressed modifier keys.
      </p>
      <p>
        Yourchoice does <strong>not</strong> store the selection state.
        Instead, you give it the current state and it calculates the new state.
        How you store it is up to you.
      </p>
    </div>
  )

export default DescriptionNot
