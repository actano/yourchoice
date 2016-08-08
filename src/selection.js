import Emitter from 'component-emitter'

import {
  init,
  setItems,
  replace,
  toggle,
  remove,
  removeAll,
  rangeTo,
  getSelection,
  getChangedSelection,
  getChangedDeselection,
} from './operations'

class Selection extends Emitter {

  constructor(iterable) {
    super()
    this.iterable = iterable
    this.state = init()
    this._updateSelectedItems()
  }

  toggle(item) {
    this._setItemsAndNotify()
    this.state = toggle(item, this.state)

    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

  replace(item) {
    this._setItemsAndNotify()
    this.state = replace(item, this.state)

    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

  remove(items) {
    this._setItemsAndNotify()
    this.state = remove(items, this.state)

    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

  removeAll() {
    this._setItemsAndNotify()
    this.state = removeAll(this.state)

    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

  rangeTo(endItem) {
    this._setItemsAndNotify()
    this.state = rangeTo(endItem, this.state)

    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

  _updateSelectedItems() {
    this.selectedItems = getSelection(this.state)
  }

  _notifyChangedItems() {
    for (const item of getChangedSelection(this.state)) {
      item.select()
    }
    for (const item of getChangedDeselection(this.state)) {
      item.deselect()
    }
  }

  _emitChangeEvent() {
    const change = (getChangedSelection(this.state).length > 0) ||
      (getChangedDeselection(this.state).length > 0)

    if (change) {
      this.emit('change', this.selectedItems.slice())
    }
  }

  _setItemsAndNotify() {
    this.state = setItems(this.iterable, this.state)
    this._updateSelectedItems()
    this._notifyChangedItems()
    this._emitChangeEvent()
  }

}

export default Selection
