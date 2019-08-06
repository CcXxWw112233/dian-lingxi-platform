import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from './BoardCommunication/index'
import BoardFiles from './BoardFiles/index'




class WorkbenchPage extends Component {
    constructor(props) {
        console.log("WorkbenchPage组件初始化");
        super(props);
        this.state = {
            BoardCommunicationVisible: false,
            BoardFilesVisible: false
        }
    }
    componentWillMount() {
        const { dispatch, currentSelectedWorkbenchBox = {} } = this.props;
        if (!currentSelectedWorkbenchBox.id) {
            dispatch({
                type: 'simplemode/routingJump',
                payload: {
                    route: '/technological/simplemode/home'
                }
            });
        }
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
            if(currentSelectedWorkbenchBox.code != 'board:chat'){
                const width = document.body.scrollWidth;
                let workbenchBoxContentWapperModalStyle = chatImVisiable ? { width: (width - 372) + 'px' } : { width: '100%' }
                dispatch({
                    type: 'simplemode/updateDatas',
                    payload: {
                        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
                    }
                });
            }

            switch (currentSelectedWorkbenchBox.code) {
                case 'board:archives': {
                    this.setState({
                        BoardCommunicationVisible: false,
                        BoardFilesVisible: false
                    });
                }
                    break;
                case 'board:plans': {
                    this.setState({
                        BoardCommunicationVisible: false,
                        BoardFilesVisible: false
                    });
                }
                    break;
                case 'board:chat': {
                    this.setState({
                        BoardCommunicationVisible: true,
                        BoardFilesVisible: false
                    });
                    const width = document.body.scrollWidth;
                    let workbenchBoxContentWapperModalStyle = { width: (width - 372) + 'px' }
                    dispatch({
                        type: 'simplemode/updateDatas',
                        payload: {
                            chatImVisiable: true,
                            workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
                        }
                    });
                }
                    break;
                case 'board:files': {
                    this.setState({
                        BoardCommunicationVisible: false,
                        BoardFilesVisible: true
                    });
                }
                    break;
                default: {
                    this.setState({
                        BoardCommunicationVisible: false,
                        BoardFilesVisible: false
                    });
                }

            }
        }
    }



    render() {
        const { workbenchBoxContentWapperModalStyle } = this.props;
        const { currentSelectedWorkbenchBox } = this.props;
        return (
            <div className={indexStyles.workbenchBoxContentModalContainer}>
                <MiniBoxNavigations currentSelectedWorkbenchBox={currentSelectedWorkbenchBox} />
                <div id='container_workbenchBoxContent' className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                    <div className={indexStyles.workbenchBoxContentWapper}>

                        {
                            this.state.BoardCommunicationVisible &&
                            <BoardCommunication/>
                        }

                        {
                            this.state.BoardFilesVisible &&
                            <BoardFiles/>
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
        chatImVisiable
    }
}) {

    return {
        workbenchBoxContentWapperModalStyle,
        myWorkbenchBoxList,
        currentSelectedWorkbenchBox,
        chatImVisiable
    }
}
export default connect(mapStateToProps)(WorkbenchPage)

