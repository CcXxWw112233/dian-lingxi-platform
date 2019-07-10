export default {
    namespace: 'simplemode',
    state: {
        
    },
    effects: {

    },
    reducers: {
        updateDatas(state, action) {
            return {
                ...state,
                datas: { ...state.datas, ...action.payload },
            }
        }
    },
}