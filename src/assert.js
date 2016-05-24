export default function (...args) {
/* eslint-disable no-console */
  if ((typeof console !== 'undefined' && console !== null) && (console.assert != null)) {
    return console.assert(...args)
/* eslint-enable no-console */
  }
  return null
}
