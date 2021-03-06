import React, { Component } from 'react'
import { connect } from 'dva/index'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import FileListRightBarFileDetailModal from '@/routes/Technological/components/Workbench/CardContent/Modal/FileListRightBarFileDetailModal'
import { getParent } from './components/getCommunicationFileListFn'
// import UploadTemporaryFile from './components/UploadTemporaryFile';
import CommunicationFirstScreenHeader from './components/FirstScreen/CommunicationFirstScreenHeader'
import CommunicationTreeList from './components/CommunicationTreeList'
import CommunicationThumbnailFiles from './components/FirstScreen/CommunicationThumbnailFiles'
import { Select, Icon, Tree, Upload, message, Modal } from 'antd'
import {
  REQUEST_DOMAIN_FILE,
  MESSAGE_DURATION_TIME
} from '@/globalset/js/constant'
import { ROLETYPEID } from '../../../../Technological/components/VisitControl/constans'

import VisitControl from '../../../../Technological/components/VisitControl'
import { arrayNonRepeatfy } from '../../../../../utils/util'
import {
  toggleContentPrivilege,
  setContentPrivilege,
  removeContentPrivilege
} from '@/services/technological/project'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  getSubfixName,
  setBoardIdStorage,
  setUploadHeaderBaseInfo
} from '@/utils/businessFunction'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { getBoardFileList } from '@/services/technological/file'
import {
  UPLOAD_FILE_SIZE,
  FILE_UPLOAD_ACCEPT_TYPE
} from '@/globalset/js/constant'
import { openImChatBoard } from '../../../../../utils/businessFunction'
import DEvent, { DRAGFILESUPLOADSUCCESS } from '../../../../../utils/event'
// import { lx_utils, Im } from 'lingxi-im'

const { TreeNode, DirectoryTree } = Tree

