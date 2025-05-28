
const handleActionClick = (e, deps) => {
  const { dispatchEvent, store } = deps;
  const id = e.currentTarget.id.replace('action-', '')

  const items = store.selectItems();
  const item = items.find(item => item.id === id);

  dispatchEvent(new CustomEvent('actionClicked', {
    detail: {
      item,
    }
  }))
}

export default {
  handleActionClick,
}
