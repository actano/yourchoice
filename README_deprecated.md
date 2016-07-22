# YourChoice imperative interface (deprecated)

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
