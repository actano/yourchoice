import Emitter from 'component-emitter'

import assert from './assert'
import { sameMembers } from './array'

class Selection extends Emitter {

  constructor (iteratorFactory) {
    super()
    this.iteratorFactory = iteratorFactory
    this.selectedItems = []
    this.lastAnchor = null
  }

  toggle (item) {
    if (this._isSelected(item)) {
      this.lastAnchor = null
      this._removeFromSelection(item)
      item.deselect()
    } else {
      this.lastAnchor = item
      this._addToSelection(item)
      item.select()
    }

    return this._emitChangeEvent()
  }

  replace (item) {
    if (!this._isOnlySelectedItem(item)) {
      this.lastAnchor = item
      for (let i = 0; i < this.selectedItems.length; i++) {
        let oldSelectedItem = this.selectedItems[i]
        oldSelectedItem.deselect()
      }

      this.selectedItems = [item]
      item.select()

      return this._emitChangeEvent()
    }
  }

  remove (items) {
    let atLeastOneItemRemoved = false

    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (this._isSelected(item)) {
        this._removeFromSelection(item)
        item.deselect()
        atLeastOneItemRemoved = true
      }
    }

    this.lastAnchor = null
    if (atLeastOneItemRemoved) { return this._emitChangeEvent() }
  }

  removeAll () {
    return this.remove(this.selectedItems.slice())
  }

  rangeTo (endItem) {
    let oldSelectedItems = this.selectedItems.slice()

    let startItem = this._getRangeStart()
    assert((startItem != null), 'rangeTo: no start item')

    if ((this.lastAnchor != null) || this.selectedItems.length > 0) {
      this.lastAnchor = startItem
    }

    this._deselectItemsConnectedWith(startItem)

    this._performActionInRange(startItem, endItem, (item) => {
      this._addToSelection(item)
      return item.select()
    })

    if (!sameMembers(oldSelectedItems, this.selectedItems)) {
      return this._emitChangeEvent()
    }
  }

  _getRangeStart () {
    if (this.lastAnchor != null) {
      return this.lastAnchor
    } else {
      if (this.selectedItems.length > 0) {
        return this._getBottommostSelectedItem()
      } else {
        let iterator = this.iteratorFactory()
        return iterator.next().value
      }
    }
  }

  _emitChangeEvent () {
    return this.emit('change', this.selectedItems.slice())
  }

  _getBottommostSelectedItem () {
    let iterator = this.iteratorFactory()
    let previousItem = null

    while (true) {
      let {value: item, done} = iterator.next()

      if (done) {
        return previousItem
      } else if (this._isSelected(item)) {
        previousItem = item
      }
    }
  }

  _performActionInRange (startItem, endItem, action) {
    let iterator = this.iteratorFactory()
    assert((startItem != null), '_performActionInRange: no start item')
    assert((endItem != null), '_performActionInRange: no end item')

    if (startItem === endItem) {
      action(startItem)
      return
    }

    let current
    let item
    let done
    while (!(current = iterator.next()).done) {
      item = current.value
      if (item === startItem || item === endItem) { break }
    }

    action(item)

    let bottomOfRangeFound = false

    while (true) {
      let next = iterator.next()
      item = next.value
      done = next.done
      if (done) { break }

      action(item)

      bottomOfRangeFound = item === startItem || item === endItem
      if (bottomOfRangeFound) { break }
    }

    return assert(bottomOfRangeFound, '_performActionInRange: bottom of range not found')
  }

  _isOnlySelectedItem (item) {
    return this.selectedItems.length === 1 && this._isSelected(item)
  }

  _isSelected (item) {
    return this.selectedItems.indexOf(item) !== -1
  }

  _addToSelection (item) {
    if (!this._isSelected(item)) {
      return this.selectedItems.push(item)
    }
  }

  _removeFromSelection (item) {
    if (this._isSelected(item)) {
      let index = this.selectedItems.indexOf(item)
      return this.selectedItems.splice(index, 1)
    }
  }

  _deselectItemsConnectedWith (targetItem) {
    let iterator = this.iteratorFactory()
    let range = []
    let isRangeWithTargetItem = false
    let item
    let done

    while (true) {
      let next = iterator.next()
      item = next.value
      done = next.done
      if (done) { break }

      if (this._isSelected(item)) {
        range.push(item)

        if (item === targetItem) {
          isRangeWithTargetItem = true
        }
      } else {
        if (isRangeWithTargetItem) {
          break
        } else {
          range = []
        }
      }
    }

    for (let i = 0; i < range.length; i++) {
      item = range[i]
      this._removeFromSelection(item)
      item.deselect()
    }
  }
}

export { Selection }
