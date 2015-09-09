_ = require 'underscore'

sameMembers = (array1, array2) ->
    return false if array1.length isnt array2.length
    return _.union(array1, array2).length is array2.length

module.exports = {
    sameMembers
}
