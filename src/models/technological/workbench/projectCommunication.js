
export default {

    namespace: 'projectCommunication',
  
    state: {
        count: 0
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        history.listen((location) => {
            // if (location.pathname.indexOf('/technological') != -1) {
            //   dispatch({
            //     type: 'updateDatas',
            //     payload: {
            //       list_group: [],
            //       group_rows: [3, 3, 3], // [5, 5, 5]
            //     }
            //   })
            // } else {
            // }
          })
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {  // eslint-disable-line
        yield put({ type: 'save' });
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    //   add(state, action){
    //       const newState = {
    //         ...state,
    //         count: state.count +1
    //       };
    //       console.log('state', newState);
    //       return { ...newState, ...action.payload };
    //   },
    //   minus(state, action){
    //     const newState = {
    //         ...state,
    //         count: state.count -1
    //       };
    //       console.log('state', newState);
    //       return { ...newState, ...action.payload };
    //   },
    },
  
  };