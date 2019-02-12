const saveTableParam = (state = {}, action) => {
  const {params} = action;
  switch (action.type) {
    case 'save_table_param': {
      return {
        ...state,
        paneTableParam: params,
      };
    }
    default:
      return state;
  }
}
export default saveTableParam;