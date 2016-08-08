import { flow } from 'lodash/fp'
import {
  getSelection,
  init,
  rangeTo,
  replace,
  setItems,
  setSelection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'


describe('setItems - updating the list of selectable items', () => {
  it('should remove items from selection that don\'t exist anymore', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      setSelection(['B', 'C']),
      setItems(iterable(['A', 'C', 'D']))
    )(state)

    expectExactlySameMembers(getSelection(newState), ['C'])
  })

  it('should remove item from anchor that doesn\'t exist anymore', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      replace('C'),
      setItems(iterable(['A', 'B', 'D'])),
      rangeTo('D')
    )(state)

    expectExactlySameMembers(getSelection(newState), ['A', 'B', 'D'])
  })
})

