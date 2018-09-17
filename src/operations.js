import {
  clone,
  curry,
  difference,
  includes,
  intersection,
  union,
  without,
} from 'lodash/fp'

import flow from './flow'

function init() {
  return {
    items: [],
    selected: [],
    changed: {
      selected: [],
      deselected: [],
    },
    anchor: null,
  }
}

function _iterableToArray(iterable) {
  const array = []
  for (const item of iterable) {
    array.push(item)
  }
  return array
}

const setItems = curry((itemsIterable, state) => {
  const items = _iterableToArray(itemsIterable)
  return {
    items,
    selected: intersection(state.selected, items),
    changed: {
      selected: [],
      deselected: difference(state.selected, items),
    },
    anchor: includes(state.anchor, items) ? state.anchor : null,
  }
})

const setSelection = curry((selectedItems, state) => {
  const selection = intersection(selectedItems, state.items)
  return {
    items: state.items,
    selected: selection,
    changed: {
      selected: without(state.selected, selection),
      deselected: without(selection, state.selected),
    },
    anchor: state.anchor,
  }
})

function getItems(state) {
  return clone(state.items)
}

function getSelection(state) {
  return clone(state.selected)
}

function getChangedSelection(state) {
  return clone(state.changed.selected)
}

function getChangedDeselection(state) {
  return clone(state.changed.deselected)
}

function _getBottommostSelectedItem(state) {
  let previousItem = null

  const isSelected = item =>
    state.selected.indexOf(item) !== -1

  for (const item of state.items) {
    if (isSelected(item)) {
      previousItem = item
    }
  }

  return previousItem
}

function _getAnchor(state) {
  if (state.anchor !== null && state.anchor !== undefined) {
    return state.anchor
  }

  if (state.selected.length > 0) {
    return _getBottommostSelectedItem(state)
  }

  return state.items[0]
}

const replace = curry((selectedItem, state) => {
  if (!includes(selectedItem, state.items)) {
    return state
  }
  return {
    items: state.items,
    selected: [selectedItem],
    changed: {
      selected: without(state.selected, [selectedItem]),
      deselected: without([selectedItem], state.selected),
    },
    anchor: selectedItem,
  }
})

const toggle = curry((toggledItem, state) => {
  if (!includes(toggledItem, state.items)) {
    return state
  }

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

const remove = curry((removedItems, state) =>
  ({
    items: state.items,
    selected: without(removedItems, state.selected),
    changed: {
      selected: [],
      deselected: intersection(removedItems, state.selected),
    },
    anchor: null,
  }))

const removeAll = curry(state =>
  ({
    items: state.items,
    selected: [],
    changed: {
      selected: [],
      deselected: state.selected,
    },
    anchor: null,
  }))

function _between(start, end, array) {
  if (start === end) {
    return [start]
  }

  let startIndex = array.indexOf(start)
  let endIndex = array.indexOf(end)

  if (startIndex > endIndex) {
    const temp = startIndex
    startIndex = endIndex
    endIndex = temp
  }

  return array.slice(startIndex, endIndex + 1)
}

function _connectedWith(targetItem, selected, array) {
  const isSelected = item =>
    selected.indexOf(item) !== -1
  const result = []
  const targetIndex = array.indexOf(targetItem)

  for (let i = targetIndex; i >= 0; i -= 1) {
    if (!isSelected(array[i])) {
      break
    }
    result.push(array[i])
  }

  for (let i = targetIndex; i < array.length; i += 1) {
    if (!isSelected(array[i])) {
      break
    }
    result.push(array[i])
  }

  return result
}

const rangeTo = curry((toItem, state) => {
  if (!includes(toItem, state.items)) {
    return state
  }

  const anchor = _getAnchor(state, state.items)
  const connected = _connectedWith(anchor, state.selected, state.items)
  const range = _between(anchor, toItem, state.items)

  const selected = flow(
    without(connected),
    union(range),
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

export {
  init,
  setItems,
  setSelection,
  replace,
  toggle,
  remove,
  removeAll,
  rangeTo,
  getItems,
  getSelection,
  getChangedSelection,
  getChangedDeselection,
}
