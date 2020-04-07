import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from './BoardCommunication/index'
import BoardFiles from './BoardFiles/index'
import BoardPlan from './BoardPlan/index'
import InvestmentMaps from './InvestmentMaps/index'
import XczNews from './XczNews/index'
import Zhichengshe from './Zhichengshe/index'
// import LingxiIm, { Im } from 'lingxi-im'
import { isPaymentOrgUser } from "@/utils/businessFunction"
const { LingxiIm } = global.constants
class WorkbenchPage extends Component {
    constructor(props) {
        // console.log("WorkbenchPage组件初始化");
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
        const { dispatch, currentSelectedWorkbenchBox = {} } = this.props;
        if (!currentSelectedWorkbenchBox.id) {
            // dispatch({
            //     type: 'simplemode/routingJump',
            //     payload: {
            //         route: '/technological/simplemode/home'
            //     }
            // });
        }

        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                leftMainNavIconVisible: false
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                allOrgBoardTreeList: []
            }
        })
    }
    componentDidMount() {
        const { currentSelectedWorkbenchBox = {} } = this.props;
        this.setWorkbenchVisible(currentSelectedWorkbenchBox);
    }
    componentWillReceiveProps(nextProps) {
        const { currentSelectedWorkbenchBox } = this.props;
        const { currentSelectedWorkbenchBox: newCurrentSelectedWorkbenchBox = {} } = nextProps;
        if (!currentSelectedWorkbenchBox || currentSelectedWorkbenchBox.id != newCurrentSelectedWorkbenchBox.id) {
            this.setWorkbenchVisible(newCurrentSelectedWorkbenchBox);
        }

    }
    initSimpleWorkbenchboxCommData(dispatch) {
        dispatch({
            type: 'simpleWorkbenchbox/initSimpleWorkbenchboxCommData',
            payload: {}
        });
    }

    setWorkbenchVisible(currentSelectedWorkbenchBox) {
        const { dispatch, chatImVisiable } = this.props;
        if (currentSelectedWorkbenchBox.id && currentSelectedWorkbenchBox.code) {
            if (currentSelectedWorkbenchBox.code != 'board:chat') {
                const width = document.body.scrollWidth;
                let workbenchBoxContentWapperModalStyle = chatImVisiable ? { width: (width - 400) + 'px' } : { width: '100%' }
                dispatch({
                    type: 'simplemode/updateDatas',
                    payload: {
                        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
                    }
                });
            }
            this.setState({
                currentSelectedWorkbenchBox
            })

        }
    }



    render() {
        const { workbenchBoxContentWapperModalStyle, currentSelectedWorkbenchBox, simplemodeCurrentProject } = this.props;
        const { code: select_box_code } = currentSelectedWorkbenchBox
        let isPaymentUser = false;
        console.log("simplemodeCurrentProject", simplemodeCurrentProject);
        if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {

            isPaymentUser = isPaymentOrgUser(simplemodeCurrentProject.org_id);
        } else {
            isPaymentUser = isPaymentOrgUser();
        }

        return (
            <div className={indexStyles.workbenchBoxContentModalContainer}>
                <MiniBoxNavigations currentSelectedWorkbenchBox={currentSelectedWorkbenchBox} />
                <div id='container_workbenchBoxContent' className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                    <div className={indexStyles.workbenchBoxContentWapper}>

                        {
                            'board:plans' == select_box_code &&
                            <BoardPlan />
                        }


                        {
                            isPaymentUser && 'board:chat' == select_box_code &&
                            <BoardCommunication />
                        }

                        {
                            isPaymentUser && 'board:files' == select_box_code &&
                            <BoardFiles />
                        }

                        {
                            isPaymentUser && 'maps' == select_box_code &&
                            <InvestmentMaps />
                        }

                        {
                            isPaymentUser && 'regulations' == select_box_code &&
                            <XczNews {...this.props} />
                        }
                        {
                            isPaymentUser && 'cases' == select_box_code && <Zhichengshe {...this.props} />
                        }

                    </div>
                </div>
            </div>
        )
    }
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    simplemode: {
        workbenchBoxContentWapperModalStyle,
        myWorkbenchBoxList,
        currentSelectedWorkbenchBox,
        chatImVisiable,
        leftMainNavIconVisible,
        simplemodeCurrentProject
    }
}) {

    return {
        workbenchBoxContentWapperModalStyle,
        myWorkbenchBoxList,
        currentSelectedWorkbenchBox,
        chatImVisiable,
        leftMainNavIconVisible,
        simplemodeCurrentProject
    }
}
export default connect(mapStateToProps)(WorkbenchPage)

