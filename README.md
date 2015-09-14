# YourChoice

[![Build Status](https://travis-ci.org/actano/yourchoice.svg?branch=master)](https://travis-ci.org/actano/yourchoice)
[![Dependency Status](https://david-dm.org/actano/yourchoice.svg)](https://david-dm.org/actano/yourchoice)
[![devDependency Status](https://david-dm.org/actano/yourchoice/dev-status.svg)](https://david-dm.org/actano/yourchoice#info=devDependencies)

YourChoice resembles the selection behavior of popular file managers. Pick items from a list using convenient functions like range selection. YourChoice covers the computation of the actual selection, no UI involved.

## Item Interface

### Item.select()

Is invoked when item is added to the selection.

### Item.deselect()

Is invoked when item is removed from the selection.

## Iterator Interface

Any [javascript iterator](http://www.ecma-international.org/ecma-262/6.0/#sec-iterator-interface). Should iterate over the data structure that represents the items that can be selected. This enables YourChoice to operate on any data structure. A simple array iterator could look like this:

```javascript
var arrayIterator = {
  next: function() {
    var value = index < array.length ? array[index] : undefined;
    index++;
    return {
      value: value,
      done: value == null
    };
  }
}
```

## YourChoice(iteratorFactory)

`iteratorFactory` – a function returning an iterator

```javascript
var iteratorFactory = function() {
  var iterator = {...};
  return iterator;
}
var yourChoice = new YourChoice(iteratorFactory);
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
