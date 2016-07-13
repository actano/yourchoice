/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { Selection } from '../src/selection'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const expect = chai.expect
chai.use(sinonChai)

describe('selection', () => {
  class Item {
    constructor(_index = 0) {
      this._index = _index
      this._selected = false
    }

    select() {
      this._selected = true
    }

    deselect() {
      this._selected = false
    }
  }

  function arrayIterator(array) {
    let index = 0
    return {
      next() {
        const value = index < array.length ? array[index] : undefined
        index++
        return ({
          value,
          done: !(value != null),
        })
      },
    }
  }

  it('should have no selected items initially', () => {
    const selection = new Selection(arrayIterator([]))
    expectExactlySameMembers(selection.selectedItems, [])
  })

  describe('replace selection with single item', () => {
    it('should replace empty selection with single item', () => {
      const item = new Item()
      const selection = new Selection(() => arrayIterator([item]))

      selection.replace(item)

      expectExactlySameMembers(selection.selectedItems, [item])
    })

    describe('with existing selection', () => {
      let itemList = null
      let item = null
      let selection = null

      beforeEach(() => {
        itemList = createItemList(5)
        item = new Item()
        selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          const otherItem = itemList[i]
          selection.toggle(otherItem)
        }
      })

      describe('item is not selected', () => {
        it('should replace existing selection', () => {
          selection.replace(item)

          expectExactlySameMembers(selection.selectedItems, [item])
        })

        it('should mark item as selected', () => {
          selection.replace(item)

          expect(item._selected).to.be.true
        })

        it('should mark other items as deselected', () => {
          selection.replace(item)

          for (let i = 0; i < itemList.length; i++) {
            const otherItem = itemList[i]
            expect(otherItem._selected).to.be.false
          }
        })

        it('should emit change event', (done) => {
          selection.on('change', (selectedItems) => {
            expectExactlySameMembers(selectedItems, [item])
            done()
          })

          selection.replace(item)
        })
      })

      describe('item is selected', () => {
        it('should replace existing selection', () => {
          selection.replace(itemList[2])

          expectExactlySameMembers(selection.selectedItems, [itemList[2]])
        })

        it('should mark item as selected', () => {
          selection.replace(itemList[2])

          expect(itemList[2]._selected).to.be.true
        })

        it('should mark other items as deselected', () => {
          selection.replace(item)

          for (let i = 0; i < itemList.length; i++) {
            const otherItem = itemList[i]
            if (i !== 2) {
              expect(otherItem._selected).to.be.false
            }
          }
        })
      })
    })

    it('should not emit change event when only this item was selected', () => {
      const item = new Item()
      const selection = new Selection(() => arrayIterator([item]))
      selection.replace(item)
      const changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.replace(item)

      expect(changeListener).to.not.have.been.called
    })
  })

  describe('toggle single selection', () => {
    describe('item is not selected', () => {
      it('should add single item to empty selection', () => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        expectExactlySameMembers(selection.selectedItems, [item])
      })

      it('should mark item as selected', () => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        expect(item._selected).to.be.true
      })

      it('should add single item to existing selection', () => {
        const itemList = createItemList(5)
        const selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          const item = itemList[i]
          selection.toggle(item)
        }

        expectExactlySameMembers(selection.selectedItems, itemList)
      })

      it('should emit change event with selected items', (done) => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.on('change', (selectedItems) => {
          expectExactlySameMembers(selectedItems, [item])
          done()
        })

        selection.toggle(item)
      })
    })

    describe('item is already selected', () => {
      it('should remove single item from selection', () => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)
        selection.toggle(item)

        expectExactlySameMembers(selection.selectedItems, [])
      })

      it('should mark item as deselected', () => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)
        selection.toggle(item)

        expect(item._selected).to.be.false
      })

      it('should remove single item from existing selection', () => {
        const itemList = createItemList(5)
        const selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          const item = itemList[i]
          selection.toggle(item)
        }

        selection.toggle(itemList[2])

        expectExactlySameMembers(selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[3],
          itemList[4],
        ])
      })

      it('should emit change event', (done) => {
        const item = new Item()
        const selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        selection.on('change', (selectedItems) => {
          expectExactlySameMembers(selectedItems, [])
          done()
        })

        selection.toggle(item)
      })

      it('should emit copy of selected items on change event', () => {
        const itemList = createItemList(3)
        const selection = new Selection(() => arrayIterator(itemList))

        const changeEventParameters = []
        selection.on('change', (selectedItems) => changeEventParameters.push(selectedItems))

        selection.toggle(itemList[0])
        selection.toggle(itemList[1])

        expect(changeEventParameters).to.have.length(2)
        const [firstSelectedItems, secondSelectedItems] = changeEventParameters
        expectExactlySameMembers(firstSelectedItems, [itemList[0]])
        expectExactlySameMembers(secondSelectedItems, [itemList[0], itemList[1]])
      })
    })
  })

  describe('remove/removeAll', () => {
    let itemList = null
    let selection = null

    beforeEach(() => {
      itemList = createItemList(5)
      selection = new Selection(() => arrayIterator(itemList))
    })

    it('should deselect a list of items', () => {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.remove([itemList[1], itemList[2]])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[4],
      ])
    })

    it('should deselect all items', () => {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.removeAll()

      expectItemsSelected(itemList, selection.selectedItems, [])
    })

    it('should keep already deselected items', () => {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])

      selection.remove([itemList[1], itemList[2]])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
      ])
    })

    it('should emit change event', (done) => {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.on('change', (selectedItems) => {
        expectExactlySameMembers(selectedItems, [
          itemList[0],
          itemList[4],
        ])
        done()
      })

      selection.remove([itemList[1], itemList[2]])
    })

    it('should not emit change event when selection does not change', () => {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[3])

      const changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.remove([itemList[4], itemList[2]])

      expect(changeListener).to.not.have.been.called
    })
  })

  describe('range selection', () => {
    let itemList = null
    let selection = null

    beforeEach(() => {
      itemList = createItemList(5)
      selection = new Selection(() => arrayIterator(itemList))
    })

    describe('from top to bottom', () => {
      it('should select a range of items', () => {
        selection.replace(itemList[1])
        const endItem = itemList[3]

        selection.rangeTo(endItem)

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[1],
          itemList[2],
          itemList[3],
        ])
      })
    })

    describe('from bottom to top', () => it('should select a range of items', () => {
      selection.replace(itemList[3])
      const endItem = itemList[1]

      selection.rangeTo(endItem)

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[1],
        itemList[2],
        itemList[3],
      ])
    })
    )

    it('should emit a change event with current selection', (done) => {
      selection.replace(itemList[1])
      const endItem = itemList[3]

      selection.on('change', (selectedItems) => {
        expectExactlySameMembers(selectedItems, [
          itemList[1],
          itemList[2],
          itemList[3],
        ])
        done()
      })

      selection.rangeTo(endItem)
    })

    it("should not emit a change event if selection doesn't change", () => {
      selection.replace(itemList[1])
      selection.rangeTo(itemList[3])

      const changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.rangeTo(itemList[3])

      expect(changeListener).to.not.have.been.called
    })

    it('should keep selection status of items which are outside of range', () => {
      selection.toggle(itemList[4])
      selection.toggle(itemList[0])

      selection.rangeTo(itemList[2])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[1],
        itemList[2],
        itemList[4],
      ])
    })

    it('should keep selection status of items which are inside of range', () => {
      selection.toggle(itemList[2])
      selection.toggle(itemList[0])

      selection.rangeTo(itemList[3])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[1],
        itemList[2],
        itemList[3],
      ])
    })

    it('should keep selection when range selecting current anchor', () => {
      selection.toggle(itemList[2])

      selection.rangeTo(itemList[2])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[2],
      ])
    })

    describe('change current range when selecting new range', () => {
      it('should extend range', () => {
        selection.toggle(itemList[0])

        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2],
          itemList[3],
        ])
      })

      it('should shorten range', () => {
        selection.toggle(itemList[0])

        selection.rangeTo(itemList[3])
        selection.rangeTo(itemList[2])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2],
        ])
      })

      it('should replace with range in different direction', () => {
        selection.toggle(itemList[2])

        selection.rangeTo(itemList[4])
        selection.rangeTo(itemList[0])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2],
        ])
      })
    })

    describe('range select after deselection happened', () => {
      describe('when deselecting with toggle', () => {
        it('should use bottommost selected item as start of range', () => {
          selection.toggle(itemList[4])
          selection.toggle(itemList[0])
          selection.toggle(itemList[2])
          selection.toggle(itemList[2])

          selection.rangeTo(itemList[3])

          expectItemsSelected(itemList, selection.selectedItems, [
            itemList[0],
            itemList[3],
            itemList[4],
          ])
        })
      })

      describe('when deselecting with remove', () => {
        it('should use bottommost selected item as start of range', () => {
          selection.toggle(itemList[4])
          selection.toggle(itemList[0])
          selection.toggle(itemList[2])
          selection.remove([itemList[2]])

          selection.rangeTo(itemList[3])

          expectItemsSelected(itemList, selection.selectedItems, [
            itemList[0],
            itemList[3],
            itemList[4],
          ])
        })
      })

      it('should use previous end item as the start for the next range', () => {
        selection.toggle(itemList[4])
        selection.toggle(itemList[2])
        selection.toggle(itemList[4])

        selection.rangeTo(itemList[3])
        selection.rangeTo(itemList[1])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[1],
          itemList[2],
        ])
      })
    })

    describe('range select without selected item', () => {
      it('should use first item as start of range', () => {
        selection.rangeTo(itemList[2])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2],
        ])
      })

      it('should use previous end item as the start for the next range', () => {
        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[4])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[2],
          itemList[3],
          itemList[4],
        ])
      })
    })

    describe('selection of multiple ranges', () => {
      it('should keep previous range selection of items which are outside of range', () => {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[0])
        selection.rangeTo(itemList[1])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[3],
          itemList[4],
        ])
      })

      it('should merge ranges if they are adjacent', () => {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[1])
        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[0])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
        ])
      })

      // Deviant from MacOS X Finder
      it('should keep previous range selection of items if ranges intersect', () => {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[1])
        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[1],
          itemList[2],
          itemList[3],
          itemList[4],
        ])
      })
    })
  })

  function createItemList(amount) {
    const items = []
    for (let i = 0; i < amount; i++) {
      items.push(new Item(i))
    }
    return items
  }

  function expectItemsSelected(itemList, actualItems, expectedItems) {
    expectExactlySameMembers(actualItems, expectedItems)

    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      if (__in__(item, expectedItems)) {
        expect(item._selected, `item ${item._index} should be selected`).to.be.true
      } else {
        expect(item._selected, `item ${item._index} should be deselected`).to.be.false
      }
    }
  }

  function expectExactlySameMembers(actual, expected) {
    expect(actual).to.have.members(expected)
    expect(actual).to.have.length(expected.length)
  }
})

function __in__(needle, haystack) {
  return haystack.indexOf(needle) >= 0
}
