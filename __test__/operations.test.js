import flow from '../src/flow'
import {
  init,
  setItems,
  setSelection,
  replace,
  toggle,
  rangeTo,
  getItems,
  getSelection,
  getChangedSelection,
  getChangedDeselection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('operations', () => {
  it('should have no selected items by default', () => {
    const state = init()

    expectExactlySameMembers(getSelection(state), [])
  })

  it('should have no selectable items by default', () => {
    const state = init()

    expectExactlySameMembers(getItems(state), [])
  })

  describe('ignoring and preventing external changes', () => {
    it('should ignore external changes to the given items iterable', () => {
      const itemsIterable = ['B', 'C']
      const state1 = flow(
        init,
        setItems(itemsIterable),
      )()
      itemsIterable.unshift('A')
      const state2 = flow(rangeTo('C'))(state1)

      expectExactlySameMembers(getItems(state2), ['B', 'C'])
      expectExactlySameMembers(getSelection(state2), ['B', 'C'])
    })

    it('should ignore external changes of got items iterable', () => {
      const state1 = flow(
        init,
        setItems(['B', 'C']),
      )()
      const itemsIterable = getItems(state1)
      itemsIterable.unshift('A')
      const state2 = flow(rangeTo('C'))(state1)

      expectExactlySameMembers(getItems(state2), ['B', 'C'])
      expectExactlySameMembers(getSelection(state2), ['B', 'C'])
    })

    it('should ignore external changes to the given selection array', () => {
      const selectionArray = ['B', 'C']
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        setSelection(selectionArray),
      )(undefined)
      selectionArray.push('D')

      expectExactlySameMembers(getSelection(state), ['B', 'C'])
    })

    it('should prevent external changes of selection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        setSelection(['A', 'B']),
      )(undefined)

      const selectionArray = getSelection(state)
      selectionArray.push('C')

      expectExactlySameMembers(getSelection(state), ['A', 'B'])
    })

    it('should prevent external changes of changed-selection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        replace('B'),
      )(undefined)

      const changedSelectionArray = getChangedSelection(state)
      changedSelectionArray.push('C')

      expectExactlySameMembers(getChangedSelection(state), ['B'])
    })

    it('should prevent external changes of changed-deselection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        replace('B'),
        toggle('B'),
      )(undefined)

      const changedDeselectionArray = getChangedDeselection(state)
      changedDeselectionArray.push('C')

      expectExactlySameMembers(getChangedDeselection(state), ['B'])
    })
  })
})
