import { combineReducers } from 'redux'
import { reducer as yourchoiceReducer } from 'yourchoice-redux'
import lastAction from './last-action'
import items from './items/index'

const reducer = combineReducers({
  yourchoice: yourchoiceReducer,
  items,
  lastAction,
})

export default reducer
