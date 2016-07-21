/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { flow } from 'lodash/fp'
import { expect } from 'chai'
import {
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
} from '../src/operations'

function iterable(array) {
  return {
    [Symbol.iterator]: array[Symbol.iterator].bind(array),
  }
}

describe('operations', () => {
  it('should have no selected items by default', () => {
    const state = init()

    expectExactlySameMembers(getSelection(state), [])
  })

  describe('manually setting the selection', () => {
    it('should select given items', () => {
      const state = init()

      const newState = flow(
        setItems(iterable(['A', 'B', 'C', 'D'])),
        setSelection(['B', 'C'])
      )(state)

      expectExactlySameMembers(getSelection(newState), ['B', 'C'])
    })

    it('should not select items that are not part if the given selectable items', () => {
      const state = init()

      const newState = flow(
        setItems(iterable(['A', 'B', 'C', 'D'])),
        setSelection(['A', 'notExisting', 'C'])
      )(state)

      expectExactlySameMembers(getSelection(newState), ['A', 'C'])
    })
  })

  describe('updating the list of selectable items', () => {
    it('should remove items from selection don\'t exist anymore', () => {
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

  describe('replace selection with single item', () => {
    it('should replace empty selection with single item', () => {
      const state = init()

      const newState = flow(
        setItems(iterable(['A', 'B', 'C', 'D'])),
        replace('B')
      )(state)

      expectExactlySameMembers(getSelection(newState), ['B'])
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

  describe('toggle single selection', () => {
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

  describe('remove items from selection', () => {
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

  describe('remove all items from selection', () => {
    let newState = null

    beforeEach(() => {
      const items = iterable(['A', 'B', 'C', 'D'])
      const state = init()

      newState = flow(
        setItems(items),
        setSelection(['A', 'C']),
        removeAll()
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

  describe('range selection', () => {
    describe('from top to bottom', () => {
      let newState = null

      beforeEach(() => {
        const items = iterable(['A', 'B', 'C', 'D', 'E'])
        const state = init()

        newState = flow(
          setItems(items),
          replace('B'),
          rangeTo('D')
        )(state)
      })

      it('should return range of items as selection', () => {
        expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D'])
      })

      it('should return newly selected items', () => {
        expectExactlySameMembers(getChangedSelection(newState), ['C', 'D'])
      })

      it('should return empty list as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), [])
      })
    })

    describe('from bottom to top', () => {
      let newState = null

      beforeEach(() => {
        const items = iterable(['A', 'B', 'C', 'D', 'E'])
        const state = init()

        newState = flow(
          setItems(items),
          replace('D'),
          rangeTo('B')
        )(state)
      })

      it('should return range of items as selection', () => {
        expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D'])
      })

      it('should return newly selected items', () => {
        expectExactlySameMembers(getChangedSelection(newState), ['B', 'C'])
      })

      it('should return empty list as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), [])
      })
    })

    describe('with already selected items in the range', () => {
      let newState = null

      beforeEach(() => {
        const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
        const state = init()

        newState = flow(
          setItems(items),
          toggle('D'),
          toggle('B'),
          rangeTo('F')
        )(state)
      })

      it('should return range of items as selection', () => {
        expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D', 'E', 'F'])
      })

      it('should return newly selected items, omitting already selected ones', () => {
        expectExactlySameMembers(getChangedSelection(newState), ['C', 'E', 'F'])
      })

      it('should return empty list as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), [])
      })
    })

    describe('with already selected items outside of range', () => {
      let newState = null

      beforeEach(() => {
        const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
        const state = init()

        newState = flow(
          setItems(items),
          toggle('B'),
          toggle('D'),
          rangeTo('F')
        )(state)
      })

      it('should return range of items as selection', () => {
        expectExactlySameMembers(getSelection(newState), ['B', 'D', 'E', 'F'])
      })

      it('should return newly selected items, omitting already selected ones', () => {
        expectExactlySameMembers(getChangedSelection(newState), ['E', 'F'])
      })

      it('should return empty list as newly deselected', () => {
        expectExactlySameMembers(getChangedDeselection(newState), [])
      })
    })

    describe('when selecting current anchor', () => {
      let newState = null

      beforeEach(() => {
        const items = iterable(['A', 'B', 'C', 'D'])
        const state = init()

        newState = flow(
          setItems(items),
          toggle('D'),
          toggle('B'),
          rangeTo('B')
        )(state)
      })

      it('should keep selection', () => {
        expectExactlySameMembers(getSelection(newState), ['B', 'D'])
      })

      it('should return empty list as newly selected items', () => {
        expectExactlySameMembers(getChangedSelection(newState), [])
      })

      it('should return empty list as newly deselected items', () => {
        expectExactlySameMembers(getChangedDeselection(newState), [])
      })
    })

    describe('change current range when selecting new range', () => {
      describe('when extending range', () => {
        let newState = null

        beforeEach(() => {
          const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
          const state = init()

          newState = flow(
            setItems(items),
            toggle('B'),
            rangeTo('D'),
            rangeTo('F')
          )(state)
        })

        it('should return extended selection', () => {
          expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D', 'E', 'F'])
        })

        it('should return newly selected items', () => {
          expectExactlySameMembers(getChangedSelection(newState), ['E', 'F'])
        })

        it('should return empty list as newly deselected items', () => {
          expectExactlySameMembers(getChangedDeselection(newState), [])
        })
      })

      describe('when shortening range', () => {
        let newState = null

        beforeEach(() => {
          const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
          const state = init()

          newState = flow(
            setItems(items),
            toggle('B'),
            rangeTo('F'),
            rangeTo('D')
          )(state)
        })

        it('should return shortened selection', () => {
          expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D'])
        })

        it('should return empyt list as newly selected items', () => {
          expectExactlySameMembers(getChangedSelection(newState), [])
        })

        it('should return list of deselected items', () => {
          expectExactlySameMembers(getChangedDeselection(newState), ['E', 'F'])
        })
      })

      describe('when replacing with range into different direction', () => {
        let newState = null

        beforeEach(() => {
          const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
          const state = init()

          newState = flow(
            setItems(items),
            toggle('D'),
            rangeTo('F'),
            rangeTo('B')
          )(state)
        })

        it('should return range into opposite direction', () => {
          expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D'])
        })

        it('should return newly selected items', () => {
          expectExactlySameMembers(getChangedSelection(newState), ['B', 'C'])
        })

        it('should return list of deselected items', () => {
          expectExactlySameMembers(getChangedDeselection(newState), ['E', 'F'])
        })
      })

      describe('range select after deselection happened', () => {
        describe('when deselecting the anchor with toggle', () => {
          let newState = null

          beforeEach(() => {
            const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
            const state = init()

            newState = flow(
              setItems(items),
              toggle('F'),
              toggle('A'),
              toggle('C'),
              toggle('C'),
              rangeTo('D')
            )(state)
          })

          it('should return range with bottommost selected item as anchor', () => {
            expectExactlySameMembers(getSelection(newState), ['A', 'D', 'E', 'F'])
          })

          it('should return newly selected items', () => {
            expectExactlySameMembers(getChangedSelection(newState), ['D', 'E'])
          })

          it('should return list of deselected items', () => {
            expectExactlySameMembers(getChangedDeselection(newState), [])
          })
        })

        describe('when deselecting the anchor with remove', () => {
          let newState = null

          beforeEach(() => {
            const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
            const state = init()

            newState = flow(
              setItems(items),
              toggle('F'),
              toggle('A'),
              toggle('C'),
              remove('C'),
              rangeTo('D')
            )(state)
          })

          it('should return range using bottommost selected item as anchor', () => {
            expectExactlySameMembers(getSelection(newState), ['A', 'D', 'E', 'F'])
          })

          it('should return newly selected items', () => {
            expectExactlySameMembers(getChangedSelection(newState), ['D', 'E'])
          })

          it('should return list of deselected items', () => {
            expectExactlySameMembers(getChangedDeselection(newState), [])
          })
        })

        describe('when deselecting a different item than the anchor', () => {
          let newState = null

          beforeEach(() => {
            const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
            const state = init()

            newState = flow(
              setItems(items),
              toggle('E'),
              toggle('C'),
              toggle('E'),
              rangeTo('D'),
              rangeTo('B')
            )(state)
          })

          it('should return range using original anchor as the start for the range', () => {
            expectExactlySameMembers(getSelection(newState), ['B', 'C'])
          })

          it('should return newly selected items', () => {
            expectExactlySameMembers(getChangedSelection(newState), ['B'])
          })

          it('should return list of deselected items', () => {
            expectExactlySameMembers(getChangedDeselection(newState), ['D'])
          })
        })
      })
    })

    describe('range select without selected item', () => {
      describe('when performing single range selection', () => {
        let newState = null

        beforeEach(() => {
          const items = iterable(['A', 'B', 'C', 'D', 'E'])
          const state = init()

          newState = flow(
            setItems(items),
            rangeTo('C')
          )(state)
        })

        it('should return range using topmost item as anchor', () => {
          expectExactlySameMembers(getSelection(newState), ['A', 'B', 'C'])
        })

        it('should return newly selected items', () => {
          expectExactlySameMembers(getChangedSelection(newState), ['A', 'B', 'C'])
        })

        it('should return list of deselected items', () => {
          expectExactlySameMembers(getChangedDeselection(newState), [])
        })
      })

      describe('when performing multiple range selections', () => {
        let newState = null

        beforeEach(() => {
          const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
          const state = init()

          newState = flow(
            setItems(items),
            rangeTo('C'),
            rangeTo('E')
          )(state)
        })

        it('should return range using previous end-item as anchor', () => {
          expectExactlySameMembers(getSelection(newState), ['C', 'D', 'E'])
        })

        it('should return newly selected items', () => {
          expectExactlySameMembers(getChangedSelection(newState), ['D', 'E'])
        })

        it('should return list of deselected items', () => {
          expectExactlySameMembers(getChangedDeselection(newState), ['A', 'B'])
        })
      })
    })

    describe('selection of mulitple ranges', () => {
      it('should keep previous range selection of items which are outside of range', () => {
        const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
        const state = init()

        const newState = flow(
          setItems(items),
          toggle('E'),
          rangeTo('D'),
          toggle('A'),
          rangeTo('B')
        )(state)

        expectExactlySameMembers(getSelection(newState), ['A', 'B', 'D', 'E'])
      })

      it('should merge ranges if they are adjacent', () => {
        const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
        const state = init()

        const newState = flow(
          setItems(items),
          toggle('E'),
          rangeTo('D'),

          toggle('B'),
          rangeTo('C'),

          rangeTo('A')
        )(state)

        expectExactlySameMembers(getSelection(newState), ['A', 'B'])
      })

      // Deviant from MacOS X Finder
      it('should keep previous range selection of items if ranges intersect', () => {
        const items = iterable(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
        const state = init()

        const newState = flow(
          setItems(items),
          toggle('E'),
          rangeTo('D'),

          toggle('B'),
          rangeTo('D')
        )(state)

        expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D', 'E'])
      })
    })
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

  function expectExactlySameMembers(actual, expected) {
    expect(actual).to.have.members(expected)
    expect(actual).to.have.length(expected.length)
  }
})
