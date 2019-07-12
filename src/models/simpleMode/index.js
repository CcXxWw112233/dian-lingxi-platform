export default {
    namespace: 'simplemode',
    state: {
        simpleHeaderVisiable: true,
        myWorkbenchBoxsVisiable: true,
        wallpaperSelectVisiable: true,
        workbenchBoxSelectVisiable: false,
        createNewBoardVisiable: false,
        setWapperCenter: false,
        wallpaperSelectModalVisiable: false,
        chatImVisiable: false
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(async (location) => {
                if (location.pathname.indexOf('/technological/simplemode') !== -1) {
                    const initData = async () => {
                        await Promise.all([
                            await dispatch({
                                type: 'getProjectList',
                                payload: {}
                            }),
                            // dispatch({
                            //   type: 'getBoxUsableList',
                            //   payload: {}
                            // })
                        ])
                    }
                    initData()
                }
            });
        }
    }
    ,
    effects: {

    },
    reducers: {
        updateDatas(state, action) {
            return {
                ...state, ...action.payload
            }
        }
    },
}