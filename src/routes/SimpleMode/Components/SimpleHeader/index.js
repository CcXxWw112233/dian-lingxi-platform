import React, { Component } from "react";
import dva, { connect } from "dva"
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import SiderLeft from '@/routes/Technological/Sider/SiderLeft'
import VideoMeeting from '@/routes/Technological/Sider/comonent/videoMeetingPopoverContent/index'
import { Tooltip, Dropdown } from 'antd'
import Cookies from "js-cookie";
import SimpleNavigation from "./Components/SimpleNavigation/index"
import SimpleDrawer from './Components/SimpleDrawer/index'
import LingxiIm, { Im } from 'lingxi-im'
import TaskDetailModal from '@/components/TaskDetailModal'
import { setBoardIdStorage, getSubfixName } from "../../../../utils/businessFunction";
import FileDetailModal from '../../../Technological/components/ProjectDetail/FileModule/FileDetail/FileDetailModal'

class SimpleHeader extends Component {
    state = {
        leftNavigationVisible: false,
        simpleDrawerVisible: false,
        simpleDrawerContent: null,
        simpleDrawerTitle: ''
    }

    openOrCloseImChatModal = (val) => {
        console.log(val)
        const { dispatch, chatImVisiable } = this.props;
        let flag = val !== undefined ? val : !chatImVisiable;
        const width = document.body.scrollWidth;
        let workbenchBoxContentWapperModalStyle = flag ? { width: (width - 400) + 'px' } : { width: '100%' }
        console.log(workbenchBoxContentWapperModalStyle)
        if (flag) {
            LingxiIm.show();
        }
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                chatImVisiable: flag,
                workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
            }
        });

    }

    handleVisibleChange = flag => {
        this.setState({ leftNavigationVisible: flag });
    };

    openOrCloseMainNav = (e) => {
        // e.stopPropagation();
        // dispatch({
        //     type: 'simplemode/updateDatas',
        //     payload: {
        //         leftMainNavVisible: !leftMainNavVisible
        //     }
        // });

        //window.open('/#/technological/workbench', '_blank');
        // console.log(checked, 'sssss')
        const { dispatch } = this.props
        dispatch({
            type: 'technological/setShowSimpleModel',
            payload: {
                is_simple_model: 0,
                checked: false
            }
        })

    }
    updateStates = (data) => {
        this.setState({
            ...data
        });
    }

    closeDrawer = () => {
        this.setState({
            simpleDrawerVisible: false,
            simpleDrawerTitle: ''
        });
    }

    // componentWillReceiveProps(props, nextProps){
    //   // if(nextProps.chatImVisiable){
    //     LingxiIm.show();
    //   // }
    // }
    componentDidMount() {
        this.imInitOption()
    }

    //圈子
    imInitOption = () => {
        const { protocol, host } = window.location
        Im.option({
            baseUrl: `${protocol}//${host}/`,
            // APPKEY: "c3abea191b7838ff65f9a6a44ff5e45f"
        })
        const clickDynamicFunc = (data) => {
            this.imClickDynamic(data);
        }
        const visibleFunc = (val) => {
            if (!val) {
                this.openOrCloseImChatModal(false)
            }
        }
        if (Im) {
            Im.on('visible', visibleFunc)
            Im.on('clickDynamic', clickDynamicFunc);
        }
    }
    // 圈子点击
    imClickDynamic = (data = {}) => {
        const { dispatch } = this.props
        const { orgId, boardId, type, relaDataId, cardId, relaDataName } = data
        // console.log('ssss', data)
        dispatch({
            type: 'projectDetail/updateDatas',
            payload: {
                board_id: boardId
            }
        })
        setBoardIdStorage(boardId)
        switch (type) {
            case 'board':
                break
            case 'folder':
                break;
            case 'file':
                dispatch({
                    type: 'projectDetail/updateDatas',
                    payload: {
                        projectDetailInfoData: { board_id: boardId }
                    }
                })
                dispatch({
                    type: 'projectDetail/getRelationsSelectionPre',
                    payload: {
                        _organization_id: orgId
                    }
                })
                dispatch({
                    type: 'projectDetailFile/getCardCommentListAll',
                    payload: {
                        id: relaDataId
                    }
                })
                dispatch({
                    type: 'projectDetailFile/updateDatas',
                    payload: {
                        isInOpenFile: true,
                        seeFileInput: 'fileModule',
                        // currentPreviewFileData: data,
                        filePreviewCurrentFileId: relaDataId,
                        // filePreviewCurrentId: file_resource_id,
                        // filePreviewCurrentVersionId: version_id,
                        pdfDownLoadSrc: '',
                        fileType: getSubfixName(relaDataName)
                    }
                })
                if (getSubfixName(relaDataName) == '.pdf') {
                    dispatch({
                        type: 'projectDetailFile/getFilePDFInfo',
                        payload: {
                            id: relaDataId
                        }
                    })
                } else {
                    dispatch({
                        type: 'projectDetailFile/filePreview',
                        payload: {
                            file_id: relaDataId
                        }
                    })
                    // 这里调用是用来获取以及更新访问控制文件弹窗详情中的数据, 一开始没有的
                    // 但是这样会影响 文件路径, 所以传递一个参数来阻止更新
                    dispatch({
                        type: 'projectDetailFile/fileInfoByUrl',
                        payload: {
                            file_id: relaDataId,
                            isNotNecessaryUpdateBread: true
                        }
                    })
                }
                break
            case 'card':
                dispatch({
                    type: 'publicTaskDetailModal/updateDatas',
                    payload: {
                        drawerVisible: true,
                        card_id: cardId
                    }
                })
                break;
            case 'flow':
                break
            default:
                break
        }
    }
    render() {
        const { chatImVisiable = false, leftMainNavVisible = false, leftMainNavIconVisible, drawerVisible, isInOpenFile, dispatch } = this.props;
        const { simpleDrawerVisible, simpleDrawerContent, leftNavigationVisible, simpleDrawerTitle } = this.state;
        return (
            <div className={indexStyles.headerWapper}>
                {
                    false && (
                        <Tooltip placement="bottom" title={'退出极简模式'}>
                            <div className={indexStyles.miniNavigation} onClick={this.openOrCloseMainNav}>
                                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe69d;</i>
                            </div>
                        </Tooltip>
                    )
                }
                {
                    leftMainNavIconVisible && (
                        <Dropdown
                            placement="bottomLeft"
                            overlay={<SimpleNavigation updateStates={this.updateStates} dropdownHandleVisibleChange={this.handleVisibleChange} />}
                            onVisibleChange={this.handleVisibleChange}
                            visible={leftNavigationVisible}
                        >
                            <div className={indexStyles.miniNavigation}>
                                <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe69f;</i>
                            </div>
                        </Dropdown>
                    )}

                <div className={indexStyles.miniImMessage} onClick={this.openOrCloseImChatModal}>
                    <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '32px' }} >&#xe6df;</i>
                </div>

                {/* {leftMainNavVisible &&
                        <SiderLeft is_simplemode={true} collapsed={false} />
                    } */}

                <div className={indexStyles.chatWapper} style={{ display: `${chatImVisiable ? '' : 'none'}` }}>
                    {/* <div className={indexStyles.chatHeader}>
                        <div className={indexStyles.menu} onClick={this.openOrCloseImChatModal}>
                            <i className={`${globalStyles.authTheme}`} style={{ color: '#1890FF', fontSize: '24px' }}>&#xe7f4;</i>
                        </div>
                    </div>
                    <div className={indexStyles.imWapper}>
                        <iframe src='/im/index.html'></iframe>
                    </div>
                    <div className={indexStyles.videoMeetingWapper}>
                        <VideoMeeting />
                    </div> */}
                    <LingxiIm token={Cookies.get('Authorization')} width='400px' />

                    <div className={indexStyles.videoMeetingWapper}>
                        <VideoMeeting />
                    </div>
                </div>

                {simpleDrawerVisible &&
                    <SimpleDrawer updateState={this.updateStates} closeDrawer={this.closeDrawer} simpleDrawerContent={simpleDrawerContent} drawerTitle={simpleDrawerTitle} />
                }
                <TaskDetailModal
                    task_detail_modal_visible={drawerVisible}
                // setTaskDetailModalVisible={this.setTaskDetailModalVisible}
                // handleTaskDetailChange={this.handleChangeCard}
                // handleDeleteCard={this.handleDeleteCard}
                />
                <FileDetailModal visible={isInOpenFile} dispatch={dispatch} />
            </div>
        );
    }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    simplemode: { chatImVisiable, leftMainNavVisible, leftMainNavIconVisible }, modal, technological, loading,
    publicTaskDetailModal: {
        drawerVisible
    },
    projectDetailFile: {
        datas: {
            isInOpenFile
        }
    },
}) {
    return { chatImVisiable, leftMainNavVisible, leftMainNavIconVisible, modal, model: technological, loading, drawerVisible, isInOpenFile }
}
export default connect(mapStateToProps)(SimpleHeader)
