export const getItemIdOrder = state =>
  state.items.order

export const resolveNameById = (state, props) =>
  state.items.entities[props.id].name
