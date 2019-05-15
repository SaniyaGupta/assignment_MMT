const createAction = (type, payload) => ({ type, payload });

const createActionThunk = (type, payload) => dispatch => {
    dispatch(createAction(type, payload));
  };
  
export { createAction,createActionThunk };
