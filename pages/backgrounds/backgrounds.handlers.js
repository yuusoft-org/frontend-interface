const handleOnMount = (deps) => {

  console.log('backgrounds on mount')

  setTimeout(() => {
    console.log('deps.refIds', deps.refIds)
  }, 200);
}
const handleTargetChanged = (payload, deps) => {
  console.log('received target changed', payload)
}

export default {
  handleTargetChanged,
  handleOnMount,
}
