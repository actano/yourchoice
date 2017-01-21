import uuid from '../uuid'

export default function addItem(name) {
  return {
    type: 'ADD_ITEM',
    payload: {
      id: uuid(),
      name,
    },
  }
}
