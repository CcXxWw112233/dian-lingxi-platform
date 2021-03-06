import React, { Component } from 'react'
import { connect } from 'dva'
import {
  setUploadHeaderBaseInfo,
  getSubfixName,
  setBoardIdStorage
} from '@/utils/businessFunction'
import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '@/globalset/js/constant'
import globalStyles from '@/globalset/css/globalClassName.less'
import Cookies from 'js-cookie'
import ThumbnailFilesListShow from './ThumbnailFilesListShow'
import ThumbnailFilesTilingShow from './ThumbnailFilesTilingShow'
import defaultTypeImg from '@/assets/invite/user_default_avatar@2x.png'
import { Upload, Icon, message, Modal, Button } from 'antd'
import styles from './CommunicationThumbnailFiles.less'
import UploadNormal from '../../../../../../../components/UploadNormal'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE,
  PROJECT_TEAM_CARD_EDIT,
  PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD,
  PROJECT_FILES_FILE_UPDATE
} from '@/globalset/js/constant'
import {
  checkIsHasPermissionInBoard,
  checkIsHasPermissionInVisitControl
} from '@/utils/businessFunction'

@connect(mapStateToProps)
export default class CommunicationThumbnailFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentFileschoiceTab: 0, // "0 搜索全部文件 1 搜索子集文件
      isconfirmDeleteModelShow: false
      // thumbnailFilesList: thumbnailFilesList, // 缩略图数据
      // defaultFilesShowType: '0', // 缩略图呈现方式： 0 缩略图table呈现 1 缩略图平铺呈现
    }
  }

  // 上传文件
  uploadProps = () => {
    const that = this
    const {
      currentSelectBoardId,
      board_id,
      current_folder_id,
      updataApiData,
      getThumbnailFilesData,
      getSubFileData,
      queryCommunicationFileData,
      isShowSub
    } = this.props
    const propsObj = {
      name: 'file',
      withCredentials: true,
      multiple: true,
      action: `${REQUEST_DOMAIN_FILE}/file/upload`,
      data: {
        board_id: currentSelectBoardId,
        folder_id: current_folder_id,
        type: '1',
        upload_type: '1'
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({ boardId: currentSelectBoardId })
      },
      beforeUpload(e) {
        // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD, board_id)) {
        //     message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
        //     return false
        // }
        if (e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
          return false
        }
        let loading = message.loading('正在上传...', 0)
      },
      onChange({ file, fileList, event }) {
        if (file.status === 'uploading') {
        } else {
          // message.destroy()
        }
        if (file.status === 'done') {
          if (file.response && file.response.code == '0') {
            message.success(`上传成功。`)
            getThumbnailFilesData()
            // updataApiData('1');
          } else {
            message.error(
              (file.response && file.response.message) || '上传失败'
            )
          }
        } else if (file.status === 'error') {
          message.error(`上传失败。`)
          setTimeout(function() {
            message.destroy()
          }, 2000)
        }
      }
    }
    return propsObj
  }

  // 预览文件/文件圈图显示
  previewFile = (data, e) => {
    const { currentSelectBoardId, current_folder_id } = this.props
    const {
      file_name,
      name,
      file_resource_id,
      file_id,
      id,
      board_id = '',
      folder_id = '',
      version_id
    } = data
    // const id = file_id;
    // const board_id = board_id || currentSelectBoardId;
    // const folder_id = folder_id || current_folder_id;
    const { dispatch } = this.props
    if (!board_id || !folder_id) {
      message.info('board_id或folder_id为空')
      return
    }
    if (!id) {
      return
    }
    setBoardIdStorage(board_id)
    // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW)) {
    //     message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
    //     return false;
    // }

    // dispatch({
    //     type: 'workbenchFileDetail/getCardCommentListAll',
    //     payload: {
    //         id: id
    //     }
    // });
    // dispatch({
    //     type: 'workbenchFileDetail/getFileType',
    //     payload: {
    //         file_id: id,
    //         // calback: function (data) {
    //         //     dispatch({
    //         //         type: 'workbenchPublicDatas/getRelationsSelectionPre',
    //         //         payload: {
    //         //             _organization_id: data.base_info.org_id
    //         //         }
    //         //     })
    //         // }
    //     }
    // });
    dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: id,
        fileType: getSubfixName(file_name),
        // isInOpenFile: true
        filePreviewCurrentName: file_name
      }
    })
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    })
    this.props.setPreviewFileModalVisibile &&
      this.props.setPreviewFileModalVisibile()
    // dispatch({
    //     type: 'workbenchFileDetail/updateDatas',
    //     payload: {
    //         seeFileInput: 'fileModule',
    //         board_id,
    //         filePreviewCurrentId: file_resource_id,
    //         currentParrentDirectoryId: folder_id,
    //         filePreviewCurrentFileId: id,
    //         filePreviewCurrentVersionId: version_id, //file_id,
    //         pdfDownLoadSrc: '',
    //     }
    // })

    // if (getSubfixName(file_name || name) == '.pdf') {
    //     this.props.dispatch({
    //         type: 'workbenchFileDetail/getFilePDFInfo',
    //         payload: {
    //             id
    //         }
    //     })
    // } else {
    //     dispatch({
    //         type: 'workbenchFileDetail/filePreview',
    //         payload: {
    //             id: file_resource_id, file_id: id
    //         }
    //     })
    // }
    // dispatch({
    //     type: 'workbenchFileDetail/fileVersionist',
    //     payload: {
    //         version_id: version_id, //file_id,
    //         isNeedPreviewFile: false,
    //     }
    // })
    // dispatch({
    //     type: 'workbenchTaskDetail/getBoardMembers',
    //     payload: {
    //         id: board_id
    //     }
    // })
    dispatch({
      type: 'workbenchPublicDatas/updateDatas',
      payload: {
        board_id
      }
    })
  }

  // 切换tab
  changeShowTab = tab => {
    // this.setState({ filesShowType: tab},()=>{
    //     this.props.getThumbnailFilesData();
    // });
    const { dispatch } = this.props
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        filesShowType: tab
      }
    })
    this.props.getThumbnailFilesData()
  }

  // 搜索-全部文件/当前文件点击
  changeChooseType = (type, item) => {
    const { bread_paths } = this.props
    console.log('currentIayerSearch', item)
    console.log('bread_paths', bread_paths)
    let tabType = ''
    if (type == 'all_files') {
      tabType = '0'
    } else if ((type = 'sub_files')) {
      if (item.layerType == 'projectLayer') {
        tabType = '1'
      } else {
        tabType = '2'
      }
    }
    this.props.changeChooseType(tabType)
  }

  // 公用上传组件
  renderUpload = () => {
    // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD, board_id)) {
    //     message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //     return false
    //   }
    const {
      currentSelectBoardId,
      current_folder_id,
      getThumbnailFilesData
    } = this.props
    const isHasUploadFilesPermission = () => {
      return checkIsHasPermissionInBoard(
        PROJECT_FILES_FILE_UPDATE,
        currentSelectBoardId
      )
    }
    const props = {
      uploadProps: {
        action: `${REQUEST_DOMAIN_FILE}/file/upload`,
        data: {
          board_id: currentSelectBoardId,
          folder_id: current_folder_id,
          type: '1',
          upload_type: '1'
        }
      },
      uploadCompleteCalback: getThumbnailFilesData
    }
    return (
      <div>
        {isHasUploadFilesPermission() ? (
          <UploadNormal {...props}>
            <>
              <Icon type="upload" /> 上传文件
            </>
          </UploadNormal>
        ) : (
          <div></div>
        )}
      </div>
    )
    // return (
    //     <UploadNormal {...props}>
    //         <><Icon type="upload" /> 上传文件</>
    //     </UploadNormal>
    // )
  }
  batchOperation = () => {
    const { dispatch, isBatchOperation } = this.props
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        isBatchOperation: true
      }
    })
  }
  // toggleVisitControlModal(flag, item) {
  //   var that = this
  //   console.log(that.props)

  //   debugger
  //   this.props.toggleVisitControlModal(flag, item)
  // }

  // 选中的文件
  addBatchOperationList = value => {
    var { fileSelectList, dispatch } = this.props
    if (fileSelectList && fileSelectList.length > 0) {
      var isExit = fileSelectList.some(function(currentValue) {
        return value.id == currentValue.id
      })
      var item = {
        type: value.type,
        id: value.id
      }
      if (isExit) {
        fileSelectList = fileSelectList.filter(
          currentValue => currentValue.id != value.id
        )
      } else {
        fileSelectList.push(item)
      }
    } else {
      var item1 = {
        type: value.type,
        id: value.id
      }
      fileSelectList.push(item1)
    }
    this.setState({
      board_id: value.board_id
    })
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        fileSelectList: fileSelectList
      }
    })
  }
  // 删除二次删除提醒
  confirmDeleteModelShow = () => {
    this.setState({
      isconfirmDeleteModelShow: true
    })
  }
  // 二次确认取消删除
  cancelFileOperationDelete = () => {
    this.setState({
      isconfirmDeleteModelShow: false
    })
    this.cancelfileOperation()
  }
  // 二次确认确定删除
  confirmFileOperationDelete = () => {
    const {
      dispatch,
      fileSelectList,
      currentSelectBoardId,
      current_folder_id,
      bread_paths,
      onlyFileList = []
    } = this.props
    debugger
    // 没有选择具体项目不让删除
    if (currentSelectBoardId) {
      // 没有选择文件提示
      if (fileSelectList.length == 0) {
        message.error(`请选择删除的文件`)
        return
      }
      const params = {
        arrays: JSON.stringify(fileSelectList),
        board_id: currentSelectBoardId,
        folder_id: current_folder_id
      }
      dispatch({
        type: 'projectCommunication/batchOperationFileDelete',
        payload: params
      })
      let newonlyFileList = onlyFileList
      for (let i = 0; i < newonlyFileList.length; i++) {
        for (let j = 0; j < fileSelectList.length; j++) {
          if (newonlyFileList[i].id == fileSelectList[j].id) {
            newonlyFileList.splice(i, 1)
          }
        }
      }
      dispatch({
        type: 'projectCommunication/updateDatas',
        payload: {
          onlyFileList: newonlyFileList
        }
      })
      this.cancelFileOperationDelete()
    } else {
      message.error(`请选择相应的项目批量删除`)
    }
  }
  // 取消删除
  cancelfileOperation = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        selectedRowKeys: [],
        fileSelectList: [],
        isBatchOperation: false
      }
    })
  }
  addNewFolder = () => {
    const { dispatch, currentSelectBoardId } = this.props
    if (currentSelectBoardId) {
      dispatch({
        type: 'projectCommunication/updateDatas',
        payload: {
          isAddNewFolder: true
        }
      })
    } else {
      message.error(`请选择相应的项目新增文件夹`)
    }
  }
  render() {
    const {
      isVisibleFileList,
      onlyFileList,
      onlyFileTableLoading,
      isSearchDetailOnfocusOrOnblur,
      bread_paths,
      currentFileschoiceTab,
      filesShowType,
      currentFileDataType,
      current_folder_id,
      currentSelectBoardId,
      isBatchOperation
    } = this.props
    const { isconfirmDeleteModelShow } = this.state
    const currentIayerSearch =
      bread_paths && bread_paths.length && bread_paths[bread_paths.length - 1]
    const currentIayerFolderName =
      bread_paths &&
      bread_paths.length &&
      (bread_paths[bread_paths.length - 1].board_name ||
        bread_paths[bread_paths.length - 1].folder_name)
    // console.log('bread_paths',bread_paths);
    return (
      <div
        className={`${styles.communicationThumbnailFiles} ${
          isVisibleFileList ? styles.changeContentWidth : null
        }`}
      >
        {isBatchOperation ? (
          <div className={styles.thumbnailFilesHeader}>
            <div className={styles.uploadFile}></div>
            <dev
              className={styles.fileOperation}
              onClick={this.cancelfileOperation}
            >
              取消
            </dev>
            <dev
              className={`${styles.fileOperation} ${styles.fileDelete}`}
              onClick={this.confirmDeleteModelShow}
            >
              删除
            </dev>
          </div>
        ) : (
          <div className={styles.thumbnailFilesHeader}>
            <div className={styles.uploadFile}>
              {/*} {bread_paths && bread_paths.length
                ? this.renderUpload()
                : 
                // <Upload {...this.uploadProps()} showUploadList={false}>
                //     <Icon type="upload" /> 上传文件
                // </Upload>
                ''}
             */}
            </div>
            <dev className={styles.markString}>
              拖拽文件至文件夹或文件夹内，完成上传，同拖拽文件至文件夹或文件夹内，完成上传，同样支持点击上传
            </dev>
            {/* <dev className={styles.fileOperation} onClick={this.addNewFolder}>
              新建文件夹
            </dev> */}
            {bread_paths && bread_paths.length ? (
              <dev className={styles.fileOperation}>{this.renderUpload()} </dev>
            ) : (
              ''
            )}
            <dev className={styles.fileOperation} onClick={this.batchOperation}>
              批量操作
            </dev>
            <div className={styles.changeTypeOperation}>
              <div
                className={`${styles.listShow} ${
                  filesShowType == '0' ? styles.currentFilesShowType : ''
                }`}
                onClick={() => this.changeShowTab('0')}
              >
                <Icon type="bars" />
              </div>
              {/* <div className={styles.tilingShow}> */}
              <div
                className={`${styles.tilingShow} ${
                  filesShowType == '1' ? styles.currentFilesShowType : ''
                }`}
                onClick={() => this.changeShowTab('1')}
              >
                <Icon type="appstore" />
              </div>
            </div>
          </div>
        )}
        {/* 上传文件和切换列表显示操作 */}

        {/* 搜索input触发-显示组件 */}
        {isSearchDetailOnfocusOrOnblur && (
          <div className={styles.searchTypeBox}>
            搜索：
            <span
              className={currentFileDataType == '0' ? styles.currentFile : ''}
              onClick={() => this.changeChooseType('all_files')}
            >
              “全部件”
            </span>
            {currentIayerFolderName ? (
              <span
                className={
                  currentFileDataType !== '0' ? styles.currentFile : ''
                }
                onClick={() =>
                  this.changeChooseType('sub_files', currentIayerSearch)
                }
              >
                {currentIayerFolderName}
              </span>
            ) : (
              ''
            )}
          </div>
        )}

        {/* 首屏-右侧缩略图列表 */}
        {/* <ThumbnailFilesListShow
                    // thumbnailFilesList={thumbnailFilesList}
                    thumbnailFilesList={onlyFileList}
                    onlyFileTableLoading={onlyFileTableLoading}
                    isSearchDetailOnfocusOrOnblur={isSearchDetailOnfocusOrOnblur}
                    previewFile={this.previewFile}
                /> */}

        {filesShowType == '0' ? (
          <ThumbnailFilesListShow
            showTips={true}
            board_id={currentSelectBoardId}
            uploadDisabled={
              this.props.simplemodeCurrentProject?.board_id === '0' &&
              currentSelectBoardId === '0'
            }
            folder_id={current_folder_id}
            contentStyle={{ height: 'calc(100% - 108px)' }}
            // thumbnailFilesList={thumbnailFilesList}
            dispatch={this.props.dispatch}
            addBatchOperationList={this.addBatchOperationList}
            thumbnailFilesList={onlyFileList}
            onlyFileTableLoading={onlyFileTableLoading}
            isSearchDetailOnfocusOrOnblur={isSearchDetailOnfocusOrOnblur}
            previewFile={this.previewFile}
            toggleVisitControlModal={this.props.toggleVisitControlModal}
            getThumbnailFilesData={this.props.getThumbnailFilesData}
          />
        ) : (
          <ThumbnailFilesTilingShow
            showTips={true}
            uploadDisabled={
              this.props.simplemodeCurrentProject?.board_id === '0' &&
              currentSelectBoardId === '0'
            }
            thumbnailFilesList={onlyFileList}
            previewFile={this.previewFile}
            board_id={currentSelectBoardId}
            addBatchOperationList={this.addBatchOperationList}
            folder_id={current_folder_id}
            contentStyle={{ height: 'calc(100% - 108px)' }}
            // thumbnailFilesList={thumbnailFilesList}
            dispatch={this.props.dispatch}
          />
        )}
        {isconfirmDeleteModelShow && (
          <Modal
            title="删除确认"
            visible={true}
            onOk={this.confirmFileOperationDelete}
            onCancel={this.cancelFileOperationDelete}
            // okButtonProps=(<Button type="danger">Danger</Button>)
            footer={[
              <Button key="back" onClick={this.cancelFileOperationDelete}>
                取消
              </Button>,
              <Button
                key="submit"
                className={styles.confirmDeleteBtn}
                type="danger"
                onClick={this.confirmFileOperationDelete}
              >
                删除
              </Button>
            ]}
          >
            <div className={styles.deleteModelContent}>
              <i
                className={`${globalStyles.authTheme}`}
                style={{ marginRight: 5, fontSize: 20, color: '#FF8A00' }}
              >
                &#xe814;
              </i>
              删除文件后不能恢复，确定要删除吗?
            </div>
          </Modal>
        )}
      </div>
    )
  }
}

function mapStateToProps({
  projectCommunication: {
    isBatchOperation,
    onlyFileList,
    onlyFileTableLoading,
    filesShowType,
    fileSelectList
  },
  technological: {
    datas: { userBoardPermissions }
  },
  simplemode: { simplemodeCurrentProject }
}) {
  return {
    onlyFileList,
    onlyFileTableLoading,
    filesShowType,
    userBoardPermissions,
    isBatchOperation,
    fileSelectList,
    simplemodeCurrentProject
  }
}

CommunicationThumbnailFiles.defaultProps = {
  // 这是一个项目交流中的每一个文件item列表,
}
