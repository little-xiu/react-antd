const initState = {
  resumeCount: 0,
};
export default function Resume(state = initState, action) {
  const { type } = action;
  switch (type) {
    case 'set-info': {
      return { ...state, ...action.data };
    }
    default:
      return state;
  }
}