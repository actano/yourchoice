import flow from '../src/flow'
import {
  init,
  setItems,
  setSelection,
  getSelection,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'


describe('setSelection - manually setting the selection', () => {
  it('should select given items', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      setSelection(['B', 'C']),
    )(state)

    expectExactlySameMembers(getSelection(newState), ['B', 'C'])
  })

  it('should not select items that are not part if the given selectable items', () => {
    const state = init()

    const newState = flow(
      setItems(iterable(['A', 'B', 'C', 'D'])),
      setSelection(['A', 'notExisting', 'C']),
    )(state)

    expectExactlySameMembers(getSelection(newState), ['A', 'C'])
  })
})
