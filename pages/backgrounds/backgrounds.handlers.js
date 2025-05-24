const handleOnMount = (deps) => {

}
const handleTargetChanged = (payload, deps) => {
  console.log('received target changed', payload)
}

export default {
  handleTargetChanged,
  handleOnMount,
}