const getEffectOrReducerByName = name => `technological/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`
const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`
const getEffectOrReducerByName_6 = name => `workbenchPublicDatas/${name}`
const getEffectOrReducerByName_7 = name => `gantt/${name}`
const getEffectOrReducerByName_8 = name => `projectCommunication/${name}`

class BoardCommunication extends Component {
  state = {
    selectBoardFileModalVisible: false,
    selectBoardDropdownVisible: false,
    selectBoardFileDropdownVisible: false,
    boardTreeData: [],
    currentfile: {},
    selectBoardFileCompleteDisabled: true,
    previewFileModalVisibile: false,
    is_selectFolder: false,
    awaitUploadFile: {},
    dragEnterCaptureFlag: false,
    showFileSelectDropdown: false,
    // ????????????????????????/??????????????????????????????
    showFileListisOpenFileDetailModal: false,
    collapseActiveKeys: [], // ?????????????????????keys
    // ????????????/?????????????????????????????????
    isVisibleFileList: true,
    bread_paths: [], // ???????????????
    currentItemIayerData: [], // ???????????????
    currentItemLayerId: '', // ????????????ID
    currentSelectBoardId: '', // ?????????????????????ID
    currentFolderId: '', // ??????????????????folder_id
    isSearchDetailOnfocusOrOnblur: false, // ?????????????????????????????????????????????
    currentFileDataType: '0', // ???????????????????????? '0' ???????????? '1' ????????????????????? '2' ????????????????????????
    currentSearchValue: '', // ??????????????????
    currentFileschoiceTab: '0' // tab?????? "0 ?????????????????? 1 ??????????????????
  }

  constructor(props) {
    super(props)
    const { dispatch } = this.props
    // Im.addEventListener('visible', val => {
    //   // ??????????????????????????????
    //   // this.setState({ isShowlingxiIm: val});
    // })
    /** ?????????????????? */
    DEvent.addEventListener(DRAGFILESUPLOADSUCCESS, this.getThumbnailFilesData)
  }
  componentWillUnmount() {
    DEvent.removeEventListener(
      DRAGFILESUPLOADSUCCESS,
      this.getThumbnailFilesData
    )
  }

  componentWillReceiveProps(nextProps) {
    //?????????????????????????????????id??????????????????
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    const { board_id: last_board_id } = this.props.simplemodeCurrentProject
    if (next_board_id != last_board_id) {
      const is_all_boards = next_board_id == '0' || !next_board_id
      const { boards_flies = [] } = this.props
      const cur_bread_paths = boards_flies.filter(
        item => item.id == next_board_id
      )
      this.setState(
        {
          currentFileDataType: is_all_boards ? '0' : '1',
          currentSelectBoardId: next_board_id,
          currentFolderId: '',
          bread_paths: is_all_boards ? [] : cur_bread_paths
        },
        () => {
          // console.log('ssss_bread_paths', {path:this.state.bread_paths, boards_flies})
          this.getThumbnailFilesData()
        }
      )
    }
  }

  componentDidMount() {
    this.queryCommunicationFileData()
    this.getThumbnailFilesData()
    // const { simplemodeCurrentProject = {} } = this.props
    // this.getThumbnailFilesData({init_board_id: simplemodeCurrentProject.board_id});
  }

  // ??????????????????????????????????????????'0'
  queryCommunicationFileData = () => {
    const { dispatch, gantt_board_id } = this.props
    const boardId = gantt_board_id == '0' ? '' : gantt_board_id
    dispatch({
      type: getEffectOrReducerByName_7('getGanttBoardsFiles'),
      payload: {
        // query_board_ids: content_filter_params.query_board_ids,
        // board_id: gantt_board_id == '0' ? '' : gantt_board_id
        board_id: boardId,
        query_board_ids: []
      }
    })
    this.setState({ currentFileDataType: '0' })
  }

  /** ?????????????????????????????? */
  updateFolderPrivileges = (data = [], folder_id) => {
    let obj
    data.forEach(item => {
      console.log(item.folder_id, folder_id)
      if (item.folder_id === folder_id) {
        obj = item
      }

      if (!obj && item.child_data.length) {
        obj = this.updateFolderPrivileges(item.child_data, folder_id)
      }
    })
    return obj || {}
  }

  // ???????????????????????????????????????'1'
  getCommunicationFolderList = (boardId, dontUpdateFiles) => {
    const { dispatch } = this.props
    if (boardId) {
      this.setState({
        currentBoardId: boardId
      })
      dispatch({
        type: getEffectOrReducerByName_8('getFolderList'),
        payload: {
          board_id: boardId
        }
      }).then(res => {
        if (this.state.currentValue?.folder_id) {
          const privilege = this.updateFolderPrivileges(
            [res.data],
            this.state.currentValue?.folder_id
          )
          this.setState({
            currentValue: {
              ...this.state.currentValue,
              ...privilege
            },
            visitControlModalVisible: privilege.folder_id
              ? this.state.visitControlModalVisible
              : false
          })
        }
      })
    }

    this.setState({
      showFileListisOpenFileDetailModal: false, // ??????????????????
      previewFileModalVisibile: false, // ??????????????????????????????????????????,????????????????????????
      currentFileDataType: '1', // ??????????????????????????????0????????????/1???????????????/2??????????????????
      currentSearchValue: '' // ?????????????????????
    })
    this.setcurrentItemLayerId(boardId, dontUpdateFiles)
  }

  setcurrentItemLayerId = (id, dontUpdateFiles) => {
    // ???????????????????????????/??????ID
    this.setState(
      {
        currentSelectBoardId: id,
        currentItemLayerId: id
      },
      () => {
        this.changeFirstBreadPaths() // ??????????????????????????????
        if (!dontUpdateFiles) this.getThumbnailFilesData() // ???????????????????????????
      }
    )
  }

  changeFirstBreadPaths = () => {
    // ?????????????????????????????????????????????
    // console.log('??????????????????');
    const { currentItemLayerId } = this.state
    const { boards_flies } = this.props
    const firstLayerData = boards_flies.filter(
      item => item.id == currentItemLayerId
    )
    firstLayerData.map(item => (item.layerType = 'projectLayer'))
    // firstLayerData[0].layerType = 'firstLayer';
    this.setState({
      bread_paths: firstLayerData,
      currentFolderId:
        firstLayerData && firstLayerData[0] && firstLayerData[0].folder_id
    })
  }

  // ?????????????????????tree??????-????????????????????????????????????????????????
  onSelectTree = (currentfloor, first_item) => {
    if (!currentfloor) return
    first_item.layerType = 'projectLayer'
    const { communicationSubFolderData } = this.props
    const { child_data = [] } = communicationSubFolderData
    const { folder_id, parent_id } = currentfloor
    let newLevel = getParent(child_data, folder_id)
    newLevel.unshift(first_item)
    this.setState(
      {
        bread_paths: newLevel,
        currentItemLayerId: folder_id,
        showFileListisOpenFileDetailModal: false, // ??????????????????
        previewFileModalVisibile: false, // ??????????????????????????????????????????,????????????????????????
        currentFileDataType: '2', // ??????????????????????????????0????????????/1???????????????/2??????????????????
        currentFolderId: folder_id,
        currentSearchValue: '' // ?????????????????????
      },
      () => {
        this.getThumbnailFilesData()
      }
    )
  }

  // ????????????
  getParams = () => {
    const {
      currentFileDataType, // currentFileDataType 0 ???????????????????????? 1 ???????????????????????????????????? 2 ??????Tree???????????????
      currentSelectBoardId,
      // currentItemLayerId,
      currentFolderId,
      currentSearchValue // ???????????????
    } = this.state
    let boardId = ''
    let folderId = ''
    let queryConditions = ''
    switch (currentFileDataType) {
      case '0':
        boardId = ''
        folderId = ''
        queryConditions = ''
        break
      case '1':
        boardId = currentSelectBoardId
        folderId = ''
        queryConditions = currentSelectBoardId
          ? [{ id: '1135447108158099461', value: currentSelectBoardId }]
          : null
        break
      case '2':
        boardId = currentSelectBoardId
        folderId = currentFolderId
        queryConditions = [
          { id: '1135447108158099461', value: currentSelectBoardId },
          { id: '1192646538984296448', value: currentFolderId }
        ]
        break
      default:
        boardId = ''
        folderId = ''
        queryConditions = ''
        break
    }
    const params = {
      boardId,
      folderId,
      queryConditions,
      currentSearchValue
    }
    return params
  }

  /** ??????????????????????????????????????? */
  getThumbnailFilesData = (data = {}) => {
    // console.log('???????????????????????????');
    const { dispatch, simplemodeCurrentProject = {} } = this.props
    const { board_id } = simplemodeCurrentProject
    const params = this.getParams()
    const { boardId, folderId } = params
    // console.log('params......',params);

    dispatch({
      type: getEffectOrReducerByName_8('getOnlyFileList'),
      payload: {
        board_id: (board_id && board_id != '0' && board_id) || boardId,
        folder_id: folderId
      }
    }).then(res => {
      /** ?????????????????????????????????????????????????????????????????? */
      if (res.code === '0' && res.data && this.state.visitControlModalVisible) {
        if (this.getVisitControlModalDataType() === 'file') {
          const fileData = res.data.find(
            item => item?.version_id === this.state.currentValue?.version_id
          )
          this.setState({
            currentValue: {
              ...this.state.currentValue,
              ...fileData
            },
            visitControlModalVisible: fileData
              ? this.state.visitControlModalVisible
              : false
          })
        }
      }
    })
  }

  // ??????
  searchCommunicationFilelist = () => {
    // console.log('??????');
    const { dispatch } = this.props
    const params = this.getParams()
    const { boardId, folderId, queryConditions, currentSearchValue } = params

    dispatch({
      type: getEffectOrReducerByName_8('getSearchCommunicationFilelist'),
      payload: {
        board_id: boardId,
        folder_id: folderId,
        search_term: currentSearchValue, // ???????????????
        search_type: '6', // ???????????? '6' ?????????????????????????????????'6'???????????????????????????
        query_conditions: queryConditions
          ? JSON.stringify(queryConditions)
          : null, // ???????????????????????????
        page_size: 100
        // page_number: 1,
      }
    })
  }

  // ??????????????????????????????????????????
  isShowSearchOperationDetail = (value, searchValue) => {
    this.setState(
      {
        isSearchDetailOnfocusOrOnblur: value,
        currentSearchValue: searchValue
      },
      () => {
        this.searchCommunicationFilelist()
      }
    )
  }

  // ????????????
  updataApiData = type => {
    // this.queryCommunicationFileData();
    // this.getCommunicationFolderList();
    // this.getThumbnailFilesData(type);
    this.getThumbnailFilesData()
  }

  // ??????????????????-????????????????????????
  goAllFileStatus = () => {
    // console.log('????????????????????????');
    // bread_paths: [], // ???????????????
    // currentItemIayerData: [], // ???????????????
    // currentItemLayerId: '', // ????????????ID
    // currentSelectBoardId: '', // ?????????????????????ID
    // isSearchDetailOnfocusOrOnblur: false, // ?????????????????????????????????????????????
    // currentFileDataType: '0', // ???????????????????????? '0' ???????????? '1' ????????????????????? '2' ????????????????????????
    // currentSearchValue: '', // ??????????????????

    // ?????????

    this.setState(
      {
        bread_paths: [],
        currentItemIayerData: [],
        currentItemLayerId: '',
        currentSelectBoardId: '',
        currentFileDataType: '0',
        currentSearchValue: '',
        isSearchDetailOnfocusOrOnblur: false
      },
      () => {
        this.queryCommunicationFileData()
        this.getThumbnailFilesData()
      }
    )
  }

  initModalSelect = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'simpleWorkbenchbox/updateDatas',
      payload: {
        currentBoardDetail: undefined
      }
    })
    this.setState({
      selectBoardFileCompleteDisabled: true,
      selectBoardFileModalVisible: false
    })
  }

  openFileModal = () => {
    const { dispatch } = this.props
    const { currentBoardDetail = {} } = this.props
    const { currentfile = {} } = this.state
    const {
      fileId,
      versionId,
      fileResourceId,
      folderId,
      fileName
    } = currentfile
    const id = fileId
    const { board_id } = currentBoardDetail

    dispatch({
      type: 'workbenchFileDetail/getCardCommentListAll',
      payload: {
        id: id
      }
    })
    dispatch({
      type: 'workbenchFileDetail/getFileType',
      payload: {
        file_id: id
      }
    })

    this.setState({
      selectBoardFileModalVisible: false,
      previewFileModalVisibile: true
    })
    this.getFileModuleProps().updateFileDatas({
      seeFileInput: 'fileModule',
      board_id,
      filePreviewCurrentId: fileResourceId,
      currentParrentDirectoryId: folderId,
      filePreviewCurrentFileId: fileId,
      filePreviewCurrentVersionId: versionId, //file_id,
      pdfDownLoadSrc: ''
    })
    if (getSubfixName(fileName) == '.pdf') {
      dispatch({
        type: 'workbenchFileDetail/getFilePDFInfo',
        payload: {
          id
        }
      })
    } else {
      this.getFileModuleProps().filePreview({ id: fileResourceId, file_id: id })
    }
    this.getFileModuleProps().fileVersionist({
      version_id: versionId, //file_id,
      isNeedPreviewFile: false
    })
    this.updatePublicDatas({ board_id })
    this.getFileModuleProps().getBoardMembers({ id: board_id })

    this.initModalSelect()
  }

  // ??????????????????????????????
  setPreviewFileModalVisibile = () => {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }

  getFileModuleProps() {
    const { dispatch } = this.props
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
      }
    }
  }

  updateDatasFile = payload => {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName_5('updateDatas'),
      payload: payload
    })
  }

  updateDatas = payload => {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }
  updatePublicDatas = payload => {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName_6('updateDatas'),
      payload: payload
    })
  }

  onBeforeUpload = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('??????????????????????????????????????????')
      return false
    }

    const { dispatch, simplemodeCurrentProject = {} } = this.props
    if (file.size == 0) {
      message.error(`?????????????????????`)
      return false
    } else if (file.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
      message.error(`??????????????????????????????${UPLOAD_FILE_SIZE}MB`)
      return false
    }
    const lastIndex = file.name.lastIndexOf('.')
    //console.log(file.name.substr(lastIndex) + 1);
    if (
      !file.name ||
      FILE_UPLOAD_ACCEPT_TYPE.indexOf(getSubfixName(file.name)) == -1
    ) {
      message.warn(`?????????????????????`)
      return false
    }
    this.setState(state => ({
      awaitUploadFile: file,
      selectBoardFileModalVisible: true,
      is_selectFolder: true,
      dragEnterCaptureFlag: false,
      currentfile: {}
    }))

    let currentBoardDetail = {}
    if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
      currentBoardDetail = { ...simplemodeCurrentProject }
      dispatch({
        type: 'simpleWorkbenchbox/updateDatas',
        payload: {
          currentBoardDetail: currentBoardDetail
        }
      })
    }

    dispatch({
      type: 'simpleBoardCommunication/updateDatas',
      payload: {
        is_file_tree_loading: true
      }
    })

    if (currentBoardDetail.board_id) {
      dispatch({
        type: 'simpleWorkbenchbox/getFolderList',
        payload: {
          board_id: currentBoardDetail.board_id
        }
      })
    }
    return false
  }

  handleUpload = () => {
    const { awaitUploadFile, currentfile = {} } = this.state
    const { currentBoardDetail = {} } = this.props
    const formData = new FormData()
    formData.append('file', awaitUploadFile)
    this.setState({
      selectBoardFileModalVisible: false
    })
    let loading = message.loading('?????????????????????...', 0)

    axios({
      url: `${REQUEST_DOMAIN_FILE}/file/upload`,
      method: 'post',
      //processData: false,
      data: formData,
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({})
      },
      params: {
        board_id: currentBoardDetail.board_id,
        folder_id: currentfile.fileId,
        type: '1',
        upload_type: '1'
      }
    })
      .then(res => {
        this.setState({
          awaitUploadFile: {},
          uploading: false
        })
        const apiResult = res.data
        if (isApiResponseOk(apiResult)) {
          const { dispatch, currentBoardDetail } = this.props
          const fileId = apiResult.data.id
          axios({
            url: `${REQUEST_DOMAIN_FILE}/file/info/${fileId}`,
            method: 'GET',
            headers: {
              Authorization: Cookies.get('Authorization'),
              refreshToken: Cookies.get('refreshToken'),
              ...setUploadHeaderBaseInfo({})
            }
          })
            .then(fileInfoRes => {
              const fileInfoApiResult = fileInfoRes.data
              if (isApiResponseOk(fileInfoApiResult)) {
                const id = fileId
                const { board_id } = currentBoardDetail
                const { base_info } = fileInfoApiResult.data
                dispatch({
                  type: 'workbenchFileDetail/getCardCommentListAll',
                  payload: {
                    id: id
                  }
                })
                dispatch({
                  type: 'workbenchFileDetail/getFileType',
                  payload: {
                    file_id: id
                  }
                })

                this.setState({
                  selectBoardFileModalVisible: false,
                  previewFileModalVisibile: true
                })
                this.getFileModuleProps().updateFileDatas({
                  seeFileInput: 'fileModule',
                  board_id,
                  filePreviewCurrentId: base_info.file_resource_id,
                  currentParrentDirectoryId: base_info.folder_id,
                  filePreviewCurrentFileId: fileId,
                  filePreviewCurrentVersionId: base_info.file_id, //file_id,
                  pdfDownLoadSrc: ''
                })
                if (getSubfixName(base_info.file_name) == '.pdf') {
                  dispatch({
                    type: 'workbenchFileDetail/getFilePDFInfo',
                    payload: {
                      id
                    }
                  })
                } else {
                  this.getFileModuleProps().filePreview({
                    id: base_info.file_resource_id,
                    file_id: id
                  })
                }
                this.getFileModuleProps().fileVersionist({
                  version_id: base_info.file_id, //file_id,
                  isNeedPreviewFile: false
                })
                this.updatePublicDatas({ board_id })
                this.getFileModuleProps().getBoardMembers({ id: board_id })
              } else {
                message.warn(apiResult.message)
              }
            })
            .catch((error, e) => {
              // console.log(error);
              message.destroy()
              message.error('????????????')
            })

          this.setState({
            selectBoardFileCompleteDisabled: false
          })
          message.destroy()
          message.success('????????????')
        } else {
          message.warn(apiResult.message)
        }

        this.initModalSelect()
      })
      .catch((error, e) => {
        // console.log(error);
        message.destroy()
        this.initModalSelect()

        message.error('????????????')
      })
  }

  getBoardTreeData = allOrgBoardTreeList => {
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    let list = []
    allOrgBoardTreeList.map((org, orgKey) => {
      //???????????????????????????
      if (user_set.current_org === '0' || user_set.current_org === org.org_id) {
        //children
        //isLeaf: true
        let children = []
        if (org.board_list && org.board_list.length > 0) {
          org.board_list.map((board, boardKey) => {
            children.push({
              key: board.board_id,
              title: board.board_name,
              isLeaf: true,
              selectable: true
            })
          })
          list.push({
            key: org.org_id,
            title: org.org_name,
            children,
            selectable: false
          })
        }
      }
    })
    return list
  }

  getBoardFileTreeData = data => {
    let list = []
    let { folder_data = [], file_data = [] } = data
    folder_data.map((folder, key) => {
      list.push({
        key: folder.folder_id,
        title: folder.folder_name,
        type: 1,
        selectable: false
      })
    })
    file_data.map((file, key) => {
      //console.log(file);
      list.push({
        key: file.file_id,
        title: file.file_name,
        type: 2,
        version_id: file.version_id,
        file_resource_id: file.file_resource_id,
        folder_id: file.belong_folder_id,
        isLeaf: true,
        selectable: true
      })
    })
    return list
  }

  selectBoardFile = e => {
    e.stopPropagation()
    const { dispatch, simplemodeCurrentProject = {} } = this.props
    let currentBoardDetail = {}
    if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
      currentBoardDetail = { ...simplemodeCurrentProject }
      dispatch({
        type: 'simpleWorkbenchbox/updateDatas',
        payload: {
          currentBoardDetail: currentBoardDetail
        }
      })
    }

    dispatch({
      type: 'simpleBoardCommunication/updateDatas',
      payload: {
        is_file_tree_loading: true
      }
    })

    if (currentBoardDetail.board_id) {
      dispatch({
        type: 'simpleWorkbenchbox/getFileList',
        payload: {
          board_id: currentBoardDetail.board_id
        }
      })
    }

    this.setState({
      selectBoardFileModalVisible: true,
      is_selectFolder: false,
      currentfile: {}
    })
  }

  onChange = value => {
    // console.log(value);
    this.setState({ value })
  }

  onSelectBoard = (keys, event) => {
    // console.log(event, "event");
    const { dispatch } = this.props
    const { is_selectFolder } = this.state
    if (keys.length > 0) {
      const boardId = keys[0]
      setBoardIdStorage(boardId)
      dispatch({
        type: 'simpleBoardCommunication/updateDatas',
        payload: {
          is_file_tree_loading: true
        }
      })
      dispatch({
        type: 'simpleWorkbenchbox/updateDatas',
        payload: {
          currentBoardDetail: this.getSelectBoardBaseInfo(boardId)
        }
      })
      if (is_selectFolder) {
        dispatch({
          type: 'simpleWorkbenchbox/getFolderList',
          payload: {
            board_id: boardId,
            calback: () => {
              dispatch({
                type: 'simpleBoardCommunication/updateDatas'
              })
            }
          }
        })
      } else {
        dispatch({
          type: 'simpleWorkbenchbox/getFileList',
          payload: {
            board_id: boardId
          }
        })
      }

      this.setState({
        selectBoardDropdownVisible: false,
        showFileSelectDropdown: true,
        currentfile: {}
      })
    }
  }

  onSelectFile = (keys, event) => {
    const { dispatch } = this.props
    if (!event.selectedNodes[0]) {
      return
    }
    const fileId = keys[0]
    //console.log("selectedNodes", event.selectedNodes[0]);
    if (!event.selectedNodes[0] && event.selectedNodes[0].props.type === 1) {
      message.warn('????????????????????????')
      return
    }
    const fileName =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.title &&
      event.selectedNodes[0].props.title
    const versionId =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.version_id &&
      event.selectedNodes[0].props.version_id
    const fileResourceId =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.file_resource_id &&
      event.selectedNodes[0].props.file_resource_id
    const folder_id =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.folder_id &&
      event.selectedNodes[0].props.folder_id
    this.setState({
      selectBoardFileDropdownVisible: false,
      currentfile: {
        fileId: fileId,
        fileName: fileName,
        versionId: versionId,
        fileResourceId: fileResourceId,
        folder_id: folder_id
      },
      selectBoardFileCompleteDisabled: false
    })
  }

  onSelectFolder = (keys, event) => {
    //console.log('?????????', keys, event);
    const { dispatch } = this.props
    if (!event.selectedNodes[0]) {
      return
    }
    const fileId = keys[0]
    const fileName =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.title &&
      event.selectedNodes[0].props.title
    const versionId =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.version_id &&
      event.selectedNodes[0].props.version_id
    const fileResourceId =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.file_resource_id &&
      event.selectedNodes[0].props.file_resource_id
    const folder_id =
      event.selectedNodes[0] &&
      event.selectedNodes[0].props &&
      event.selectedNodes[0].props.folder_id &&
      event.selectedNodes[0].props.folder_id
    this.setState({
      selectBoardFileDropdownVisible: false,
      currentfile: {
        fileId: fileId,
        fileName: fileName,
        versionId: versionId,
        fileResourceId: fileResourceId,
        folder_id: folder_id
      },
      selectBoardFileCompleteDisabled: false
    })
  }

  handleSelectBoardDropdownVisibleChange = flag => {
    this.setState({ selectBoardDropdownVisible: flag })
  }

  handleSelectBoardFileDropdownVisibleChange = flag => {
    this.setState({ selectBoardFileDropdownVisible: flag })
  }

  getSelectBoardBaseInfo(boardId) {
    const { allOrgBoardTreeList = [] } = this.props
    let currentBoard
    allOrgBoardTreeList.map((org, orgKey) => {
      if (org.board_list && org.board_list.length > 0) {
        let newBoardList = org.board_list.filter(
          item => item.board_id == boardId
        )
        if (newBoardList.length > 0) {
          currentBoard = newBoardList[0]
        }
      }
    })
    return currentBoard
  }

  async onLoadFileTreeData(treeNode) {
    const {
      dispatch,
      currentBoardDetail = {},
      simpleBoardCommunication = {}
    } = this.props
    const { boardFileTreeData = {} } = simpleBoardCommunication
    const res = await getBoardFileList({
      board_id: currentBoardDetail.board_id,
      folder_id: treeNode.props.eventKey
    })
    if (isApiResponseOk(res)) {
      //console.log(treeNode.props);
      const childTreeData = this.getBoardFileTreeData(res.data)
      treeNode.props.dataRef.children = [...childTreeData]
      if (!childTreeData || childTreeData.length == 0) {
        treeNode.props.dataRef.title = (
          <span>
            {treeNode.props.dataRef.title}
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
              &nbsp;(??????????????????)
            </span>
          </span>
        )
      }
      dispatch({
        type: 'simpleBoardCommunication/updateDatas',
        payload: {
          boardFileTreeData: boardFileTreeData
        }
      })
    }
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            {...item}
            dataRef={item}
            selectable={item.selectable == true ? true : false}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            key={item.key}
            {...item}
            dataRef={item}
            selectable={item.selectable == true ? true : false}
          />
        )
      }
    })
  }

  renderFolderTreeNodes = data => {
    return data.map(item => {
      if (item.child_data) {
        return (
          <TreeNode
            title={item.folder_name}
            key={item.folder_id}
            dataRef={item}
          >
            {this.renderFolderTreeNodes(item.child_data)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            title={item.folder_name}
            key={item.folder_id}
            dataRef={item}
          />
        )
      }
    })
  }

  renderSelectBoardTreeList = () => {
    const { allOrgBoardTreeList = [] } = this.props
    const boardTreeData = this.getBoardTreeData(allOrgBoardTreeList)
    if (boardTreeData.length == 0) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            height: '50px',
            lineHeight: '48px',
            overflow: 'hidden',
            color: 'rgba(0, 0, 0, 0.25)'
          }}
          className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}
        >
          ??????????????????
        </div>
      )
    }
    return (
      <>
        <div
          style={{ backgroundColor: '#FFFFFF' }}
          className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}
        >
          <Tree
            blockNode={true}
            defaultExpandAll
            //defaultSelectedKeys={['0-0-0']}

            onSelect={this.onSelectBoard}
          >
            {this.renderTreeNodes(boardTreeData)}
          </Tree>
        </div>
      </>
    )
  }

  renderSelectBoardFileTreeList = () => {
    const {
      boardFileTreeData = [],
      boardFolderTreeData = [],
      is_file_tree_loading
    } = this.props.simpleBoardCommunication
    const { is_selectFolder } = this.state
    // console.log('is_selectFolder', { boardFolderTreeData, boardFileTreeData });
    if (is_file_tree_loading) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            height: '50px',
            lineHeight: '48px',
            overflow: 'hidden',
            color: 'rgba(0, 0, 0, 0.25)'
          }}
          className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}
        >
          ???????????????
        </div>
      )
    }
    if (boardFileTreeData.length == 0 && boardFolderTreeData.length == 0) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            height: '50px',
            lineHeight: '48px',
            overflow: 'hidden',
            color: 'rgba(0, 0, 0, 0.25)'
          }}
          className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}
        >
          ??????????????????
        </div>
      )
    }
    return (
      <>
        <div
          style={{ backgroundColor: '#FFFFFF' }}
          className={`${globalStyles.page_card_Normal} ${indexStyles.directoryTreeWapper}`}
        >
          {is_selectFolder ? (
            <DirectoryTree onSelect={this.onSelectFolder}>
              {this.renderFolderTreeNodes([boardFolderTreeData])}
            </DirectoryTree>
          ) : (
            <DirectoryTree
              loadData={this.onLoadFileTreeData.bind(this)}
              onSelect={this.onSelectFile}
            >
              {this.renderTreeNodes(boardFileTreeData)}
            </DirectoryTree>
          )}
        </div>
      </>
    )
  }

  getDraggerProps = () => {
    return {
      name: 'file',
      multiple: false,
      withCredentials: true
    }
  }

  onDragEnterCapture = e => {
    // console.log("ssssss");
    this.setState({
      dragEnterCaptureFlag: true
    })
  }

  onDragLeaveCapture = e => {
    this.setState({
      dragEnterCaptureFlag: false
    })
  }

  handleOk = e => {
    // console.log(e);
    this.setState({
      selectBoardFileModalVisible: false
    })
  }

  handleCancel = e => {
    // console.log(e);
    this.initModalSelect()
  }

  // ??????/????????????????????????
  isShowFileList = () => {
    this.setState({ isVisibleFileList: !this.state.isVisibleFileList })
  }

  // ??????????????????????????????, ????????????????????????
  whetherUpdateFolderListData = type => {
    if (type === 'folder')
      this.getCommunicationFolderList(this.state.currentSelectBoardId, true)
    else this.getThumbnailFilesData()
    // if (folder_id) {
    //     this.getFolderFileList({ id: folder_id })
    // }
  }

  //

  // ??????????????????
  showUpdatedFileDetail = () => {
    // this.setState({ previewFileModalVisibile: true});
    this.setState({
      isVisibleFileList: false,
      showFileListisOpenFileDetailModal: true
    })
    this.setPreviewFileModalVisibile()
  }

  // ??????????????????
  hideUpdatedFileDetail = () => {
    this.setState({
      isVisibleFileList: true,
      showFileListisOpenFileDetailModal: false
    })
    this.setPreviewFileModalVisibile()
    this.getThumbnailFilesData()
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: '',
        fileType: '',
        isInOpenFile: false,
        filePreviewCurrentName: ''
      }
    })
    // lx_utils && lx_utils.setCommentData(null)
  }

  // ??????????????????keys
  setCollapseActiveKeys = keys => {
    // this.setState({ collapseActiveKeys: keys },()=>{
    const { dispatch, expandedKeys } = this.props
    // if(expandedKeys && expandedKeys.length){
    //     dispatch({
    //         type: getEffectOrReducerByName_8('updateDatas'),
    //         payload: {
    //             expandedKeys: null,
    //         }
    //     })
    // }

    this.setState({ currentSelectBoardId: keys }, () => {
      // console.log('keys_lalala', keys);
      // if(keys){
      this.getCommunicationFolderList(keys) // ???????????????????????????????????????
      // }
      openImChatBoard({ board_id: keys || '', autoOpenIm: true })
    })
  }

  // ??????????????????tab-????????????/????????????
  changeChooseType = type => {
    // console.log('????????????:', type);
    this.setState(
      {
        currentFileDataType: type
      },
      () => {
        const { currentSearchValue } = this.props
        if (type == '0') {
          this.goAllFileStatus()
        } else {
          this.searchCommunicationFilelist()
        }
      }
    )
  }

  // ???????????????????????????
  genVisitContorlData = (originData = {}) => {
    // ????????????????????????
    const isEmptyObj = obj => !Object.getOwnPropertyNames(obj).length
    if (isEmptyObj(originData)) {
      return {}
    }
    const {
      type,
      folder_name,
      file_name,
      is_privilege,
      privileges = [],
      privileges_extend = [],
      id
      // child_privilegeuser_ids
    } = originData
    const fileTypeName = type == '1' ? '?????????' : '??????'
    const fileOrFolderName = type == '1' ? folder_name : file_name
    const genVisitControlOtherPersonOperatorMenuItem = type => {
      if (type == '1') {
        return [
          {
            key: '?????????',
            value: 'read'
          },
          {
            key: '?????????',
            value: 'edit'
          },
          {
            key: '??????',
            value: 'remove',
            style: {
              color: '#f73b45'
            }
          }
        ]
      }
      if (type == '2') {
        return [
          {
            key: '?????????',
            value: 'read'
          },
          {
            key: '?????????',
            value: 'edit'
          },
          {
            key: '?????????',
            value: 'comment'
          },
          {
            key: '??????',
            value: 'remove',
            style: {
              color: '#f73b45'
            }
          }
        ]
      }
      return []
    }
    const visitControlOtherPersonOperatorMenuItem = genVisitControlOtherPersonOperatorMenuItem(
      type
    )

    /** ?????????????????? */
    const notRepeatPrivileges = []
    const obj = {}
    privileges.forEach(item => {
      if (!obj[item.id]) {
        notRepeatPrivileges.push(item)
        obj[item.id] = true
      }
    })

    return {
      // child_privilegeuser_ids,
      id,
      fileTypeName,
      fileOrFolderName,
      visitControlOtherPersonOperatorMenuItem,
      is_privilege,
      privileges: notRepeatPrivileges,
      privileges_extend,
      removeMemberPromptText:
        type === '1'
          ? '??????????????????????????????????????????'
          : '???????????????????????????????????????'
    }
  }
  // ????????????
  toggleVisitControlModal = (flag, item) => {
    console.log(flag, item)
    this.setState({
      currentValue: item,
      visitControlModalVisible: flag,
      currentVisitControlModalVisibleItem: item ? item.id : ''
    })
  }
  /**
   * ???????????????????????????
   * @param {Boolean} flag ????????????
   */
  handleVisitControlChange = flag => {
    if (this.isTheSameVisitControlState(flag)) {
      return
    }
    this.handleToggleContentPrivilege(flag)
  }
  isTheSameVisitControlState = flag => {
    const toBool = str => !!Number(str)
    const is_privilege_bool = toBool(this.state.currentValue.is_privilege)
    if (flag == is_privilege_bool) {
      return true
    }
    return false
  }
  /**
   * ???????????????????????????
   * @param {Boolean} flag ????????????
   */
  handleToggleContentPrivilege = flag => {
    const _this = this
    // const {
    // getFolderFileList,
    // updateParentFileStateData
    // } = this.props
    const itemValue = this.state.currentValue
    const current_folder_id = this.state.currentFolderId
    const dataType = this.getVisitControlModalDataType()
    const data = {
      content_id:
        dataType == 'file' ? itemValue.version_id : itemValue.folder_id,
      content_type: dataType == 'file' ? 'file' : 'folder',
      is_open: flag ? 1 : 0
    }
    toggleContentPrivilege(data).then(res => {
      const resOk = res => res && res.code == '0'
      if (resOk(res)) {
        setTimeout(() => {
          message.success('????????????')
        }, 500)
        this.whetherUpdateFolderListData(dataType)
        // getFolderFileList({ id: current_folder_id })
      } else {
        message.warning(res.message)
      }
    })
  }
  // ????????????????????????????????????????????
  getVisitControlModalDataType = () => {
    return this.state.currentValue?.type == '1' ? 'folder' : 'file'
  }
  /**
   * ?????????????????????
   * @param {Array} users_arr ?????????????????????
   */
  handleVisitControlAddNewMember = (users_arr = [], roles = []) => {
    if (!users_arr.length && !roles.length) return
    this.handleSetContentPrivilege(users_arr, roles, 'read')
  }
  // ????????????????????????
  handleSetContentPrivilege = (
    users_arr = [],
    roles = [],
    type,
    errorText = '????????????????????????????????????????????????'
  ) => {
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { user_id } = user_set
    const itemValue = this.state.currentValue
    const current_folder_id = this.state.currentFolderId
    const dataType = this.getVisitControlModalDataType()
    const content_id =
      dataType == 'file' ? itemValue.version_id : itemValue.folder_id
    const content_type = dataType == 'file' ? 'file' : 'folder'
    const privilege_code = type
    let temp_ids = [] // ???????????????????????????id
    let new_ids = [] // ?????????????????????????????????id
    let new_privileges = [...itemValue.privileges]
    // ???????????????????????????id??????
    users_arr &&
      users_arr.map(item => {
        temp_ids.push(item.id)
      })
    let flag
    // ??????????????????id
    new_privileges =
      new_privileges &&
      new_privileges.map(item => {
        let { id } = (item && item.user_info && item.user_info) || {}
        if (user_id == id) {
          // ??????????????????????????????
          if (temp_ids.indexOf(id) != -1) {
            // ???????????????????????????????????????
            flag = true
          }
        }
        new_ids.push(id)
      })
    // ?????????????????????????????????????????????????????????
    if (flag && temp_ids.length == '1') {
      // ????????????????????????, ???????????????
      message.warn('??????????????????, ?????????????????????', MESSAGE_DURATION_TIME)
      return false
    } else {
      // ???????????????????????????, ???????????????
      temp_ids =
        temp_ids &&
        temp_ids.filter(item => {
          if (new_ids.indexOf(item) == -1) {
            return item
          }
        })
    }
    if (!roles.length && !temp_ids.length) return
    setContentPrivilege({
      content_id,
      content_type,
      role_ids: roles.map(item => item.id),
      privilege_code,
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code == '0') {
        setTimeout(() => {
          message.success('??????????????????')
        }, 500)
        this.setState({
          currentValue: {
            ...this.state.currentValue,
            privileges: [].concat(this.state.currentValue.privileges, res.data)
          }
        })
        this.whetherUpdateFolderListData(content_type)
        // getFolderFileList({ id: current_folder_id })
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * ????????????????????????
   * @param {String} id ?????????????????????id
   */
  handleVisitControlRemoveContentPrivilege = id => {
    const { current_folder_id } = this.props
    removeContentPrivilege({
      id: id
    }).then(res => {
      const isResOk = res => res && res.code == '0'
      if (isResOk(res)) {
        setTimeout(() => {
          message.success('??????????????????')
        }, 500)
        this.whetherUpdateFolderListData(this.getVisitControlModalDataType())
        // getFolderFileList({ id: current_folder_id })
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * ???????????????????????????
   * @param {String} id ???????????????user_id
   * @param {String} type ???????????????????????????
   * @param {String} removeId ???????????????????????????id
   */
  handleClickedOtherPersonListOperatorItem = (
    id,
    type,
    removeId,
    user_type
  ) => {
    if (type == 'remove') {
      this.handleVisitControlRemoveContentPrivilege(removeId)
    } else {
      this.handleVisitControlChangeContentPrivilege(
        id,
        type,
        user_type,
        '??????????????????????????????'
      )
    }
  }
  /**
   * ??????????????????????????????
   * @param {String} id ?????????????????????id
   * @param {String} type ???????????????????????????
   */
  handleVisitControlChangeContentPrivilege = (
    id,
    type,
    user_type,
    errorText
  ) => {
    const itemValue = this.state.currentValue
    // const { current_folder_id, getFolderFileList } = this.state
    const current_folder_id = this.state.currentFolderId
    const { version_id, belong_folder_id, id: folder_id } = itemValue
    const dataType = this.getVisitControlModalDataType()
    const content_id = dataType == 'file' ? version_id : itemValue.folder_id
    const content_type = dataType == 'file' ? 'file' : 'folder'
    const privilege_code = type
    let param = {}
    if (user_type === ROLETYPEID) {
      param = { role_ids: [id] }
    } else param = { user_ids: [id] }
    setContentPrivilege({
      content_id,
      content_type,
      privilege_code,
      ...param
    }).then(res => {
      if (res && res.code == '0') {
        setTimeout(() => {
          message.success('????????????')
        }, 500)
        this.setState({
          currentValue: {
            ...this.state.currentValue,
            privileges: (this.state.currentValue.privileges || []).map(item => {
              if (item.id === res.data[0].id) {
                return res.data[0]
              }
              return item
            })
          }
        })
        this.whetherUpdateFolderListData(content_type)
        // getFolderFileList({ id: current_folder_id })
      } else {
        message.warning(res.message)
      }
    })
  }
  // ???????????????????????????
  handleVisitControlModalCancel = () => {
    // const { getFolderFileList, current_folder_id } = this.props
    // const calback = () => {
    // getFolderFileList({ id: current_folder_id })
    // }
    this.toggleVisitControlModal(false)
  }
  // ??????????????????
  renderVisitControlContent = () => {
    const {
      id,
      removeMemberPromptText,
      is_privilege,
      privileges = [],
      privileges_extend = [],
      fileTypeName,
      fileOrFolderName,
      visitControlOtherPersonOperatorMenuItem
    } = this.genVisitContorlData(this.state.currentValue)
    const new_projectParticipant =
      privileges_extend && privileges_extend.length
        ? arrayNonRepeatfy([].concat(...privileges_extend))
        : []
    const {
      currentVisitControlModalVisibleItem,
      visitControlModalVisible
    } = this.state
    return (
      <div id={id} onClick={e => e && e.stopPropagation()}>
        <Modal
          title={null}
          width={400}
          footer={null}
          destroyOnClose={true}
          visible={
            visitControlModalVisible &&
            id == currentVisitControlModalVisibleItem
          }
          maskClosable={false}
          onCancel={this.handleVisitControlModalCancel}
          getContainer={
            document.getElementById('process_file_detail_container')
              ? () => document.getElementById('process_file_detail_container')
              : ''
          }
        >
          <div
            style={{
              paddingTop: '54px',
              marginLeft: '-7px',
              marginRight: '-5px'
            }}
          >
            <VisitControl
              onlyShowPopoverContent={true}
              isPropVisitControl={is_privilege == '0' ? false : true}
              principalInfo="??????????????????"
              principalList={
                this.getVisitControlModalDataType() == 'folder'
                  ? new_projectParticipant
                  : []
              }
              // notShowPrincipal={
              //   this.getVisitControlModalDataType() == 'file' ? true : false
              // }
              // ??????????????????
              loadRoleData={true}
              // ?????????????????????????????????
              hideSelectFromGroupOrBoard={false}
              isPropVisitControlKey={is_privilege}
              otherPrivilege={privileges}
              otherPersonOperatorMenuItem={
                visitControlOtherPersonOperatorMenuItem
              }
              removeMemberPromptText={removeMemberPromptText}
              handleVisitControlChange={this.handleVisitControlChange}
              handleAddNewMember={this.handleVisitControlAddNewMember}
              handleClickedOtherPersonListOperatorItem={
                this.handleClickedOtherPersonListOperatorItem
              }
            />
          </div>
        </Modal>
      </div>
    )
  }
  render() {
    const {
      // currentBoardDetail = {},
      // dispatch, model = {},
      // modal,
      // simplemodeCurrentProject,
      // communicationProjectListData,
      // communicationSubFolderData,
      currentLayerSelectedStyle,
      isAddNewFolder
    } = this.props
    const {
      // currentfile = {},
      // is_selectFolder,
      // dragEnterCaptureFlag,
      // showFileSelectDropdown,
      // selectBoardFileModalVisible,
      showFileListisOpenFileDetailModal,
      isVisibleFileList,
      bread_paths,
      currentSelectBoardId,
      currentItemLayerId,
      isSearchDetailOnfocusOrOnblur,
      collapseActiveKeys,
      currentFileschoiceTab,
      currentSearchValue,
      currentFileDataType,
      currentFolderId,
      visitControlModalVisible
    } = this.state
    // const container_workbenchBoxContent = document.getElementById('container_workbenchBoxContent');
    // const zommPictureComponentHeight = container_workbenchBoxContent ? container_workbenchBoxContent.offsetHeight - 60 - 10 : 600; //60????????????????????????????????? 50?????????padding
    // const zommPictureComponentWidth = container_workbenchBoxContent ? container_workbenchBoxContent.offsetWidth - 419 - 50 - 5 : 600; //60??????????????????????????????????????????   50?????????padding
    // const zommPictureComponentWidth = container_workbenchBoxContent ? container_workbenchBoxContent.offsetWidth - 50 - 5 : 600; //60????????????????????????s??????????????????   50?????????padding

    // const CreateTaskProps = {
    //     modal,
    //     model,
    //     getBoardMembers(payload) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('getBoardMembers'),
    //             payload: payload
    //         })
    //     },
    //     getCardDetail(payload) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('getCardDetail'),
    //             payload: payload
    //         })
    //     },
    //     updateTaskDatas(payload) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('updateDatas'),
    //             payload: payload
    //         })
    //     },
    //     deleteTaskFile(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteTaskFile'),
    //             payload: data,
    //         })
    //     },
    //     addTaskGroup(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addTaskGroup'),
    //             payload: data,
    //         })
    //     },
    //     deleteTaskGroup(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteTaskGroup'),
    //             payload: data,
    //         })
    //     },
    //     updateTaskGroup(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('updateTaskGroup'),
    //             payload: data,
    //         })
    //     },
    //     getTaskGroupList(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('getTaskGroupList'),
    //             payload: data
    //         })
    //     },
    //     addTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addTask'),
    //             payload: data
    //         })
    //     },
    //     updateTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('updateTask'),
    //             payload: data
    //         })
    //     },
    //     deleteTask(id) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteTask'),
    //             payload: {
    //                 id
    //             }
    //         })
    //     },
    //     updateChirldTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('updateChirldTask'),
    //             payload: data
    //         })
    //     },
    //     deleteChirldTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteChirldTask'),
    //             payload: data
    //         })
    //     },

    //     archivedTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('archivedTask'),
    //             payload: data
    //         })
    //     },
    //     changeTaskType(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('changeTaskType'),
    //             payload: data
    //         })
    //     },
    //     addChirldTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addChirldTask'),
    //             payload: data
    //         })
    //     },
    //     addTaskExecutor(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addTaskExecutor'),
    //             payload: data
    //         })
    //     },
    //     removeTaskExecutor(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('removeTaskExecutor'),
    //             payload: data
    //         })
    //     },
    //     completeTask(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('completeTask'),
    //             payload: data
    //         })
    //     },
    //     addTaskTag(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addTaskTag'),
    //             payload: data
    //         })
    //     },
    //     removeTaskTag(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('removeTaskTag'),
    //             payload: data
    //         })
    //     },
    //     removeProjectMenbers(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('removeProjectMenbers'),
    //             payload: data
    //         })
    //     },
    //     getCardCommentList(id) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('getCardCommentList'),
    //             payload: {
    //                 id
    //             }
    //         })
    //     },
    //     addCardNewComment(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('addCardNewComment'),
    //             payload: data
    //         })
    //     },
    //     deleteCardNewComment(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteCardNewComment'),
    //             payload: data
    //         })
    //     },
    //     getBoardTagList(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('getBoardTagList'),
    //             payload: data
    //         })
    //     },
    //     updateBoardTag(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('updateBoardTag'),
    //             payload: data
    //         })
    //     },
    //     toTopBoardTag(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('toTopBoardTag'),
    //             payload: data
    //         })
    //     },
    //     deleteBoardTag(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_4('deleteBoardTag'),
    //             payload: data
    //         })
    //     }
    // }
    // const FileModuleProps = {
    //     modal,
    //     model,
    //     updateFileDatas(payload) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('updateDatas'),
    //             payload: payload
    //         })
    //     },
    //     getFileList(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName('getFileList'),
    //             payload: params
    //         })
    //     },
    //     fileCopy(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileCopy'),
    //             payload: data
    //         })
    //     },
    //     fileDownload(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileDownload'),
    //             payload: params
    //         })
    //     },
    //     fileRemove(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileRemove'),
    //             payload: data
    //         })
    //     },
    //     fileMove(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileMove'),
    //             payload: data
    //         })
    //     },
    //     fileUpload(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileUpload'),
    //             payload: data
    //         })
    //     },
    //     fileVersionist(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('fileVersionist'),
    //             payload: params
    //         })
    //     },
    //     recycleBinList(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('recycleBinList'),
    //             payload: params
    //         })
    //     },
    //     deleteFile(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('deleteFile'),
    //             payload: data
    //         })
    //     },
    //     restoreFile(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('restoreFile'),
    //             payload: data
    //         })
    //     },
    //     getFolderList(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('getFolderList'),
    //             payload: params
    //         })
    //     },
    //     addNewFolder(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('addNewFolder'),
    //             payload: data
    //         })
    //     },
    //     updateFolder(data) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('updateFolder'),
    //             payload: data
    //         })
    //     },
    //     filePreview(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('filePreview'),
    //             payload: params
    //         })
    //     },
    //     getPreviewFileCommits(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('getPreviewFileCommits'),
    //             payload: params
    //         })
    //     },
    //     addFileCommit(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('addFileCommit'),
    //             payload: params
    //         })
    //     },
    //     deleteCommit(params) {
    //         dispatch({
    //             type: getEffectOrReducerByName_5('deleteCommit'),
    //             payload: params
    //         })
    //     },
    // }
    // const updateDatasTask = (payload) => {
    //     dispatch({
    //         type: getEffectOrReducerByName_4('updateDatas'),
    //         payload: payload
    //     })
    // }
    // const updateDatasFile = (payload) => {
    //     dispatch({
    //         type: getEffectOrReducerByName_5('updateDatas'),
    //         payload: payload
    //     })
    // }
    // const fileDetailModalDatas = {
    //     ...this.props,
    //     ...CreateTaskProps,
    //     ...FileModuleProps,
    //     showFileListisOpenFileDetailModal,
    //     updateDatasTask,
    //     updateDatasFile,
    //     model,
    //     modal,
    // }

    return (
      <div
        className={`${indexStyles.boardCommunicationWapper}`}
        onDragOverCapture={this.onDragEnterCapture.bind(this)}
        onDragLeaveCapture={this.onDragLeaveCapture.bind(this)}
        onDragEndCapture={this.onDragLeaveCapture.bind(this)}
      >
        {/* ??????-?????????????????????/?????? */}
        {!this.state.previewFileModalVisibile && (
          <CommunicationFirstScreenHeader
            bread_paths={bread_paths}
            currentSelectBoardId={currentSelectBoardId}
            currentSearchValue={currentSearchValue}
            currentItemLayerId={currentItemLayerId}
            isShowSearchOperationDetail={this.isShowSearchOperationDetail}
            getThumbnailFilesData={this.getThumbnailFilesData}
            searchCommunicationFilelist={this.searchCommunicationFilelist}
            goAllFileStatus={this.goAllFileStatus}
            // setBreadPaths={this.setBreadPaths}
            {...this.props}
          />
        )}

        {/* ????????????????????????????????????????????? */}
        <div
          className={indexStyles.operationBtn}
          style={{ left: isVisibleFileList ? '299px' : '0' }}
          onClick={this.isShowFileList}
        >
          <Icon type={isVisibleFileList ? 'left' : 'right'} />
        </div>
        {/* ??????-????????????Tree???????????? */}
        {isVisibleFileList && (
          <CommunicationTreeList
            // communicationProjectListData={communicationProjectListData}
            // communicationSubFolderData={communicationSubFolderData}
            onSelectTree={this.onSelectTree}
            getCommunicationFolderList={this.getCommunicationFolderList}
            queryCommunicationFileData={this.queryCommunicationFileData}
            showUpdatedFileDetail={this.showUpdatedFileDetail}
            hideUpdatedFileDetail={this.hideUpdatedFileDetail}
            isVisibleFileList={isVisibleFileList}
            isShowFileList={this.isShowFileList}
            collapseActiveKeys={collapseActiveKeys}
            onSelectBoard={this.onSelectBoard}
            setCollapseActiveKeys={this.setCollapseActiveKeys}
            currentItemLayerId={currentItemLayerId}
            currentFileDataType={currentFileDataType}
            currentSelectBoardId={currentSelectBoardId}
            toggleVisitControlModal={this.toggleVisitControlModal}
            currentFolderId={currentFolderId}
            currentLayerSelectedStyle={currentLayerSelectedStyle}
            {...this.props}
          />
        )}

        {/* ??????-???????????????????????? */}
        {!this.state.previewFileModalVisibile && (
          <CommunicationThumbnailFiles
            isVisibleFileList={isVisibleFileList}
            currentSelectBoardId={currentSelectBoardId}
            currentItemLayerId={currentItemLayerId}
            current_folder_id={currentFolderId}
            bread_paths={bread_paths}
            toggleVisitControlModal={this.toggleVisitControlModal}
            isSearchDetailOnfocusOrOnblur={isSearchDetailOnfocusOrOnblur}
            getThumbnailFilesData={this.getThumbnailFilesData}
            updataApiData={this.updataApiData}
            showUpdatedFileDetail={this.showUpdatedFileDetail}
            previewFile={this.previewFile}
            setPreviewFileModalVisibile={this.showUpdatedFileDetail}
            goAllFileStatus={this.goAllFileStatus}
            currentFileschoiceTab={currentFileschoiceTab}
            currentFileDataType={currentFileDataType}
            changeChooseType={this.changeChooseType}
            {...this.props}
          />
        )}

        {/* ??????????????????(1025??????) */}
        {/* <CommunicationFileList
                    queryCommunicationFileData={this.queryCommunicationFileData}
                    showUpdatedFileDetail={this.showUpdatedFileDetail}
                    // setPreviewFileModalVisibile={this.hideUpdatedFileDetail}
                    hideUpdatedFileDetail={this.hideUpdatedFileDetail}
                    isVisibleFileList={isVisibleFileList}
                    isShowFileList={this.isShowFileList}
                    {...this.props}
                /> */}

        {/* ???????????????????????????????????? */}
        {showFileListisOpenFileDetailModal && (
          <FileListRightBarFileDetailModal
            filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
            fileType={this.props.fileType}
            file_detail_modal_visible={this.state.previewFileModalVisibile}
            filePreviewCurrentName={this.props.filePreviewCurrentName}
            setPreviewFileModalVisibile={this.showUpdatedFileDetail}
            whetherUpdateFolderListData={this.whetherUpdateFolderListData}
            // updateCommunicationFolderListData={this.updateCommunicationFolderListData}
            hideUpdatedFileDetail={this.hideUpdatedFileDetail}
          />
        )}
        {visitControlModalVisible && <>{this.renderVisitControlContent()}</>}
        {/* {
                    showFileListisOpenFileDetailModal && (
                        <FileListRightBarFileDetailModal
                            {...this.props}
                            {...fileDetailModalDatas}
                            showFileListisOpenFileDetailModal={showFileListisOpenFileDetailModal}
                            setPreviewFileModalVisibile={this.hideUpdatedFileDetail}
                            modalVisible={fileDetailModalDatas.previewFileModalVisibile}
                            // setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
                            updateDatasTask={fileDetailModalDatas.updateDatasTask}
                            updateDatasFile={fileDetailModalDatas.updateDatasFile}
                            whetherUpdateFolderListData={this.whetherUpdateFolderListData}
                            updateCommunicationFolderListData={this.updateCommunicationFolderListData}
                        />
                    )
                } */}

        {/* ????????????????????????????????????1025?????????????????? */}
        {/* {
                    this.state.previewFileModalVisibile && (
                        <FileDetail
                            {...this.props}
                            updateDatasFile={this.updateDatasFile}
                            updatePublicDatas={this.updatePublicDatas}
                            {...this.getFileModuleProps()}
                            offsetTopDeviation={85}
                            modalTop={0}
                            setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}
                            componentHeight={zommPictureComponentHeight}
                            componentWidth={zommPictureComponentWidth} />
                    )
                } */}

        {/* ????????????/????????????????????????????????????????????????????????? */}
        {/* {
                    !this.state.previewFileModalVisibile && (
                        <UploadTemporaryFile
                            isVisibleFileList={isVisibleFileList}
                            //
                            getDraggerProps={this.getDraggerProps}
                            onBeforeUpload={this.onBeforeUpload}
                            dragEnterCaptureFlag={dragEnterCaptureFlag}
                            //
                            simplemodeCurrentProject={simplemodeCurrentProject}
                            currentBoardId = {this.props.gantt_board_id}
                        />
                    )
                } */}

        {/* ?????????????????????1025???????????? */}
        {/* {
                    !this.state.previewFileModalVisibile && (
                        <div className={`${indexStyles.draggerContainerStyle} ${isVisibleFileList ? indexStyles.changeDraggerWidth : null}`}>
                            <Dragger multiple={false} {...this.getDraggerProps()} beforeUpload={this.onBeforeUpload}>
                                <div className={`${indexStyles.indexCoverWapper} ${dragEnterCaptureFlag ? indexStyles.draging : ''}`}>

                                    {
                                        dragEnterCaptureFlag ? (
                                            <div className={indexStyles.iconDescription}>
                                                <img src={uploadIconSrc} style={{ width: '48px', height: '48px' }} />
                                                <span className={indexStyles.iconDescription}>????????????????????????????????????</span>
                                            </div>
                                        ) : (
                                                <>
                                                    <div className={indexStyles.icon}>
                                                        <img src={coverIconSrc} style={{ width: '80px', height: '84px' }} />
                                                    </div>
                                                    <div className={indexStyles.descriptionWapper}>
                                                        <div className={indexStyles.linkTitle}>
                                                            // ?????? <a className={indexStyles.alink} onClick={this.selectBoardFile}>????????????</a> ???  //
                                                            <a className={indexStyles.alink}>????????????</a> ??????</div>
                                                        <div className={indexStyles.detailDescription}>????????????????????????????????????PDF????????????????????????????????????</div>
                                                    </div>
                                                </>
                                            )}

                                </div>
                            </Dragger>
                        </div>
                    )} */}

        {/* ??????????????????????????????1025???????????? */}
        {/* <Modal
                    width={248}
                    bodyStyle={{ padding: '0px' }}
                    footer={
                        <div style={{ width: '100%' }}>
                            {
                                !is_selectFolder && <Button type="primary" disabled={this.state.selectBoardFileCompleteDisabled} style={{ width: '100%' }} onClick={this.openFileModal}>??????</Button>
                            }
                            {
                                is_selectFolder && <Button type="primary" disabled={this.state.selectBoardFileCompleteDisabled} style={{ width: '100%' }} onClick={this.handleUpload}>????????????</Button>
                            }

                        </div>
                    }
                    title={<div style={{ textAlign: 'center' }}>{is_selectFolder ? '?????????????????????' : '????????????'}</div>}
                    visible={this.state.selectBoardFileModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {
                        this.state.selectBoardFileModalVisible && (
                            <div>
                                <div className={`${indexStyles.selectWapper} ${indexStyles.borderBottom}`}>
                                    <Dropdown
                                        overlay={this.renderSelectBoardTreeList()}
                                        trigger={['click']}
                                        className={`${indexStyles.dropdownSelect}`}
                                        onVisibleChange={this.handleSelectBoardDropdownVisibleChange}
                                        visible={this.state.selectBoardDropdownVisible}>
                                        <div className={indexStyles.dropdownLinkWapper}>
                                            <span style={{ display: 'block', width: '28px' }}>??????</span>
                                            <span className={indexStyles.dropdownLink}>
                                                {currentBoardDetail.board_id ? currentBoardDetail.board_name : '?????????'} <Icon type="down" />
                                            </span>
                                        </div>
                                    </Dropdown>
                                </div>

                                <div className={indexStyles.selectWapper}>
                                    <Dropdown
                                        disabled={!currentBoardDetail || !currentBoardDetail.board_id}
                                        overlay={this.renderSelectBoardFileTreeList()}
                                        trigger={['click']}
                                        className={`${indexStyles.dropdownSelect}`}
                                        onVisibleChange={this.handleSelectBoardFileDropdownVisibleChange}
                                        visible={this.state.selectBoardFileDropdownVisible}>
                                        <div className={indexStyles.dropdownLinkWapper}>
                                            {is_selectFolder ?
                                                <span style={{ display: 'block', width: '44px' }}>?????????</span>
                                                :
                                                <span style={{ display: 'block', width: '28px' }}>??????</span>
                                            }

                                            <span className={indexStyles.dropdownLink}>
                                                {currentfile.fileId ? currentfile.fileName : '?????????'} <Icon type="down" />
                                            </span>
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>

                        )
                    }

                </Modal> */}
      </div>
    )
  }
}

function mapStateToProps({
  // workbenchFileDetail,
  // workbenchTaskDetail,
  // workbenchDetailProcess,
  simpleWorkbenchbox: { boardListData, currentBoardDetail, boardFileListData },
  simplemode: { allOrgBoardTreeList, simplemodeCurrentProject },
  simpleBoardCommunication,
  workbench: {
    datas: { projectList }
  },
  // workbenchPublicDatas,
  gantt: {
    datas: { gantt_board_id, boards_flies = [] }
  },
  // gantt,
  projectCommunication: {
    currentBoardId,
    communicationProjectListData,
    communicationSubFolderData,
    rootDirectoryFolder_id,
    currentLayerSelectedStyle,
    isAddNewFolder
  },
  publicFileDetailModal: {
    filePreviewCurrentFileId,
    fileType,
    isInOpenFile,
    filePreviewCurrentName
  }
}) {
  // const modelObj = {
  //     datas: {
  //         // ...workbenchFileDetail['datas'],
  //         // ...workbenchPublicDatas['datas'],
  //         ...workbenchTaskDetail['datas'],
  //         ...workbenchFileDetail['datas'],
  //         ...workbenchDetailProcess['datas'],
  //         ...workbenchPublicDatas['datas'],
  //         ...gantt['datas']
  //     }
  // }
  return {
    // model: modelObj,
    allOrgBoardTreeList,
    projectList,
    boardListData,
    currentBoardDetail,
    boardFileListData,
    simpleBoardCommunication,
    simplemodeCurrentProject,
    gantt_board_id,
    currentBoardId,
    communicationProjectListData,
    communicationSubFolderData,
    boards_flies,
    rootDirectoryFolder_id,
    currentLayerSelectedStyle,
    filePreviewCurrentFileId,
    fileType,
    isInOpenFile,
    filePreviewCurrentName,
    isAddNewFolder
  }
}
export default connect(mapStateToProps)(BoardCommunication)
