const initState = {
  globalParam: '',
}
export const global = (state = initState, action) => {
  switch (action.type) {
    case 'SAVE_PAGE_PARAM':
      return {
        ...state,
        globalParam: {...action.param},
      };
    default:
      return state;
  }
}