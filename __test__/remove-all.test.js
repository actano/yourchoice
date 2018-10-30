import flow from '../src/flow'
import {
  getChangedDeselection,
  getChangedSelection,
  getSelection,
  init,
  removeAll,
  setItems,
  setSelection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('removeAll - remove all items from selection', () => {
  let newState = null

  beforeEach(() => {
    const items = iterable(['A', 'B', 'C', 'D'])
    const state = init()

    newState = flow(
      setItems(items),
      setSelection(['A', 'C']),
      removeAll(),
    )(state)
  })

  it('should return empty selection', () => {
    expectExactlySameMembers(getSelection(newState), [])
  })

  it('should return previously selected items as newly deselected', () => {
    expectExactlySameMembers(getChangedDeselection(newState), ['A', 'C'])
  })

  it('should return empty list as newly selected', () => {
    expectExactlySameMembers(getChangedSelection(newState), [])
  })
})
