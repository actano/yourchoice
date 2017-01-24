import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow'
import boundSelection from '../bound-selection'
import itemPropType from '../item-prop-type'

const Item = (props) => {
  const style = {
    outline: 'none',
    userSelect: 'none',
  }
  const myProps = {
    style,
    onClick: props.onClick,
    className: 'item',
  }
  if (props.isSelected) {
    myProps.bsStyle = 'info'
  }
  return (
    <ListGroupItem {...myProps}>
      <div className="item__name"> {props.item.name} </div>
      <div className="item__id"> {props.item.id} </div>
      <div className="item__info"> {props.isAnchor ? 'anchor' : '' } </div>
    </ListGroupItem>
  )
}

Item.propTypes = {
  item: itemPropType.isRequired,
  isSelected: React.PropTypes.bool,
  isAnchor: React.PropTypes.bool,
  onClick: React.PropTypes.func,
}

Item.defaultProps = {
  isSelected: false,
  isAnchor: false,
  onClick: () => {},
}

const getSelectedItems = state => boundSelection.selectors.getSelection(state.yourchoice)

// A selector for the anchor is not part of the official API and can therefore change.
// Usually, there is no need to display which item is the current anchor.
// This is only done here to show how yourchoice works internally
const getAnchor = state => (state.yourchoice.mySelection.anchor)

const isSelected = (state, props) => {
  const selection = getSelectedItems(state)
  return (selection.indexOf(props.item.id) >= 0)
}

const isAnchor = (state, props) => {
  const anchor = getAnchor(state)
  return anchor === props.item.id
}

const mapStateToProps = (state, props) => ({
  isSelected: isSelected(state, props),
  isAnchor: isAnchor(state, props),
})

const ItemContainer = flow(
  connect(mapStateToProps),
)(Item)

export default ItemContainer
