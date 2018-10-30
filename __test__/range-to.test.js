import flow from '../src/flow'
import {
  getChangedDeselection,
  getChangedSelection,
  getSelection,
  init,
  rangeTo,
  remove,
  replace,
  setItems,
  toggle,
} from '../src/operations'
import { iterable, expectExactlySameMembers } from './helper'

describe('rangeTo - range selection', () => {
  describe('from top to bottom', () => {
    let newState = null

    beforeEach(() => {
      const items = iterable(['A', 'B', 'C', 'D', 'E'])
      const state = init()

      newState = flow(
        setItems(items),
        replace('B'),
        rangeTo('D'),
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
        rangeTo('B'),
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

  it('should do nothing if given target isn\'t in the given selectable items', () => {
    const items = iterable(['A', 'B', 'C', 'D', 'E'])
    const state = init()

    const newState = flow(
      setItems(items),
      replace('D'),
      rangeTo('nonExisting'),
    )(state)

    expectExactlySameMembers(getSelection(newState), ['D'])
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
        rangeTo('F'),
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
        rangeTo('F'),
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
        rangeTo('B'),
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
          rangeTo('F'),
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
          rangeTo('D'),
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
          rangeTo('B'),
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
            rangeTo('D'),
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
            remove(['C']),
            rangeTo('D'),
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
            rangeTo('B'),
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
          rangeTo('C'),
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
          rangeTo('E'),
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
        rangeTo('B'),
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

        rangeTo('A'),
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
        rangeTo('D'),
      )(state)

      expectExactlySameMembers(getSelection(newState), ['B', 'C', 'D', 'E'])
    })
  })
})
