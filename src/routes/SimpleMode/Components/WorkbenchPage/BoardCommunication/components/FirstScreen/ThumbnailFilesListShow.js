import React, { Component } from 'react'
import {
  filterFileFormatType,
  timestampToTime,
  timestampToTimeNormal
} from '@/utils/util'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Button, Table, Tooltip, Popconfirm, message } from 'antd'
import styles from './CommunicationThumbnailFiles.less'
import { getSubfixName } from '@/utils/businessFunction.js'
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
    const { im_all_latest_unread_messages, wil_handle_types } = props
    this.setState({
      columns: [
        {
          title: '文件名',
          dataIndex: 'file_name',
          key: 'file_name',
          render: (text, record, index) => {
            const { type, id } = record
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
                <span style={{ display: 'flex', position: 'relative' }}>
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
                  &nbsp;{getSubfixName(text)}
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
  render() {
    const {
      thumbnailFilesList = [],
      onlyFileTableLoading,
      isSearchDetailOnfocusOrOnblur
    } = this.props
    const { columns } = this.state
    // console.log('isSearchDetailOnfocusOrOnblur',isSearchDetailOnfocusOrOnblur);
    const isShow = isSearchDetailOnfocusOrOnblur
    return (
      <div
        className={`${styles.thumbnailFilesList} ${
          globalStyles.global_vertical_scrollbar
        } ${isShow ? styles.changeHeight : ''}`}
      >
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
        />
      </div>
    )
  }
}

ThumbnailFilesListShow.defaultProps = {
  // 这是一个项目交流中默认渲染文件的组件
}

function mapStateToProps({
  imCooperation: { im_all_latest_unread_messages, wil_handle_types = [] }
}) {
  return { im_all_latest_unread_messages, wil_handle_types }
}

export default DragProvider(ThumbnailFilesListShow)
