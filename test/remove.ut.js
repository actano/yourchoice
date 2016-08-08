import { flow } from 'lodash/fp'
import {
  getChangedDeselection,
  getChangedSelection,
  getSelection,
  init,
  remove,
  setItems,
  setSelection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('remove - remove items from selection', () => {
  let newState = null

  beforeEach(() => {
    const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
    const state = init()

    newState = flow(
      setItems(items),
      setSelection(['A', 'B', 'C', 'D', 'F']),
      remove(['A', 'D', 'B'])
    )(state)
  })

  it('should remove items from selection', () => {
    expectExactlySameMembers(getSelection(newState), ['C', 'F'])
  })

  it('should return items as newly deselected', () => {
    expectExactlySameMembers(getChangedDeselection(newState), ['A', 'D', 'B'])
  })

  it('should return empty list as newly selected', () => {
    expectExactlySameMembers(getChangedSelection(newState), [])
  })

  it('should return only previously selected items as newly deselected', () => {
    const items = iterable(['A', 'B', 'C', 'D'])
    const state = init()

    newState = flow(
      setItems(items),
      setSelection(['A', 'B']),
      remove(['A', 'B', 'C'])
    )(state)

    expectExactlySameMembers(getChangedDeselection(newState), ['A', 'B'])
  })
})

