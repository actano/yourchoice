# YourChoice

[![npm](https://img.shields.io/npm/v/yourchoice.svg)](https://www.npmjs.com/package/yourchoice)
[![code style: actano](https://img.shields.io/badge/code%20style-actano-blue.svg)](https://www.npmjs.com/package/eslint-config-actano)
[![Build Status](https://travis-ci.org/actano/yourchoice.svg?branch=master)](https://travis-ci.org/actano/yourchoice)
[![Dependency Status](https://david-dm.org/actano/yourchoice.svg)](https://david-dm.org/actano/yourchoice)
[![devDependency Status](https://david-dm.org/actano/yourchoice/dev-status.svg)](https://david-dm.org/actano/yourchoice#info=devDependencies)

YourChoice resembles the selection behavior of popular file managers. Pick items from a list using convenient functions like range selection. YourChoice covers the computation of the actual selection, no UI involved.

## Usage

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

## Item Interface

### Item.select()

Is invoked when item is added to the selection.

### Item.deselect()

Is invoked when item is removed from the selection.

## Iterable Interface

Any [javascript iterable](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface). Should be implemented by the data structure that represents the items that can be selected. This enables YourChoice to operate on any data structure. Native data types such as `Array` or `Map` implement the iterable protocol.

## YourChoice(iterable)

`iterable` – an object that implements the `Iterable` interface, representing the list of items that can be selected.

```javascript
var iterable = ['A', 'B', 'C', 'D']
var yourChoice = new YourChoice(iterable);
```

## YourChoice.selectedItems

Array of selected items.

## YourChoice.replace(item)

Replace the current selection with selection of `item`.

## YourChoice.toggle(item)

Toggle selection of `item` while keeping other item's selection untouched. Comparable to holding the `ctrl` / `cmd` key in a file manager.

## YourChoice.rangeTo(item)

Perform a range selection till `item`. Comparable to holding the shift key in a file manager.

## YourChoice.remove(items)

Remove `items` from selection.

## YourChoice.removeAll()

Remove all items from selection.

***

All these methods emit an event named "change" with the array of selected items.
