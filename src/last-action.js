export default function lastActionReducer(state = {}, action) {
  if (action.type.match(/yourchoice-redux/)) {
    return Object.assign({}, state, action)
  }
  return state
}

export function lastActionTypeSelector(state) {
  return state.lastAction.type
}
