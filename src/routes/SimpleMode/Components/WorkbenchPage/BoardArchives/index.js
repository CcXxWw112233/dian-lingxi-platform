import React, { Component } from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  getSubfixName,
  openPDF, setBoardIdStorage, getOrgNameWithOrgIdFilter,
  isPaymentOrgUser,
  selectBoardToSeeInfo
} from "../../../../../utils/businessFunction";
import BoarderfilesHeader from '@/routes/Technological/components/ProjectDetail/BoarderfilesHeader'
import { setShowSimpleModel } from '../../../../../services/technological/organizationMember';
import CommunicationFirstScreenHeader from '../BoardCommunication/components/FirstScreen/CommunicationFirstScreenHeader';
import CatalogTables from './CatalogTables'
import { getGanttBoardsFiles } from '../../../../../services/technological/gantt';
import { isApiResponseOk } from '../../../../../utils/handleResponseData';
import { message } from 'antd';
import { getArchivesBoards } from '../../../../../services/technological/project';
import { getFileList } from '../../../../../services/technological/file';
import FileDetailModal from '@/components/FileDetailModal'

class BoardArchives extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bread_paths: [], // 面包屑路径
      data_source: [], //列表数据
      isSearchDetailOnfocusOrOnblur: false, // 搜索框聚焦显示当前搜索条件详情
      currentSearchValue: '', // 搜索框输入值
      currentFileDataType: '0', // 当前文件数据类型 '0' 全部文件 '1' 项目下全部文件 '2' 文件夹下全部文件
      currentSelectBoardId: '0',
      currentFolderId: '',
      view_type: '0', //0项目视图 1文件列表视图, 2混合视图
    }
    this.timer = null
  }
  componentDidMount() {
    const params = {
      _organization_id: localStorage.getItem('OrganizationId'),
    }
    this.getArchivesList(params)
    // this.getFList()
  }

  setBreadPaths = ({ path_item = {} }) => { //面包屑设置路径
    const { bread_paths = [] } = this.state
    const { id } = path_item
    let new_bread_paths = []
    const index = bread_paths.findIndex(item => item.id == id)
    if (index == -1) { //如果路径中不包含就往后添加
      new_bread_paths = [].concat(bread_paths, [path_item])
    } else { //
      new_bread_paths = bread_paths.slice(0, index + 1)
    }
    this.setState({
      bread_paths: new_bread_paths
    })
    const length = new_bread_paths.length
    if (length == 0) {

    } else if (length == 1) {
      this.getFList({ folder_id: '1255070691447934978' })
    } else {
      this.getFList({ folder_id: new_bread_paths[length - 1].folder_id })
    }
  }
  // 请求位置------------start
  getArchivesList = (params) => { //获取归档的列表
    getArchivesBoards(params).then(res => {
      if (isApiResponseOk(res)) {
        const data_source = res.data.map(item => {
          const new_item = { ...item }
          const { type, board_id, folder_id, file_id, id, board_name, file_name, folder_name, name } = item // type undefine/1,2 项目/文件夹/文件
          if (type == '1') {
            new_item.name = name || folder_name
            new_item.id = id || folder_id
          } else if (type == '2') {
            new_item.name = name || file_name
            new_item.id = id || file_id
          } else {
            new_item.name = name || board_name
            new_item.id = id || board_id
          }
          return new_item
        })
        this.setState({
          data_source
        })
      } else {
        message.error(res.message)
      }
    })
  }
  deleteDataSourceItem = (id) => {
    const { data_source = [] } = this.state
    this.setState({
      data_source: data_source.filter(item => item.id != id)
    })
  }
  getFList = ({ folder_id }) => {
    getFileList({
      folder_id: folder_id || '1255070691447934978',
      board_id: '1255070689694715904'
    }).then(res => {
      if (isApiResponseOk(res)) {
        const { file_data = [], folder_data = [] } = res.data
        const _folder_data = folder_data.map(item => { return { ...item, id: item.folder_id, name: item.folder_name } })
        const _file_data = file_data.map(item => { return { ...item, name: item.file_name } })

        const data_source = [].concat(_folder_data, _file_data)
        this.setState({
          data_source
        })
      }
    })
  }
  //请求位置--------------end
  setPreviewFileModalVisibile = () => {
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        isInOpenFile: false,
        filePreviewCurrentFileId: '',
        fileType: '',
        currentPreviewFileName: ''
      }
    })
  }


  // 处理传值
  getParams = () => {
    const {
      currentFileDataType, // currentFileDataType 0 全部（包括项目） 1 项目全部（包括文件夹内） 2 文件Tree的文件夹内
      currentSelectBoardId,
      // currentItemLayerId,
      currentFolderId,
      currentSearchValue, // 搜索关键字
    } = this.state;
    let boardId = '';
    let folderId = '';
    let queryConditions = "";
    switch (currentFileDataType) {
      case '0':
        boardId = '';
        folderId = '';
        queryConditions = "";
        break
      case '1':
        boardId = currentSelectBoardId;
        folderId = '';
        queryConditions = currentSelectBoardId ? [{ id: '1135447108158099461', value: currentSelectBoardId }] : null;
        break
      case '2':
        boardId = currentSelectBoardId;
        folderId = currentFolderId;
        queryConditions = [
          { id: '1135447108158099461', value: currentSelectBoardId },
          { id: '1192646538984296448', value: currentFolderId },
        ];
        break
      default:
        boardId = '';
        folderId = '';
        queryConditions = "";
        break
    }
    const params = {
      boardId,
      folderId,
      queryConditions,
      currentSearchValue,
    }
    return params;
  }
  // 触发搜索框，是否选择搜索详情
  isShowSearchOperationDetail = (value, searchValue) => {
    this.setState({
      isSearchDetailOnfocusOrOnblur: !!value,
      currentSearchValue: searchValue,
    }, () => {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.searchCommunicationFilelist();
      }, 300)
    });
  }
  // 获取右侧缩略图展示列表显示
  getThumbnailFilesData = (data = {}) => {
    // console.log('获取右侧缩略图显示');
    const { dispatch, simplemodeCurrentProject = {} } = this.props;
    const { board_id } = simplemodeCurrentProject
    const params = this.getParams();
    const { boardId, folderId } = params;
    // console.log('params......',params);

    // dispatch({
    //   type: getEffectOrReducerByName_8('getOnlyFileList'),
    //   payload: {
    //     board_id: board_id || boardId,
    //     folder_id: folderId,
    //   }
    // });
  }
  // 搜索
  searchCommunicationFilelist = () => {
    const { dispatch } = this.props;
    const params = this.getParams();
    const { boardId, folderId, queryConditions, currentSearchValue } = params;

    // dispatch({
    //   type: getEffectOrReducerByName_8('getSearchCommunicationFilelist'),
    //   payload: {
    //     board_id: boardId,
    //     folder_id: folderId,
    //     search_term: currentSearchValue, // 搜索关键字
    //     search_type: '6', // 搜索类型 '6' 文件类型（目前这里固定'6'，按文件类型搜索）
    //     query_conditions: queryConditions ? JSON.stringify(queryConditions) : null, // 原详细搜索附带条件
    //     page_size: 100,
    //     // page_number: 1,
    //   }
    // });
  }
  // 回到项目文件-全部文件展示状态
  goAllFileStatus = () => {
    // console.log('回到全部文件状态');
    // bread_paths: [], // 面包屑路径
    // currentItemIayerData: [], // 当前层数据
    // currentItemLayerId: '', // 当前层级ID
    // currentSelectBoardId: '', // 当前选择的项目ID
    // isSearchDetailOnfocusOrOnblur: false, // 搜索框聚焦显示当前搜索条件详情
    // currentFileDataType: '0', // 当前文件数据类型 '0' 全部文件 '1' 项目下全部文件 '2' 文件夹下全部文件
    // currentSearchValue: '', // 搜索框输入值

    // 待处理 

    this.setState({
      bread_paths: [],
      currentSearchValue: '',
      isSearchDetailOnfocusOrOnblur: false,
    }, () => {
      // this.queryCommunicationFileData();
      // this.getThumbnailFilesData();
      const params = {
        _organization_id: localStorage.getItem('OrganizationId'),
      }
      this.getArchivesList(params)
    });
  }
  // 搜索-全部文件/当前文件点击
  changeChooseType = (type, item) => {
    const { bread_paths } = this.props;
    console.log('currentIayerSearch', item);
    console.log('bread_paths', bread_paths);
    let tabType = '';
    if (type == 'all_files') {
      tabType = '0';
    } else if (type = "sub_files") {
      if (item.layerType == "projectLayer") {
        tabType = '1';
      } else {
        tabType = '2';
      }
    }
    this.setState({
      currentFileDataType: type,
    }, () => {
      if (type == '0') {
        this.goAllFileStatus();
      } else {
        this.searchCommunicationFilelist();
      }
    });
  }
  render() {
    const { workbenchBoxContent_height = 600, isInOpenFile, fileType, filePreviewCurrentFileId } = this.props
    const { currentSearchValue, bread_paths = [], isSearchDetailOnfocusOrOnblur, currentFileDataType, view_type, data_source = [] } = this.state
    const currentIayerFolderName = bread_paths && bread_paths.length && (bread_paths[bread_paths.length - 1].board_name || bread_paths[bread_paths.length - 1].folder_name);
    console.log('sssssssssss_data_source', isInOpenFile)
    return (
      <div className={indexStyles.main_out} style={{ height: workbenchBoxContent_height }}>
        <div className={indexStyles.main} >
          {/* 首屏-文件路径面包屑/搜索 */}
          {
            <CommunicationFirstScreenHeader
              disabled
              descriptionTitle={'档案'}
              bread_paths={bread_paths}
              currentSearchValue={currentSearchValue}
              isShowSearchOperationDetail={this.isShowSearchOperationDetail}
              getThumbnailFilesData={this.getThumbnailFilesData}
              searchCommunicationFilelist={this.searchCommunicationFilelist}
              goAllFileStatus={this.goAllFileStatus}
              setBreadPaths={this.setBreadPaths}
            />
          }
          {
            isSearchDetailOnfocusOrOnblur && (
              <div className={indexStyles.searchTypeBox}>
                搜索：
                <span
                  className={currentFileDataType == '0' ? indexStyles.currentFile : ''}
                  onClick={() => this.changeChooseType('all_files')} >
                  “全部文件”
                </span>
                {
                  currentIayerFolderName ? (
                    <span
                      className={currentFileDataType !== '0' ? indexStyles.currentFile : ''}
                      onClick={() => this.changeChooseType('sub_files', currentIayerSearch)}
                    >
                      {currentIayerFolderName}
                    </span>
                  ) :
                    ''
                }

              </div>
            )
          }
          <CatalogTables
            deleteDataSourceItem={this.deleteDataSourceItem}
            workbenchBoxContent_height={workbenchBoxContent_height}
            view_type={view_type}
            data_source={data_source}
            setBreadPaths={this.setBreadPaths} />
          {
            isInOpenFile && (
              <FileDetailModal
                fileType={fileType} filePreviewCurrentFileId={filePreviewCurrentFileId}
                file_detail_modal_visible={isInOpenFile}
                setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
              // whetherUpdateFolderListData={this.whetherUpdateFolderListData}
              />
            )
          }

        </div>
      </div>
    );
  }

}

function mapStateToProps({
  // modal, projectDetail, projectDetailTask, projectDetailFile, projectDetailProcess, loading,
  simpleWorkbenchbox: {
    boardListData,
    currentBoardDetail,
    boardFileListData
  },
  simplemode: {
    allOrgBoardTreeList,
    simplemodeCurrentProject
  },
  publicFileDetailModal: { isInOpenFile, fileType, filePreviewCurrentFileId },
  projectDetailFile: {
    datas: {
      selectedRowKeys
    }
  }
}) {
  return {
    selectedRowKeys,
    boardListData,
    currentBoardDetail,
    boardFileListData,
    allOrgBoardTreeList,
    simplemodeCurrentProject,
    isInOpenFile, fileType, filePreviewCurrentFileId,
  }
}
export default connect(mapStateToProps)(BoardArchives)


