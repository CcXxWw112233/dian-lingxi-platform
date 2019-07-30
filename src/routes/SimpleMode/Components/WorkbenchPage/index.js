import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from './BoardCommunication/index'
import BoardFiles from './BoardFiles/index'
import { getLocationUrlQueryString } from '@/utils/util'


const getEffectOrReducerByName = name => `technological/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`
const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`
const getEffectOrReducerByName_6 = name => `workbenchPublicDatas/${name}`
class WorkbenchPage extends Component {
    constructor(props) {
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
        } else {
            this.setWorkbenchVisible(currentSelectedWorkbenchBox);
        }
    }
    componentWillReceiveProps(nextProps) {
        const { currentSelectedWorkbenchBox } = this.props;
        const { currentSelectedWorkbenchBox: newCurrentSelectedWorkbenchBox = {} } = nextProps;
        if (!currentSelectedWorkbenchBox || currentSelectedWorkbenchBox.id != newCurrentSelectedWorkbenchBox.id) {
            this.setWorkbenchVisible(newCurrentSelectedWorkbenchBox);
        }

    }

    setWorkbenchVisible(currentSelectedWorkbenchBox) {
        if (currentSelectedWorkbenchBox.id && currentSelectedWorkbenchBox.code) {
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

    getFileModuleProps() {
        const { dispatch } = this.props;
        return {
            getBoardMembers(payload) {
                dispatch({
                    type: getEffectOrReducerByName_4('getBoardMembers'),
                    payload: payload
                })
            },
            updateFileDatas(payload) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateDatas'),
                    payload: payload
                })
            },
            getFileList(params) {
                dispatch({
                    type: getEffectOrReducerByName('getFileList'),
                    payload: params
                })
            },
            fileCopy(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileCopy'),
                    payload: data
                })
            },
            fileDownload(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileDownload'),
                    payload: params
                })
            },
            fileRemove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileRemove'),
                    payload: data
                })
            },
            fileMove(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileMove'),
                    payload: data
                })
            },
            fileUpload(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileUpload'),
                    payload: data
                })
            },
            fileVersionist(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('fileVersionist'),
                    payload: params
                })
            },
            recycleBinList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('recycleBinList'),
                    payload: params
                })
            },
            deleteFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteFile'),
                    payload: data
                })
            },
            restoreFile(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('restoreFile'),
                    payload: data
                })
            },
            getFolderList(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getFolderList'),
                    payload: params
                })
            },
            addNewFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('addNewFolder'),
                    payload: data
                })
            },
            updateFolder(data) {
                dispatch({
                    type: getEffectOrReducerByName_5('updateFolder'),
                    payload: data
                })
            },
            filePreview(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('filePreview'),
                    payload: params
                })
            },
            getPreviewFileCommits(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('getPreviewFileCommits'),
                    payload: params
                })
            },
            addFileCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('addFileCommit'),
                    payload: params
                })
            },
            deleteCommit(params) {
                dispatch({
                    type: getEffectOrReducerByName_5('deleteCommit'),
                    payload: params
                })
            },
        }
    }

    updateDatasFile = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName_5('updateDatas'),
            payload: payload
        })
    }

    updateDatas = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName('updateDatas'),
            payload: payload
        })
    }
    updatePublicDatas = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: getEffectOrReducerByName_6('updateDatas'),
            payload: payload
        })
    }


    render() {
        const { workbenchBoxContentWapperModalStyle } = this.props;
        const { currentSelectedWorkbenchBox } = this.props;
        console.log("workbenchBoxContentWapperModalStyle", workbenchBoxContentWapperModalStyle);
        return (
            <div className={indexStyles.workbenchBoxContentModalContainer}>
                <MiniBoxNavigations currentSelectedWorkbenchBox={currentSelectedWorkbenchBox} />
                <div id='container_workbenchBoxContent' className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                    <div className={indexStyles.workbenchBoxContentWapper}>

                        {
                            this.state.BoardCommunicationVisible &&
                            <BoardCommunication updateDatasFile={this.updateDatasFile} {...this.getFileModuleProps()} updatePublicDatas={this.updatePublicDatas} />
                        }

                        {
                            this.state.BoardFilesVisible &&
                            <BoardFiles updateDatasFile={this.updateDatasFile} {...this.getFileModuleProps()} updatePublicDatas={this.updatePublicDatas} />
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
        currentSelectedWorkbenchBox
    },
}) {

    return {
        workbenchBoxContentWapperModalStyle,
        myWorkbenchBoxList,
        currentSelectedWorkbenchBox
    }
}
export default connect(mapStateToProps)(WorkbenchPage)

