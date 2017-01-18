import React from 'react'
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import boundSelection from '../bound-selection'

const StateInspector = props =>
  (
    <Panel header="Current yourchoice state">
      <pre>{
`{
  items: [${props.items.join(', ')}],
  selected: [${props.selected.join(', ')}],
  changed: {
    selected: [${props.changedSelection.join(', ')}],
    deselected: [${props.changedDeselection.join(', ')}],
  },
  anchor: ${props.anchor},
}`
      }</pre>
    </Panel>
  )

StateInspector.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  changedSelection: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  changedDeselection: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  anchor: React.PropTypes.string,
}

StateInspector.defaultProps = {
  anchor: null,
}

const mapStateToProps = state => ({
  items: boundSelection.selectors.getItems(state.yourchoice),
  selected: boundSelection.selectors.getSelection(state.yourchoice),
  changedSelection: boundSelection.selectors.getChangedSelection(state.yourchoice),
  changedDeselection: boundSelection.selectors.getChangedDeselection(state.yourchoice),
  anchor: state.yourchoice.mySelection.anchor,
})

const StateInspectorContainer = connect(mapStateToProps)(StateInspector)

export default StateInspectorContainer
