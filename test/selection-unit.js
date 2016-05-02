/* eslint-env mocha */
/* global expect */
/* global sinon */

describe('selection', function () {
  let Selection = null

  class Item {
    constructor (_index = 0) {
      this._index = _index
      this._selected = false
    }

    select () {
      this._selected = true
    }

    deselect () {
      this._selected = false
    }
  }

  let arrayIterator = function (array) {
    let index = 0
    return ({
      next () {
        let value = index < array.length ? array[index] : undefined
        index++
        return ({
          value,
          done: !(value != null)
        })
      }

    })
  }

  before('require', function () {
    Selection = require('../src/selection').Selection
  })

  it('should have no selected items initially', function () {
    let selection = new Selection(() => arrayIterator([]))
    expectExactlySameMembers(selection.selectedItems, [])
  })

  describe('replace selection with single item', function () {
    it('should replace empty selection with single item', function () {
      let item = new Item()
      let selection = new Selection(() => arrayIterator([item]))

      selection.replace(item)

      expectExactlySameMembers(selection.selectedItems, [item])
    })

    describe('with existing selection', function () {
      let itemList = null
      let item = null
      let selection = null

      beforeEach(function () {
        itemList = createItemList(5)
        item = new Item()
        selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          let otherItem = itemList[i]
          selection.toggle(otherItem)
        }
      })

      describe('item is not selected', function () {
        it('should replace existing selection', function () {
          selection.replace(item)

          expectExactlySameMembers(selection.selectedItems, [item])
        })

        it('should mark item as selected', function () {
          selection.replace(item)

          expect(item._selected).to.be.true
        })

        it('should mark other items as deselected', function () {
          selection.replace(item)

          for (let i = 0; i < itemList.length; i++) {
            let otherItem = itemList[i]
            expect(otherItem._selected).to.be.false
          }
        })

        it('should emit change event', function (done) {
          selection.on('change', function (selectedItems) {
            expectExactlySameMembers(selectedItems, [item])
            done()
          })

          selection.replace(item)
        })
      })

      describe('item is selected', function () {
        it('should replace existing selection', function () {
          selection.replace(itemList[2])

          expectExactlySameMembers(selection.selectedItems, [itemList[2]])
        })

        it('should mark item as selected', function () {
          selection.replace(itemList[2])

          expect(itemList[2]._selected).to.be.true
        })

        it('should mark other items as deselected', function () {
          selection.replace(item)

          for (let i = 0; i < itemList.length; i++) {
            let otherItem = itemList[i]
            if (i !== 2) {
              expect(otherItem._selected).to.be.false
            }
          }
        })
      })
    })

    it('should not emit change event when only this item was selected', function () {
      let item = new Item()
      let selection = new Selection(() => arrayIterator([item]))
      selection.replace(item)
      let changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.replace(item)

      expect(changeListener.callCount).to.equal(0)
    })
  })

  describe('toggle single selection', function () {
    describe('item is not selected', function () {
      it('should add single item to empty selection', function () {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        expectExactlySameMembers(selection.selectedItems, [item])
      })

      it('should mark item as selected', function () {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        expect(item._selected).to.be.true
      })

      it('should add single item to existing selection', function () {
        let itemList = createItemList(5)
        let selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          let item = itemList[i]
          selection.toggle(item)
        }

        expectExactlySameMembers(selection.selectedItems, itemList)
      })

      it('should emit change event with selected items', function (done) {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.on('change', function (selectedItems) {
          expectExactlySameMembers(selectedItems, [item])
          done()
        })

        selection.toggle(item)
      })
    })

    describe('item is already selected', function () {
      it('should remove single item from selection', function () {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)
        selection.toggle(item)

        expectExactlySameMembers(selection.selectedItems, [])
      })

      it('should mark item as deselected', function () {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)
        selection.toggle(item)

        expect(item._selected).to.be.false
      })

      it('should remove single item from existing selection', function () {
        let itemList = createItemList(5)
        let selection = new Selection(() => arrayIterator(itemList))

        for (let i = 0; i < itemList.length; i++) {
          let item = itemList[i]
          selection.toggle(item)
        }

        selection.toggle(itemList[2])

        expectExactlySameMembers(selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[3],
          itemList[4]
        ])
      })

      it('should emit change event', function (done) {
        let item = new Item()
        let selection = new Selection(() => arrayIterator([item]))

        selection.toggle(item)

        selection.on('change', function (selectedItems) {
          expectExactlySameMembers(selectedItems, [])
          done()
        })

        selection.toggle(item)
      })

      it('should emit copy of selected items on change event', function () {
        let itemList = createItemList(3)
        let selection = new Selection(() => arrayIterator(itemList))

        let changeEventParameters = []
        selection.on('change', (selectedItems) => changeEventParameters.push(selectedItems))

        selection.toggle(itemList[0])
        selection.toggle(itemList[1])

        expect(changeEventParameters).to.have.length(2)
        let [firstSelectedItems, secondSelectedItems] = changeEventParameters
        expectExactlySameMembers(firstSelectedItems, [itemList[0]])
        expectExactlySameMembers(secondSelectedItems, [itemList[0], itemList[1]])
      })
    })
  })

  describe('remove/removeAll', function () {
    let itemList = null
    let selection = null

    beforeEach(function () {
      itemList = createItemList(5)
      selection = new Selection(() => arrayIterator(itemList))
    })

    it('should deselect a list of items', function () {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.remove([itemList[1], itemList[2]])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[4]
      ])
    })

    it('should deselect all items', function () {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.removeAll()

      expectItemsSelected(itemList, selection.selectedItems, [])
    })

    it('should keep already deselected items', function () {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])

      selection.remove([itemList[1], itemList[2]])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0]
      ])
    })

    it('should emit change event', function (done) {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[2])
      selection.toggle(itemList[4])

      selection.on('change', function (selectedItems) {
        expectExactlySameMembers(selectedItems, [
          itemList[0],
          itemList[4]
        ])
        done()
      })

      selection.remove([itemList[1], itemList[2]])
    })

    it('should not emit change event when selection does not change', function () {
      selection.toggle(itemList[0])
      selection.toggle(itemList[1])
      selection.toggle(itemList[3])

      let changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.remove([itemList[4], itemList[2]])

      expect(changeListener.callCount).to.equal(0)
    })
  })

  describe('range selection', function () {
    let itemList = null
    let selection = null

    beforeEach(function () {
      itemList = createItemList(5)
      selection = new Selection(() => arrayIterator(itemList))
    })

    describe('from top to bottom', () => it('should select a range of items', function () {
      selection.replace(itemList[1])
      let endItem = itemList[3]

      selection.rangeTo(endItem)

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[1],
        itemList[2],
        itemList[3]
      ])
    })
    )

    describe('from bottom to top', () => it('should select a range of items', function () {
      selection.replace(itemList[3])
      let endItem = itemList[1]

      selection.rangeTo(endItem)

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[1],
        itemList[2],
        itemList[3]
      ])
    })
    )

    it('should emit a change event with current selection', function (done) {
      selection.replace(itemList[1])
      let endItem = itemList[3]

      selection.on('change', function (selectedItems) {
        expectExactlySameMembers(selectedItems, [
          itemList[1],
          itemList[2],
          itemList[3]
        ])
        done()
      })

      selection.rangeTo(endItem)
    })

    it("should not emit a change event if selection doesn't change", function () {
      selection.replace(itemList[1])
      selection.rangeTo(itemList[3])

      let changeListener = sinon.stub()
      selection.on('change', changeListener)

      selection.rangeTo(itemList[3])

      expect(changeListener.callCount).to.equal(0)
    })

    it('should keep selection status of items which are outside of range', function () {
      selection.toggle(itemList[4])
      selection.toggle(itemList[0])

      selection.rangeTo(itemList[2])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[1],
        itemList[2],
        itemList[4]
      ])
    })

    it('should keep selection status of items which are inside of range', function () {
      selection.toggle(itemList[2])
      selection.toggle(itemList[0])

      selection.rangeTo(itemList[3])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[0],
        itemList[1],
        itemList[2],
        itemList[3]
      ])
    })

    it('should keep selection when range selecting current anchor', function () {
      selection.toggle(itemList[2])

      selection.rangeTo(itemList[2])

      expectItemsSelected(itemList, selection.selectedItems, [
        itemList[2]
      ])
    })

    describe('change current range when selecting new range', function () {
      it('should extend range', function () {
        selection.toggle(itemList[0])

        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2],
          itemList[3]
        ])
      })

      it('should shorten range', function () {
        selection.toggle(itemList[0])

        selection.rangeTo(itemList[3])
        selection.rangeTo(itemList[2])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2]
        ])
      })

      it('should replace with range in different direction', function () {
        selection.toggle(itemList[2])

        selection.rangeTo(itemList[4])
        selection.rangeTo(itemList[0])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2]
        ])
      })
    })

    describe('range select after deselection happened', function () {
      describe('when deselecting with toggle', () => it('should use bottommost selected item as start of range', function () {
        selection.toggle(itemList[4])
        selection.toggle(itemList[0])
        selection.toggle(itemList[2])
        selection.toggle(itemList[2])

        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[3],
          itemList[4]
        ])
      })
      )

      describe('when deselecting with remove', () => it('should use bottommost selected item as start of range', function () {
        selection.toggle(itemList[4])
        selection.toggle(itemList[0])
        selection.toggle(itemList[2])
        selection.remove([itemList[2]])

        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[3],
          itemList[4]
        ])
      })
      )

      it('should use previous end item as the start for the next range', function () {
        selection.toggle(itemList[4])
        selection.toggle(itemList[2])
        selection.toggle(itemList[4])

        selection.rangeTo(itemList[3])
        selection.rangeTo(itemList[1])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[1],
          itemList[2]
        ])
      })
    })

    describe('range select without selected item', function () {
      it('should use first item as start of range', function () {
        selection.rangeTo(itemList[2])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[2]
        ])
      })

      it('should use previous end item as the start for the next range', function () {
        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[4])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[2],
          itemList[3],
          itemList[4]
        ])
      })
    })

    describe('selection of multiple ranges', function () {
      it('should keep previous range selection of items which are outside of range', function () {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[0])
        selection.rangeTo(itemList[1])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1],
          itemList[3],
          itemList[4]
        ])
      })

      it('should merge ranges if they are adjacent', function () {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[1])
        selection.rangeTo(itemList[2])
        selection.rangeTo(itemList[0])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[0],
          itemList[1]
        ])
      })

      // Deviant from MacOS X Finder
      it('should keep previous range selection of items if ranges intersect', function () {
        selection.toggle(itemList[4])
        selection.rangeTo(itemList[3])

        selection.toggle(itemList[1])
        selection.rangeTo(itemList[3])

        expectItemsSelected(itemList, selection.selectedItems, [
          itemList[1],
          itemList[2],
          itemList[3],
          itemList[4]
        ])
      })
    })
  })

  function createItemList (amount) {
    let items = []
    let iterable = __range__(0, amount, false)
    for (let j = 0; j < iterable.length; j++) {
      let i = iterable[j]
      items.push(new Item(i))
    }
    return items
  }

  function expectItemsSelected (itemList, actualItems, expectedItems) {
    expectExactlySameMembers(actualItems, expectedItems)

    for (let i = 0; i < itemList.length; i++) {
      let item = itemList[i]
      if (__in__(item, expectedItems)) {
        expect(item._selected, `item ${item._index} should be selected`).to.be.true
      } else {
        expect(item._selected, `item ${item._index} should be deselected`).to.be.false
      }
    }
  }

  function expectExactlySameMembers (actual, expected) {
    expect(actual).to.have.members(expected)
    expect(actual).to.have.length(expected.length)
  }
})

function __range__ (left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}
function __in__ (needle, haystack) {
  return haystack.indexOf(needle) >= 0
}
