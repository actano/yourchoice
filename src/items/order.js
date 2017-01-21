export default function orderReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return state.concat([action.payload.id])
    default:
      return state
  }
}
