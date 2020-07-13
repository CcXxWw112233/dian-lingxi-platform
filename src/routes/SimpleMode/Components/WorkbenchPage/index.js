import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from './BoardCommunication/index'
import BoardArchives from './BoardArchives/index'
import BoardPlan from './BoardPlan/index'
import InvestmentMaps from './InvestmentMaps/index'
import XczNews from './XczNews/index'
import Zhichengshe from './Zhichengshe/index'
import Workglows from './Workflows'
import StatisticalReport from './StatisticalReport'
import { isPaymentOrgUser } from "@/utils/businessFunction"
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
        window.removeEventListener('resize', this.setWorkbenchBoxContentHeight)
    }
    componentDidMount() {
        const { currentSelectedWorkbenchBox = {} } = this.props;
        this.setWorkbenchVisible(currentSelectedWorkbenchBox);
        this.setWorkbenchBoxContentHeight()
        window.addEventListener('resize', this.setWorkbenchBoxContentHeight)
    }
    componentWillReceiveProps(nextProps) {
        const { currentSelectedWorkbenchBox } = this.props;
        const { currentSelectedWorkbenchBox: newCurrentSelectedWorkbenchBox = {} } = nextProps;
        if (!currentSelectedWorkbenchBox || currentSelectedWorkbenchBox.id != newCurrentSelectedWorkbenchBox.id) {
            this.setWorkbenchVisible(newCurrentSelectedWorkbenchBox);
        }

    }
    // 保存区域高度
    setWorkbenchBoxContentHeight = () => {
        const height = document.getElementById('container_workbenchBoxContent').clientHeight
        this.setState({
            workbenchBoxContent_height: height
        })
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
        // console.log("simplemodeCurrentProject", simplemodeCurrentProject);
        if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {

            isPaymentUser = isPaymentOrgUser(simplemodeCurrentProject.org_id);
        } else {
            isPaymentUser = isPaymentOrgUser();
        }
        const { workbenchBoxContent_height } = this.state
        const special_backgroud = ['mine:flows', 'board:files']
        return (
            <div className={indexStyles.workbenchBoxContentModalContainer}>
                <MiniBoxNavigations currentSelectedWorkbenchBox={currentSelectedWorkbenchBox} />
                <div id='container_workbenchBoxContent' className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                    <div className={indexStyles.workbenchBoxContentWapper}
                        style={{ background: special_backgroud.includes(select_box_code) ? 'rgba(245, 245, 245, 1)' : '' }}>

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
                            <BoardArchives workbenchBoxContent_height={workbenchBoxContent_height} />
                        }

                        {
                            isPaymentUser && 'maps' == select_box_code &&
                            <InvestmentMaps />
                        }

                        {
                            isPaymentUser && 'cases' == select_box_code &&
                            <XczNews {...this.props} />
                        }
                        {
                            isPaymentUser && 'regulations' == select_box_code &&
                            <Zhichengshe {...this.props} />
                        }
                        {
                            isPaymentUser && 'mine:flows' == select_box_code &&
                            <Workglows workbenchBoxContent_height={workbenchBoxContent_height} />
                        }
                        <StatisticalReport />
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

