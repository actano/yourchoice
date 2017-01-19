import React from 'react'

const Description = () =>
  (
    <div>
      <h2 style={{ marginTop: 0 }}>What is yourchoice?</h2>
      <p>
        Yourchoice is a tiny npm module handling selection logic for you.
        It resembles the selection behavior of popular file managers.
        It is simple, <a href="https://github.com/actano/yourchoice/tree/master/__test__">well tested</a> and
        works with any iterable data structure.
      </p>
      <p>
        Yourchoice was designed to work well with functional
        programming and the Flux architecture.
        There is a yourchoice wrapper for convenient usage
        with <code>redux</code> called <a href="https://github.com/actano/yourchoice-redux">yourchoice-redux</a>.
        In fact, this demo pages uses it.
      </p>
      <p>
        Try selecting some Star Wars actors in the list.
      </p>
      <p>
        On this page, <kbd>shift+click</kbd> performs a range
        selection, <kbd>(cmd/ctlr)+click</kbd> toggles
        the selection for the current item and <kbd>click</kbd> selects
        the item while deselecting the rest.
      </p>
    </div>
  )

export default Description
