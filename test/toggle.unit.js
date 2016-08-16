import { flow } from 'lodash/fp'
import {
  getChangedDeselection,
  getChangedSelection,
  getSelection,
  init,
  setItems,
  setSelection,
  toggle,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('toggle - toggle single selection', () => {
  describe('item is not selected', () => {
    let newState = null

    beforeEach(() => {
      const state = init()

      newState = flow(
        setItems(iterable(['A', 'B', 'C', 'D'])),
        setSelection(['A', 'D']),
        toggle('C')
      )(state)
    })

    it('should add item to selection', () => {
      expectExactlySameMembers(getSelection(newState), ['A', 'D', 'C'])
    })

    it('should return item as newly selected', () => {
      expectExactlySameMembers(getChangedSelection(newState), ['C'])
    })

    it('should return empty list as newly deselected', () => {
      expectExactlySameMembers(getChangedDeselection(newState), [])
    })

    it('should not select item that is not part if the given selectable items', () => {
      const state = init()

      newState = flow(
        setItems(iterable(['A', 'B', 'C', 'D'])),
        setSelection(['A', 'D']),
        toggle('nonExisting')
      )(state)

      expectExactlySameMembers(getSelection(newState), ['A', 'D'])
    })
  })

  describe('item is already selected', () => {
    let newState = null

    beforeEach(() => {
      const items = iterable(['A', 'B', 'C', 'D'])
      const state = init()

      newState = flow(
        setItems(items),
        setSelection(['A', 'C', 'D']),
        toggle('C')
      )(state)
    })

    it('should remove item from selection', () => {
      expectExactlySameMembers(getSelection(newState), ['A', 'D'])
    })

    it('should return empty list as newly selected', () => {
      expectExactlySameMembers(getChangedSelection(newState), [])
    })

    it('should return item as newly deselected', () => {
      expectExactlySameMembers(getChangedDeselection(newState), ['C'])
    })
  })
})

