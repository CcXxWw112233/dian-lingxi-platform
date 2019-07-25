import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from '../WorkbenchBoxContentModal/BoardCommunication/index'
import { getLocationUrlQueryString } from '@/utils/util'


const getEffectOrReducerByName = name => `technological/${name}`

class WorkbenchPage extends Component {

    constructor(props) {
        super(props);
        let boxid = getLocationUrlQueryString("box");
        this.state = {
            currentSelectedWorkbenchBoxId: boxid || 0
        }
    }

    componentWillMount() {
        const { dispatch, myWorkbenchBoxList} = this.props;
        const { currentSelectedWorkbenchBoxId = 0 } = this.state;

        if (currentSelectedWorkbenchBoxId === 0) {
            dispatch({
                type: 'simplemode/routingJump',
                payload: {
                    route: '/technological/simplemode/home'
                }
            });
        }
    }

    render() {
        const { workbenchBoxContentWapperModalStyle } = this.props;
        const { currentSelectedWorkbenchBoxId } = this.state;
        return (
            <div className={indexStyles.workbenchBoxContentModalContainer}>
                <MiniBoxNavigations currentSelectedWorkbenchBoxId={currentSelectedWorkbenchBoxId} />
                <div className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                    <div className={indexStyles.workbenchBoxContentWapper}>
                        <BoardCommunication />
                    </div>
                </div>
            </div>
        )
    }
};

export default connect(({ simplemode: {
    workbenchBoxContentWapperModalStyle,
    myWorkbenchBoxList
} }) => ({
    workbenchBoxContentWapperModalStyle,
    myWorkbenchBoxList
}))(WorkbenchPage)