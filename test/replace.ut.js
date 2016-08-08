import { flow } from 'lodash/fp'
import {
  getChangedDeselection,
  getChangedSelection,
  getSelection,
  init,
  replace,
  setItems,
  setSelection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('replace - replace selection with single item', () => {
  it('should replace empty selection with single item', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      replace('B')
    )(state)

    expectExactlySameMembers(getSelection(newState), ['B'])
  })

  it('should not select item that is not part if the given selectable items', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      setSelection(['A']),
      replace('nonExisting')
    )(state)

    expectExactlySameMembers(getSelection(newState), ['A'])
  })

  describe('with existing selection', () => {
    describe('item is not selected', () => {
      let newState = null

      beforeEach(() => {
        const state = init()

        newState = flow(
          setItems(iterable(['A', 'B', 'C', 'D'])),
          setSelection(['A', 'B']),
          replace('C')
        )(state)
      })

      it('should replace existing selection', () => {
        expectExactlySameMembers(getSelection(newState), ['C'])
      })

      it('should return item as newly selected', () => {
        expectExactlySameMembers(getChangedSelection(newState), ['C'])
      })

      it('should return other items as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), ['A', 'B'])
      })
    })

    describe('item is selected', () => {
      let newState = null

      beforeEach(() => {
        const state = init()

        newState = flow(
          setItems(iterable(['A', 'B', 'C', 'D'])),
          setSelection(['A', 'B', 'C']),
          replace('C')
        )(state)
      })

      it('should replace existing selection', () => {
        expectExactlySameMembers(getSelection(newState), ['C'])
      })

      it('should return empty list as newly selected', () => {
        expectExactlySameMembers(getChangedSelection(newState), [])
      })

      it('should return other items as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), ['A', 'B'])
      })
    })
  })
})
