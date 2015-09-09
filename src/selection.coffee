Emitter = require 'component-emitter'

assert = require './assert.coffee'
array = require './array.coffee'

class Selection extends Emitter

    constructor: (@iteratorFactory) ->
        @selectedItems = []
        @lastAnchor = null

    toggle: (item) ->
        if @_isSelected item
            @lastAnchor = null
            @_removeFromSelection item
            item.deselect()
        else
            @lastAnchor = item
            @_addToSelection item
            item.select()

        @_emitChangeEvent()

    replace: (item) ->
        unless @_isOnlySelectedItem item
            @lastAnchor = item
            for oldSelectedItem in @selectedItems
                oldSelectedItem.deselect()

            @selectedItems = [item]
            item.select()

            @_emitChangeEvent()

    remove: (items) ->
        atLeastOneItemRemoved = false

        for item in items
            if @_isSelected item
                @_removeFromSelection item
                item.deselect()
                atLeastOneItemRemoved = true

        @lastAnchor = null
        @_emitChangeEvent() if atLeastOneItemRemoved

    removeAll: ->
        @remove @selectedItems.slice()

    rangeTo: (endItem) ->
        oldSelectedItems = @selectedItems.slice()

        startItem = @_getRangeStart()
        assert startItem?, 'rangeTo: no start item'

        if @lastAnchor? or @selectedItems.length > 0
            @lastAnchor = startItem

        @_deselectItemsConnectedWith startItem

        @_performActionInRange startItem, endItem, (item) =>
            @_addToSelection item
            item.select()

        unless array.sameMembers oldSelectedItems, @selectedItems
            @_emitChangeEvent()

    _getRangeStart: ->
        if @lastAnchor?
            return @lastAnchor
        else
            if @selectedItems.length > 0
                return @_getBottommostSelectedItem()
            else
                iterator = @iteratorFactory()
                return iterator.next().value

    _emitChangeEvent: ->
        @emit 'change', @selectedItems.slice()

    _getBottommostSelectedItem: ->
        iterator = @iteratorFactory()
        previousItem = null

        loop
            {value: item, done} = iterator.next()

            if done
                return previousItem
            else if @_isSelected item
                previousItem = item

    _performActionInRange: (startItem, endItem, action) ->
        iterator = @iteratorFactory()
        assert startItem?, '_performActionInRange: no start item'
        assert endItem?, '_performActionInRange: no end item'

        if startItem is endItem
            action startItem
            return

        until (current = iterator.next()).done
            item = current.value
            break if item is startItem or item is endItem

        action item

        bottomOfRangeFound = false

        loop
            {value: item, done} = iterator.next()
            break if done

            action item

            bottomOfRangeFound = item is startItem or item is endItem
            break if bottomOfRangeFound

        assert bottomOfRangeFound, '_performActionInRange: bottom of range not found'

    _isOnlySelectedItem: (item) ->
        return @selectedItems.length is 1 and @_isSelected(item)

    _isSelected: (item) ->
        return @selectedItems.indexOf(item) isnt -1

    _addToSelection: (item) ->
        unless @_isSelected item
            @selectedItems.push item

    _removeFromSelection: (item) ->
        if @_isSelected item
            index = @selectedItems.indexOf item
            @selectedItems.splice index, 1

    _deselectItemsConnectedWith: (targetItem) ->
        iterator = @iteratorFactory()
        range = []
        isRangeWithTargetItem = false

        loop
            {value: item, done} = iterator.next()
            break if done

            if @_isSelected item
                range.push item

                if item is targetItem
                    isRangeWithTargetItem = true
            else
                if isRangeWithTargetItem
                    break
                else
                    range = []

        for item in range
            @_removeFromSelection item
            item.deselect()

module.exports = {
    Selection
}
