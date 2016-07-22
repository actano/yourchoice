# YourChoice

[![npm](https://img.shields.io/npm/v/yourchoice.svg)](https://www.npmjs.com/package/yourchoice)
[![code style: actano](https://img.shields.io/badge/code%20style-actano-blue.svg)](https://www.npmjs.com/package/eslint-config-actano)
[![Build Status](https://travis-ci.org/actano/yourchoice.svg?branch=master)](https://travis-ci.org/actano/yourchoice)
[![codecov](https://codecov.io/gh/actano/yourchoice/branch/master/graph/badge.svg)](https://codecov.io/gh/actano/yourchoice)
[![Dependency Status](https://david-dm.org/actano/yourchoice.svg)](https://david-dm.org/actano/yourchoice)
[![devDependency Status](https://david-dm.org/actano/yourchoice/dev-status.svg)](https://david-dm.org/actano/yourchoice#info=devDependencies)

YourChoice resembles the selection behavior of popular file managers. Pick items from a list using convenient functions like range selection. YourChoice covers the computation of the actual selection, no UI involved.

## Installing

### With npm

```javascript
npm install yourchoice --save
```

Since yourchoice is a frontend module, you will need a module bundler like webpack or browserify.

### Script tag

If you are the retro kind of person, you can also download [the JavaScript file](dist/yourchoice.js). You need to include [lodash](https://lodash.com/) before yourchoice.

```html
<script type="text/javascript" src="lodash.js"></script>
<script type="text/javascript" src="yourchoice.js"></script>
```

## Usage

Yourchoice provides a functional interface. It is well-suited to be used in conjunction with [lodash/flow](https://lodash.com/docs#flow) or [Redux](http://redux.js.org/). Of course, this interface can also be used in a non-functional environment. The [imperative interface](README_deprecated.md) of yourchoice is considered *deprecated*.

All functions of yourchoice take an object of type `State` as their last argument. Some of the functions also return an updated `State` object.
The `state` object is an opaque object representing the current state of yourchoice. The properties of this object are private and one should *not* depended upon them.
In order to read properties form the state yourchoice provides accessor methods such as [`getSelection()`](#getselectionstate--array).

All functions exported by yourchoice are [curried](https://en.wikipedia.org/wiki/Currying). That means that these functions can be partially applied with a subset of their arguments. This is particularly useful in conjunction with libraries like `lodash/flow`.

### Example

```javascript
const selectableItems = ['A', 'B', 'C', 'D', 'E']
const state = init()

newState = flow(
  setItems(selectableItems),
  replace('B'),
  rangeTo('D')
)(state)

console.log(getSelection(newState)) // ['B', 'C', 'D']
```

### init() : State

Returns an empty state with no selection and no items that can be selected.

### setItems(selectableItems, state) : State

Changes the current set of items that can be selected/deselected.

The `selectableItems` can be **any [javascript iterable](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface)**. 
This enables YourChoice to operate on any data structure. Native data types such as `Array` or `Map` implement the iterable protocol.

This function is usually called initially before any selection is performed. This function should be called in order to update the yourchoice state when selectable items have been added or removed. For example, if some of the currently selected items are not present in the given `selectableItems` anymore, then these items will be automatically removed from the current selection.

### replace(item, state) : State

Replaces the current selection with the given `item`. Also defines this item as the starting point for a subsequent [`rangeTo()`](#rangetoitem-state--state) selection. This is equivalent to a simple click by the user in a file manager.

### toggle(item, state) : State

Adds or removes the given `item` to/from the selection. Other currently selected items are not affected. Also defines this item as the starting point for a subsequent [`rangeTo()`](#rangetoitem-state--state) selection if it is added to the selection. This is equivalent to an alt+click by the user in a file manager.

### rangeTo(item, state) : State

Selects a range of items usally starting from the previously [toggled](#toggleitem-state--state) or [replaced](#replaceitem-state--state) item and ending at the given `item`. This is equivalent to a shift+click by the user in a file manager.

### setSelection(items, state) : State

Replaces the current selection with the given `items`.

### remove(items, state) : State

Removes the given `items` from the current selection. 

### removeAll(state) : State

Removes all items from the current selection.

### getSelection(state) : Array

Returns an array containing the currenlty selected items.

### getChangedSelection(state) : Array

Returns an array containing those items that have been added to the selection by the preceding operation. E.g. calling this after a call to [`rangeTo()`](#rangetoitem-state--state) will return all the items that have been added to the selection by this operation.

### getChangedDeselection(state) : Array

Returns an array containing those items that have been removed from the selection by the preceding operation. E.g. calling this after a call to [`rangeTo()`](#rangetoitem-state--state) will return all the items that have been removed from the selection by this operation.
