import { expect } from 'chai'

export function iterable(array) {
  return {
    [Symbol.iterator]: array[Symbol.iterator].bind(array),
  }
}

export function expectExactlySameMembers(actual, expected) {
  expect(actual).to.have.members(expected)
  expect(actual).to.have.length(expected.length)
}
