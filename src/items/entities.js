export default function itemsReducer(state = {}, action) {
  let item
  switch (action.type) {
    case 'ADD_ITEM':
      item = {
        [action.payload.id]: {
          id: action.payload.id,
          name: action.payload.name,
        },
      }
      return Object.assign({}, state, item)
    default:
      return state
  }
}
