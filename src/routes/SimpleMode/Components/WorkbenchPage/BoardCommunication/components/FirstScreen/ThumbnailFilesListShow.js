import React, { Component } from 'react'
import {
  filterFileFormatType,
  timestampToTime,
  timestampToTimeNormal
} from '@/utils/util'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  Button,
  Table,
  Tooltip,
  Popconfirm,
  message,
  Dropdown,
  Menu,
  Input
} from 'antd'
import styles from './CommunicationThumbnailFiles.less'
import { getSubfixName } from '@/utils/businessFunction.js'
import { fileReName } from '@/services/technological/file'

import { isApiResponseOk } from '../../../../../../../utils/handleResponseData'
import { fileRemove } from '../../../../../../../services/technological/file'
import CustormBadgeDot from '@/components/CustormBadgeDot'
import {
  cardItemIsHasUnRead,
  folderItemHasUnReadNo
} from '../../../../../../Technological/components/Gantt/ganttBusiness'
import { connect } from 'dva'
import DragProvider from '../../../../../../../components/DragProvider'

// @connect()
@connect(mapStateToProps)
class ThumbnailFilesListShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // currentFileschoiceType: 0, // "0 搜索全部文件 1 搜索子集文件
      // thumbnailFilesList: thumbnailFilesList, // 缩略图数据
      editting_file_id: ''
    }
    // this.setColumns()
  }
  getUnReadCount = ({
    type,
    id,
    im_all_latest_unread_messages,
    wil_handle_types
  }) =>
    folderItemHasUnReadNo({
      type,
      relaDataId: id,
      im_all_latest_unread_messages,
      wil_handle_types
    })
  previewFile = data => {
    const { id } = data
    const { isBatchOperation } = this.props
    const { input_folder_Id } = this.state
    if (input_folder_Id) {
      return
    }
    if (isBatchOperation) {
      this.props.addBatchOperationList(data)
      return
    }
    this.props.previewFile(data)
    // 设置已读
    const { im_all_latest_unread_messages, dispatch } = this.props
    if (
      cardItemIsHasUnRead({ relaDataId: id, im_all_latest_unread_messages })
    ) {
      dispatch({
        type: 'imCooperation/imUnReadMessageItemClear',
        payload: {
          relaDataId: id
        }
      })
    }
  }
  setColumns = props => {
    const {
      im_all_latest_unread_messages,
      wil_handle_types,
      isBatchOperation,
      fileSelectList
    } = props
    const { input_folder_Id } = this.state

    this.setState({
      columns: [
        {
          title: '文件名',
          dataIndex: 'file_name',
          key: 'file_name',
          render: (text, record, index) => {
            const { type, id } = record

            const isSelected = fileSelectList.some(function(currentValue) {
              return
              record.id == currentValue.id && record.type == currentValue.type
            })

            const getEllipsisFileName = name => {
              let str = name
              if (!name) return
              let arr = str.split('.')
              arr.splice(-1, 1)
              arr.join('.')
              return arr
            }
            if (!text) return
            // console.log(sssssssaaasd__', un_read_count)
            const un_read_count = this.getUnReadCount({
              im_all_latest_unread_messages,
              wil_handle_types,
              type,
              id
            })
            // console.log('sssssssaaasd__', un_read_count)
            // &#xe66a;
            return (
              <div
                className={styles.fileNameRow}
                onClick={() => this.previewFile(record)}
              >
                {record && record.thumbnail_url ? (
                  <div className={styles.imgBox}>
                    <img
                      crossOrigin="anonymous"
                      src={record.thumbnail_url || ''}
                      width="100px"
                      alt=""
                    />
                  </div>
                ) : (
                  <div
                    className={`${globalStyles.authTheme} ${styles.otherFile}`}
                    dangerouslySetInnerHTML={{
                      __html: filterFileFormatType(text)
                    }}
                  ></div>
                )}
                <span className={styles.folder_item}>
                  {input_folder_Id && input_folder_Id == id ? (
                    <span style={{ height: 25 }}>
                      <Input
                        style={{ height: 25 }}
                        className={styles.folder_input}
                        autoFocus
                        defaultValue={getEllipsisFileName(text)}
                        onChange={this.inputOnchange}
                        onPressEnter={e => this.inputOnPressEnter(record, e)}
                        onBlur={e => this.inputOnPressEnter(record, e)}
                      />
                    </span>
                  ) : (
                    <span
                      style={{
                        maxWidth: '500px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {getEllipsisFileName(text)}
                    </span>
                  )}
                  &nbsp;{getSubfixName(text)}
                  {input_folder_Id}
                  <CustormBadgeDot
                    show_dot={un_read_count > 0}
                    type={'showCount'}
                    count={un_read_count}
                    top={-4}
                    right={-6}
                  />
                </span>
                {/* <span>{text}</span> */}
              </div>
            )
          }
        },
        {
          title: '大小',
          dataIndex: 'file_size',
          key: 'file_size'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          render: (text, record, index) => {
            if (!text) return
            return (
              <div>
                {/* { timestampToTime(text, true)} */}
                {timestampToTimeNormal(text, '/', true)}
              </div>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          render: (text, record, index) => {
            // console.log('sssssssssssssaaaa', {
            //   text,
            //   record,
            //   index
            // })
            return this.renderKeyOperate(record)
          }
        }
      ]
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setColumns(nextProps)
  }
  componentDidMount() {
    this.setColumns(this.props)
    // this.initData();
  }

  // 初始化table数据
  // initData = () => {
  //     const { columns } = this.state;
  //     const newColumns = [];
  //     columns.forEach((item) => {
  //         if(item.file_name = 'file_name'){
  //             // item.render = this.renderItem(item);
  //             item.render = <div>
  //                 lalall-
  //                 {item.file_name}
  //             </div>
  //         }
  //     })
  // }

  // 处理缩略图
  // renderItem = (item) => {
  //     return(
  //         <div>
  //             lalall-
  //             {item.file_name}
  //         </div>
  //     )
  // }
  actionsManager = (action, itemValue) => {
    const { dispatch } = this.props
    const { file_resource_id, file_id, org_id, board_id, id, type } = itemValue
    const obj = {
      download: () => {
        dispatch({
          type: 'publicFileDetailModal/fileDownload',
          payload: {
            ids: file_resource_id,
            fileIds: file_id,
            _organization_id: org_id
          }
        })
      },
      delete: async () => {
        const params = {
          board_id,
          arrays: JSON.stringify([{ type, id }])
        }
        const { thumbnailFilesList = [] } = this.props
        const new_thumbnailFilesList = thumbnailFilesList.filter(
          item => item.id != id
        )
        const res = await fileRemove(params)
        if (isApiResponseOk(res)) {
          dispatch({
            type: 'projectCommunication/updateDatas',
            payload: {
              onlyFileList: new_thumbnailFilesList
            }
          })
          message.success('删除成功')
        } else {
          message.error(res.message)
        }
      }
    }
    obj[action]()
  }
  // 渲染菜单
  renderOperateItemDropMenu = item => {
    const { itemValue = {} } = this.props
    const { type } = itemValue
    return (
      <Menu onClick={e => this.menuItemClick(item, e)}>
        <Menu.Item key={1} style={{ width: 248 }}>
          <span style={{ fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 150 }}>
            <i className={`${globalStyles.authTheme}`} style={{ fontSize: 16 }}>
              &#xe86d;
            </i>{' '}
            重命名
          </span>
        </Menu.Item>
        <Menu.Item key={3}>
          <span style={{ fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 150 }}>
            <i className={`${globalStyles.authTheme}`} style={{ fontSize: 16 }}>
              &#xe86a;
            </i>{' '}
            访问控制
          </span>
        </Menu.Item>
      </Menu>
    )
  }
  menuItemClick = (a, e) => {
    const { key } = e
    switch (key) {
      case '1':
        this.setIsShowChange(true, a)
        break
      case '3':
        // setBoardIdStorage(this.props.itemValue.board_id)
        this.toggleVisitControlModal(true, a)
        break
      default:
        break
    }
  }
  toggleVisitControlModal = (flag, item) => {
    this.props.toggleVisitControlModal(true, item)
  }
  // 列表操作
  renderKeyOperate = item => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          paddingRight: 20
        }}
      >
        <Tooltip title={'下载'}>
          <div
            className={`${globalStyles.authTheme}  ${styles.table_operate}`}
            style={{ marginRight: 16 }}
            onClick={e => this.actionsManager('download', item, e)}
          >
            &#xe7f1;
          </div>
        </Tooltip>
        <Dropdown
          getPopupContainer={triggerNode => triggerNode.parentNode}
          overlay={this.renderOperateItemDropMenu(item)}
          trigger={['click']}
        >
          <div
            className={`${globalStyles.authTheme}  ${styles.table_operate}`}
            style={{ marginRight: 16 }}
            onClick={e => e.stopPropagation()}
          >
            &#xe7fd;
          </div>
        </Dropdown>
        <Popconfirm
          title={`确认删除吗？`}
          onConfirm={e => this.actionsManager('delete', item, e)}
          onCancel={e => e.stopPropagation()}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title={'删除'}>
            <div
              className={`${globalStyles.authTheme} ${globalStyles.link_mouse}  ${styles.table_operate}`}
              onClick={e => e.stopPropagation()}
            >
              &#xe7c3;
            </div>
          </Tooltip>
        </Popconfirm>
      </div>
    )
  }

  // 更改名称
  inputOnPressEnter = (item, e) => {
    this.requestUpdateFolder(item)
    this.setIsShowChange(false)
  }
  requestUpdateFolder(item) {
    const { input_folder_value } = this.state
    const { dispatch } = this.props
    if (input_folder_value == '' || input_folder_value == item.file_name) {
      return false
    }
    const params = {
      id: item.id,
      name: input_folder_value,
      board_id: item.board_id
    }
    // fileReName
    dispatch({
      type: 'projectCommunication/getFolderList',
      payload: params
    })
  }

  inputOnchange = e => {
    const { value } = e.target
    // if (value.trimLR() == '') {
    // 	message.warn('文件夹名称不能为空')
    // 	return false
    // }
    this.setState({
      input_folder_value: value
    })
  }
  setIsShowChange = (flag, item) => {
    this.setState({
      input_folder_Id: item ? item.file_id : ''
    })
    this.setColumns(this.props)
  }
  onSelectChange = selectedRowKeys => {
    const { dispatch, thumbnailFilesList } = this.props
    let result = []
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    for (let i = 0; i < selectedRowKeys.length; i++) {
      for (let j = 0; j < thumbnailFilesList.length; j++) {
        if (selectedRowKeys[i] === thumbnailFilesList[j].id) {
          let item = {
            type: thumbnailFilesList[j].type,
            id: thumbnailFilesList[j].id
          }
          result.push(item)
        }
      }
    }
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        selectedRowKeys: selectedRowKeys,
        fileSelectList: result
      }
    })
  }
  render() {
    const {
      thumbnailFilesList = [],
      onlyFileTableLoading,
      isSearchDetailOnfocusOrOnblur,
      isBatchOperation,
      fileSelectList,
      selectedRowKeys
    } = this.props
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }

    const { columns } = this.state
    // console.log('isSearchDetailOnfocusOrOnblur',isSearchDetailOnfocusOrOnblur);
    const isShow = isSearchDetailOnfocusOrOnblur
    return (
      <div
        className={`${styles.thumbnailFilesList}
        ${globalStyles.global_vertical_scrollbar}
        ${isShow ? styles.changeHeight : ''}`}
      >
        {thumbnailFilesList.length ? (
          <Table
            // style={{height:500}}
            // scroll={{ y: tableHeight}}
            dataSource={thumbnailFilesList}
            columns={columns}
            pagination={{ pageSize: 10 }}
            loading={onlyFileTableLoading}
            // pagination={{
            //     pageSize: 6
            // }}
            pagination={false}
            rowKey={record => record.file_id}
            rowSelection={isBatchOperation ? rowSelection : ''}
          />
        ) : (
          <div className={styles.dropText}>
            <span>拖拽到此处或文件夹，完成上传，同样支持按钮点击上传</span>
          </div>
        )}
      </div>
    )
  }
}

ThumbnailFilesListShow.defaultProps = {
  // 这是一个项目交流中默认渲染文件的组件
}

function mapStateToProps({
  imCooperation: { im_all_latest_unread_messages, wil_handle_types = [] },
  projectCommunication: { isBatchOperation, fileSelectList, selectedRowKeys }
}) {
  return {
    im_all_latest_unread_messages,
    wil_handle_types,
    isBatchOperation,
    fileSelectList,
    selectedRowKeys
  }
}

export default DragProvider(ThumbnailFilesListShow)
