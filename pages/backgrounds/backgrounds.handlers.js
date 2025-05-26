const handleOnMount = (deps) => {


}
const handleTargetChanged = (payload, deps) => {
  deps.store.addItem({
    id: `df-${Date.now()}`,
    name: 'sdf',
    level: 1
  })
  deps.render();
}

export default {
  handleTargetChanged,
  handleOnMount,
}
