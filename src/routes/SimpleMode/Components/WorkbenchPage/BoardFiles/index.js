import React, { Component } from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less'
import FileModule from '@/routes/Technological/components/ProjectDetail/FileModule'
import { Modal, Dropdown, Button, Select, Icon, TreeSelect, Tree } from 'antd';
import {
  checkIsHasPermission, checkIsHasPermissionInBoard, getSubfixName,
  openPDF, setBoardIdStorage, getOrgNameWithOrgIdFilter
} from "../../../../../utils/businessFunction";
import { height } from 'window-size';

const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;

const getEffectOrReducerByName = name => `projectDetail/${name}`
const getEffectOrReducerByNameTask = name => `projectDetailTask/${name}`
const getEffectOrReducerByNameFile = name => `projectDetailFile/${name}`
const getEffectOrReducerByNameProcess = name => `projectDetailProcess/${name}`


class BoardFiles extends Component {
  state = {
    boardSelectVisible: true,
    boardFileContentVisible: false,

  };

  constructor(props) {
    super(props)
  }


  componentDidMount() {
    console.log('sssss', 112)
  }


  componentWillReceiveProps(nextProps) {

  }

  openBoardFiles = (board) => {
    //console.log(board);
    this.setState({
      boardSelectVisible: false,
      boardFileContentVisible: true
    });
    this.initialget(board.board_id);
  }

  initialget(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'simpleWorkbenchbox/initProjectDetailAndprojectDetailFile',
      payload: {
        id
      }
    });

  }


  getFileModuleProps = () => {
    const { dispatch, modal, model } = this.props;
    return {
      modal,
      model,
      dispatch,
      openFileInUrl(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('openFileInUrl'),
          payload: data,
        })
      },
      postCommentToDynamics(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('postCommentToDynamics'),
          payload: data,
        })
      },
      getFileList(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('getFileList'),
          payload: params
        })
      },
      fileCopy(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileCopy'),
          payload: data
        })
      },
      fileDownload(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileDownload'),
          payload: params
        })
      },
      fileRemove(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileRemove'),
          payload: data
        })
      },
      fileMove(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileMove'),
          payload: data
        })
      },
      fileUpload(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileUpload'),
          payload: data
        })
      },
      fileVersionist(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('fileVersionist'),
          payload: params
        })
      },
      recycleBinList(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('recycleBinList'),
          payload: params
        })
      },
      deleteFile(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('deleteFile'),
          payload: data
        })
      },
      restoreFile(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('restoreFile'),
          payload: data
        })
      },
      getFolderList(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('getFolderList'),
          payload: params
        })
      },
      addNewFolder(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('addNewFolder'),
          payload: data
        })
      },
      updateFolder(data) {
        dispatch({
          type: getEffectOrReducerByNameFile('updateFolder'),
          payload: data
        })
      },
      filePreview(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('filePreview'),
          payload: params
        })
      },
      getPreviewFileCommits(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('getPreviewFileCommits'),
          payload: params
        })
      },
      addFileCommit(params) {
        console.log("addFileCommit", params);
        dispatch({
          type: getEffectOrReducerByNameFile('addFileCommit'),
          payload: params
        })
      },
      deleteCommit(params) {
        dispatch({
          type: getEffectOrReducerByNameFile('deleteCommit'),
          payload: params
        })
      },
    }
  }


  updateDatas = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }

  updateDatasTask = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: getEffectOrReducerByNameTask('updateDatas'),
      payload: payload
    })
  }
  updateDatasFile = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: getEffectOrReducerByNameFile('updateDatas'),
      payload: payload
    })
  }
  updateDatasProcess = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: getEffectOrReducerByNameProcess('updateDatas'),
      payload: payload
    })
  }

  fileModuleBack = () => {
    this.setState({
      boardSelectVisible: true,
      boardFileContentVisible: false
    });
  }
  render() {
    const { dispatch } = this.props
    const updateDatasFile = (payload) => {
      dispatch({
        type: 'projectDetailFile/updateDatas',
        payload
      })
    }
    const { boardSelectVisible, boardFileContentVisible } = this.state;
    // console.log(boardSelectVisible,boardFileContentVisible,"sssss");

    const { allOrgBoardTreeList = [] } = this.props;
    const workbenchBoxContentElementInfo = document.getElementById('container_workbenchBoxContent');
    let contentHeight = workbenchBoxContentElementInfo ? workbenchBoxContentElementInfo.offsetHeight : 0;
    return (
      <div className={indexStyles.boardFilesContainer}>
        {
          boardSelectVisible && (
            <div className={indexStyles.boardSelectOutWapper} style={contentHeight > 0 ? { maxHeight: contentHeight + 'px' } : {}}>
              <div className={indexStyles.boardSelectWapper}>
                {
                  allOrgBoardTreeList.map((org, orgkey) => {

                    return org.board_list && org.board_list.length > 0 && (
                      <div key={org.org_id}>
                        <div className={indexStyles.groupName}>{org.org_name}</div>
                        <div className={indexStyles.boardItemWapper}>
                          {
                            org.board_list.map((board, key) => {
                              return (
                                <div key={board.board_id} className={indexStyles.boardItem} onClick={e => this.openBoardFiles(board)}>
                                  <i className={`${globalStyles.authTheme} ${indexStyles.boardIcon}`}>&#xe67d;</i>
                                  <span className={indexStyles.boardName}>{board.board_name}</span>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    )
                  })
                }

              </div>
            </div>
          )}

        {
          boardFileContentVisible && (
            <div className={indexStyles.boardFileContentWapper} style={contentHeight > 0 ? { maxHeight: contentHeight + 'px' } : {}}>
              <FileModule
                {...this.getFileModuleProps()}
                marginTop={'0px'}
                fileModuleBack={this.fileModuleBack}
                showBackBtn={true}
                updateDatas={this.updateDatas}
                updateDatasTask={this.updateDatasTask}
                updateDatasFile={this.updateDatasFile}
                updateDatasProcess={this.updateDatasProcess} />
            </div>
          )}

      </div>
    );
  }

}


function mapStateToProps({
  modal, projectDetail, projectDetailTask, projectDetailFile, projectDetailProcess, loading,
  simpleWorkbenchbox: {
    boardListData,
    currentBoardDetail,
    boardFileListData
  },
  simplemode: {
    allOrgBoardTreeList
  }
}) {

  const modelObj = {
    datas: { ...projectDetail['datas'], ...projectDetailTask['datas'], ...projectDetailFile['datas'], ...projectDetailProcess['datas'], }
  }

  return {
    modal, model: modelObj, loading,
    boardListData,
    currentBoardDetail,
    boardFileListData,
    allOrgBoardTreeList
  }
}
export default connect(mapStateToProps)(BoardFiles)


