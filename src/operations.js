import {
  curry,
  flow,
  without,
  includes,
  intersection,
  union,
} from 'lodash/fp'

function init() {
  return {
    items: emptyIterable(),
    selected: [],
    changed: {
      selected: [],
      deselected: [],
    },
    anchor: null,
  }
}

const setItems = curry((items, state) =>
  ({
    items,
    selected: state.selected,
    changed: {
      selected: [],
      deselected: [],
    },
    anchor: state.anchor,
  })
)

const setSelection = curry((selection, state) =>
  ({
    items: state.items,
    selected: selection,
    changed: {
      selected: without(state.selected, selection),
      deselected: without(selection, state.selected),
    },
    anchor: state.anchor,
  })
)

function getSelection(state) {
  return state.selected
}

function getChangedSelection(state) {
  return state.changed.selected
}

function getChangedDeselection(state) {
  return state.changed.deselected
}

function _getAnchor(state) {
  if (state.anchor !== null && state.anchor !== undefined) {
    return state.anchor
  }

  if (state.selected.length > 0) {
    return _getBottommostSelectedItem(state)
  }

  return state.items[Symbol.iterator]().next().value
}

function _getBottommostSelectedItem(state) {
  let previousItem = null

  const isSelected = (item) =>
    state.selected.indexOf(item) !== -1

  for (const item of state.items) {
    if (isSelected(item)) {
      previousItem = item
    }
  }

  return previousItem
}

function emptyIterable() {
  const array = []
  return {
    [Symbol.iterator]: array[Symbol.iterator].bind(array),
  }
}

const replace = curry((selectedItem, state) =>
  ({
    items: state.items,
    selected: [selectedItem],
    changed: {
      selected: without(state.selected, [selectedItem]),
      deselected: without([selectedItem], state.selected),
    },
    anchor: selectedItem,
  })
)

const toggle = curry((toggledItem, state) => {
  const itemIsAdded = !includes(toggledItem, state.selected)

  if (itemIsAdded) {
    return {
      items: state.items,
      selected: state.selected.concat([toggledItem]),
      changed: {
        selected: [toggledItem],
        deselected: [],
      },
      anchor: toggledItem,
    }
  }

  const anchorIsRemoved = (toggledItem === state.anchor)
  const newAnchor = anchorIsRemoved ? null : state.anchor

  return {
    items: state.items,
    selected: without([toggledItem], state.selected),
    changed: {
      selected: [],
      deselected: [toggledItem],
    },
    anchor: newAnchor,
  }
})

const remove = curry((removedItem, state) =>
  ({
    items: state.items,
    selected: without(removedItem, state.selected),
    changed: {
      selected: [],
      deselected: intersection(removedItem, state.selected),
    },
    anchor: null,
  })
)

const removeAll = curry((state) =>
  ({
    items: state.items,
    selected: [],
    changed: {
      selected: [],
      deselected: state.selected,
    },
    anchor: null,
  })
)

const rangeTo = curry((toItem, state) => {
  const anchor = _getAnchor(state, state.items)
  const connected = _connectedWith(anchor, state.selected, state.items)
  const range = _between(anchor, toItem, state.items)

  const selected = flow(
    without(connected),
    union(range)
  )(state.selected)

  return {
    items: state.items,
    selected,
    changed: {
      selected: without(state.selected, selected),
      deselected: without(selected, state.selected),
    },
    anchor: state.anchor,
  }
})

function _between(start, end, iterable) {
  if (start === end) {
    return [start]
  }

  const result = []
  let inRange = false
  let foundStartEnd = 0

  for (const item of iterable) {
    if (inRange) {
      result.push(item)

      if ((item === start) || (item === end)) {
        foundStartEnd++
        inRange = false
      }
    } else {
      if ((item === start) || (item === end)) {
        foundStartEnd++
        inRange = true
        result.push(item)
      }
    }
  }

  if (foundStartEnd === 2) {
    return result
  }

  return []
}

function _connectedWith(targetItem, selected, iterable) {
  let range = []
  let isRangeWithTargetItem = false

  const isSelected = (item) =>
    selected.indexOf(item) !== -1

  for (const item of iterable) {
    if (isSelected(item)) {
      range.push(item)

      if (item === targetItem) {
        isRangeWithTargetItem = true
      }
    } else {
      if (isRangeWithTargetItem) {
        break
      } else {
        range = []
      }
    }
  }

  return range
}

export {
  init,
  setItems,
  setSelection,
  replace,
  toggle,
  remove,
  removeAll,
  rangeTo,
  getSelection,
  getChangedSelection,
  getChangedDeselection,
}
