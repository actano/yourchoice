export default function (...args) {
  if ((typeof console !== 'undefined' && console !== null) && (console.assert != null)) { return console.assert(...args) }
};
