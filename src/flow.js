const flowReducer = (accumulator, currentValue) => currentValue(accumulator)

export default (...fn) => param => fn.reduce(flowReducer, param)
