import Emitter from 'component-emitter'

import assert from './assert'
import { sameMembers } from './array'

class Selection extends Emitter {

  constructor(iterable) {
    super()
    this.iterable = iterable
    this.selectedItems = []
    this.lastAnchor = null
  }

  toggle(item) {
    if (this._isSelected(item)) {
      this.lastAnchor = null
      this._removeFromSelection(item)
      item.deselect()
    } else {
      this.lastAnchor = item
      this._addToSelection(item)
      item.select()
    }

    this._emitChangeEvent()
  }

  replace(item) {
    if (!this._isOnlySelectedItem(item)) {
      this.lastAnchor = item
      for (let i = 0; i < this.selectedItems.length; i++) {
        const oldSelectedItem = this.selectedItems[i]
        oldSelectedItem.deselect()
      }

      this.selectedItems = [item]
      item.select()

      this._emitChangeEvent()
    }
  }

  remove(items) {
    let atLeastOneItemRemoved = false

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (this._isSelected(item)) {
        this._removeFromSelection(item)
        item.deselect()
        atLeastOneItemRemoved = true
      }
    }

    this.lastAnchor = null
    if (atLeastOneItemRemoved) {
      this._emitChangeEvent()
    }
  }

  removeAll() {
    return this.remove(this.selectedItems.slice())
  }

  rangeTo(endItem) {
    const oldSelectedItems = this.selectedItems.slice()

    const startItem = this._getRangeStart()
    assert((startItem != null), 'rangeTo: no start item')

    if ((this.lastAnchor != null) || this.selectedItems.length > 0) {
      this.lastAnchor = startItem
    }

    this._deselectItemsConnectedWith(startItem)

    const { from, to } = this._orderStartAndEndItems(startItem, endItem)
    this._performActionInRange(from, to, (item) => {
      this._addToSelection(item)
      item.select()
    })

    if (!sameMembers(oldSelectedItems, this.selectedItems)) {
      this._emitChangeEvent()
    }
  }

  _getRangeStart() {
    if (this.lastAnchor != null) {
      return this.lastAnchor
    }
    if (this.selectedItems.length > 0) {
      return this._getBottommostSelectedItem()
    }
    const iterator = this.iterable[Symbol.iterator]()
    return iterator.next().value
  }

  _orderStartAndEndItems(startItem, endItem) {
    const array = Array.from(this.iterable)
    const startItemIndex = array.indexOf(startItem)
    const endItemIndex = array.indexOf(endItem)
    if (startItemIndex > endItemIndex) {
      return {
        from: endItem,
        to: startItem,
      }
    }
    return {
      from: startItem,
      to: endItem,
    }
  }

  _emitChangeEvent() {
    return this.emit('change', this.selectedItems.slice())
  }

  _getBottommostSelectedItem() {
    let previousItem = null

    for (const item of this.iterable) {
      if (this._isSelected(item)) {
        previousItem = item
      }
    }
    return previousItem
  }

  _performActionInRange(startItem, endItem, action) {
    assert((startItem != null), '_performActionInRange: no start item')
    assert((endItem != null), '_performActionInRange: no end item')

    let performAction = false
    for (const item of this.iterable) {
      if (item === startItem) {
        performAction = true
      }
      if (performAction) {
        action(item)
      }
      if (item === endItem) {
        performAction = false
      }
    }
  }

  _isOnlySelectedItem(item) {
    return this.selectedItems.length === 1 && this._isSelected(item)
  }

  _isSelected(item) {
    return this.selectedItems.indexOf(item) !== -1
  }

  _addToSelection(item) {
    if (!this._isSelected(item)) {
      this.selectedItems.push(item)
    }
  }

  _removeFromSelection(item) {
    if (this._isSelected(item)) {
      const index = this.selectedItems.indexOf(item)
      this.selectedItems.splice(index, 1)
    }
  }

  _deselectItemsConnectedWith(targetItem) {
    let range = []
    let isRangeWithTargetItem = false

    for (const item of this.iterable) {
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

    for (const item of range) {
      this._removeFromSelection(item)
      item.deselect()
    }
  }
}

export { Selection }
