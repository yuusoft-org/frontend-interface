const handleOnMount = (deps) => {
  const { store, render, localData } = deps;
  const { steps } = localData["scene:1"].toJSON();
  store.setCurrentSteps(steps);
};

const handleEditorDataChanaged = (e, deps) => {
  console.log("editor data changed", e.detail);
};
const handleNewLine = (e, deps) => {
  const { getRefIds } = deps;

  const stepsEditorRef = getRefIds()["steps-editor"];

  const { store, render, localData } = deps;
  const stepsLocalData = localData["scene:1"];
  stepsLocalData.addStep();
  const { steps } = stepsLocalData.toJSON();

  store.setCurrentSteps(steps);

  render();

  requestAnimationFrame(() => {
    stepsEditorRef.elm.transformedHandlers.updateSelectedStep(
      steps[steps.length - 1].id
    );
  });
};

const handleMoveUp = (e, deps) => {
  const { store, localData, getRefIds } = deps;
  const previousStepId = store.selectPreviousStepId(e.detail.stepId);
  console.log("move up", e.detail.stepId);
  console.log("previousStepId", previousStepId)

  const stepsEditorRef = getRefIds()["steps-editor"];
  stepsEditorRef.elm.transformedHandlers.updateSelectedStep(
    previousStepId
  );
};

const handleMoveDown = (e, deps) => {
  const { store, localData, getRefIds } = deps;
  const nextStepId = store.selectNextStepId(e.detail.stepId);
  console.log("move down", e.detail.stepId);
  console.log("nextStepId", nextStepId)

  const stepsEditorRef = getRefIds()["steps-editor"];
  stepsEditorRef.elm.transformedHandlers.updateSelectedStep(nextStepId);
};

export default {
  handleEditorDataChanaged,
  handleOnMount,
  handleNewLine,
  handleMoveUp,
  handleMoveDown,
};
