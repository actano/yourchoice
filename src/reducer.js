import { combineReducers } from 'redux'
import { reducer as yourchoiceReducer } from 'yourchoice-redux'
import lastAction from './last-action'

const reducer = combineReducers({
  yourchoice: yourchoiceReducer,
  lastAction,
})

export default reducer
