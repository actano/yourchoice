import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import boundSelection from './bound-selection'

import Page from './components/page'
import reducer from './reducer'
import items from './items'

const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__
  && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

const itemIds = items.map(item => item.id)
store.dispatch(boundSelection.actions.setItems(itemIds))

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.querySelector('#root'),
)
