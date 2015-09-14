# YourChoice

[![Build Status](https://travis-ci.org/actano/yourchoice.svg?branch=master)](https://travis-ci.org/actano/yourchoice)

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
