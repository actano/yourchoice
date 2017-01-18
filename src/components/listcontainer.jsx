import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import flow from 'lodash.flow'
import boundSelection from '../bound-selection'
import ItemContainer from './item'
import itemPropType from '../item-prop-type'

const List = props =>
  (
    <ListGroup>
      {props.items.map(item =>
        <ItemContainer
          key={item.id}
          item={item}
          onClick={event => handleClick(event.nativeEvent, props, item.id)}
        />,
      )}
    </ListGroup>
  )

List.propTypes = {
  items: React.PropTypes.arrayOf(itemPropType).isRequired,
}


function handleClick(event, props, id) {
  if (event.shiftKey) {
    props.rangeTo(id)
  } else if (event.metaKey || event.ctrlKey) {
    props.toggle(id)
  } else {
    props.replace(id)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    rangeTo: boundSelection.actions.rangeTo,
    toggle: boundSelection.actions.toggle,
    replace: boundSelection.actions.replace,
  }, dispatch)

const ListContainer = flow(
  connect(undefined, mapDispatchToProps),
)(List)

export default ListContainer
