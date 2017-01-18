import React from 'react'
import { Panel } from 'react-bootstrap'
import { connect } from 'react-redux'
import { actionTypes } from 'yourchoice-redux'
import { lastActionTypeSelector } from '../last-action'

const SetItems = () => (
  <div>
    <p>
      <code>setItems</code> tells yourchoice which items are available for selection.
    </p>
    <p>
      Usually, it is called initially before any selection is performed.
      You should re-call this function whenever items get added or removed.
    </p>
  </div>
)

const RangeTo = () => (
  <div>
    <p>
      <code>rangeTo</code> performs a range selection from the current anchor to the given item.
    </p>
    <p>
      Usually, this function is bound to <kbd>shift+click</kbd>.
    </p>
  </div>
)

const Replace = () => (
  <div>
    <p>
      <code>replace</code> selects a single item. All other items get deselected.
    </p>
    <p>
      Usually, this function is bound to <kbd>click</kbd>.
    </p>
  </div>
)

const Toggle = () => (
  <div>
    <p>
      <code>toggle</code> toggles the selection state of a single item.
      All other items are unaffected.
    </p>
    <p>
      Usually, this function is bound to <kbd>(cmd/ctrl)+click</kbd>.
    </p>
  </div>
)

const MissingDescription = () => (
  <i>missing description</i>
)

const ActionDescription = (props) => {
  let Description
  switch (props.lastActionType) {
    case actionTypes.SET_ITEMS:
      Description = SetItems
      break
    case actionTypes.RANGE_TO:
      Description = RangeTo
      break
    case actionTypes.REPLACE:
      Description = Replace
      break
    case actionTypes.TOGGLE:
      Description = Toggle
      break
    default:
      Description = MissingDescription
      break
  }
  return (
    <Panel header={`Last action: ${props.lastActionType}`}>
      <Description />
    </Panel>
  )
}

ActionDescription.propTypes = {
  lastActionType: React.PropTypes.string,
}

const mapStateToProps = state => ({
  lastActionType: lastActionTypeSelector(state),
})

const ActionDescriptionContainer = connect(mapStateToProps)(ActionDescription)

export default ActionDescriptionContainer
