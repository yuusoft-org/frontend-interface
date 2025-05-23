
// const handleOnMount = (deps) => {
//   deps.store.increment()
//   deps.httpClient.get('...').then(response => {})
//   deps.setSubscriptions([])
// }

// const createSubscriptions = (deps) => {
//   const { subject } = deps;
//   return [
//     windowPop$(window, deps.handleWindowPop),
//     filter$(subject, [Actions.router.redirect, Actions.router.replace], deps._redirect),
//     filter$(subject, Actions.router.back, deps._handleBack),
//     filter$(subject, Actions.notification.notify, deps._toastNotify),
//     windowResize$(window, deps._handleWindowResize),
//   ]
// }

const handleCreateButtonClick = async (payload, deps) => {
  console.log('handleCreateButtonClick', payload);
  // deps.store.increment();
  deps.render();
}

const handleProjectsClick = (e, deps) => {
  // TODO sometimes e.target.id is undefined
  const id = e.target.id
  deps.subject.dispatch('redirect', {
    path: `/projects/${id}`,
  });
}

export default {
  // handleOnMount,
  // createSubscriptions,
  handleCreateButtonClick,
  handleProjectsClick,
}
