import _ from 'lodash';

let sameMembers = function(array1, array2) {
    if (array1.length !== array2.length) { return false; }
    return _.union(array1, array2).length === array2.length;
};

export { sameMembers };
