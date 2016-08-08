import { flow } from 'lodash/fp'
import {
  init,
  setItems,
  setSelection,
  replace,
  toggle,
  rangeTo,
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

  describe('ignoring and preventing external changes', () => {
    it('should ignore external changes to the given items iterable', () => {
      const itemsIterable = ['B', 'C']
      const state1 = flow(
        init,
        setItems(itemsIterable)
      )()
      itemsIterable.unshift('A')
      const state2 = flow(
        rangeTo('C')
      )(state1)

      expectExactlySameMembers(getSelection(state2), ['B', 'C'])
    })

    it('should ignore external changes to the given selection array', () => {
      const selectionArray = ['B', 'C']
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        setSelection(selectionArray)
      )(state)
      selectionArray.push('D')

      expectExactlySameMembers(getSelection(state), ['B', 'C'])
    })

    it('should prevent external changes of selection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        setSelection(['A', 'B'])
      )(state)

      const selectionArray = getSelection(state)
      selectionArray.push('C')

      expectExactlySameMembers(getSelection(state), ['A', 'B'])
    })

    it('should prevent external changes of changed-selection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        replace('B')
      )(state)

      const changedSelectionArray = getChangedSelection(state)
      changedSelectionArray.push('C')

      expectExactlySameMembers(getChangedSelection(state), ['B'])
    })

    it('should prevent external changes of changed-deselection array', () => {
      const state = flow(
        init,
        setItems(iterable(['A', 'B', 'C'])),
        replace('B'),
        toggle('B')
      )(state)

      const changedDeselectionArray = getChangedDeselection(state)
      changedDeselectionArray.push('C')

      expectExactlySameMembers(getChangedDeselection(state), ['B'])
    })
  })
})
