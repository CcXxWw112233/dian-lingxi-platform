import React, { Component } from 'react'
import { filterFileFormatType } from '@/utils/util'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Tooltip, Popconfirm, message } from 'antd'
import styles from './CommunicationThumbnailFiles.less'
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData'
import { fileRemove } from '../../../../../../../services/technological/file'
import CustormBadgeDot from '@/components/CustormBadgeDot'
import { connect } from 'dva'
import {
  cardItemIsHasUnRead,
  folderItemHasUnReadNo
} from '../../../../../../Technological/components/Gantt/ganttBusiness'
import DragProvider from '../../../../../../../components/DragProvider'

// @connect(mapStateToProps)
// @connect()
@connect(mapStateToProps)
class ThumbnailFilesTilingShow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // this.initData();
  }
  actionsManager = (action, itemValue, e) => {
    e.stopPropagation()
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
  previewFile = data => {
    const { isBatchOperation } = this.props
    const { id } = data
    // 批量操作的 不跳转
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
  render() {
    const { thumbnailFilesList = [] } = this.props
    console.log('thumbnailFilesList', thumbnailFilesList)
    const {
      im_all_latest_unread_messages,
      wil_handle_types,
      isBatchOperation,
      fileSelectList
    } = this.props

    return (
      <div className={styles.ThumbnailFilesTilingShow}>
        {thumbnailFilesList &&
          thumbnailFilesList.length !== 0 &&
          thumbnailFilesList.map(item => {
            const { type, id } = item
            const un_read_count = folderItemHasUnReadNo({
              type,
              relaDataId: id,
              im_all_latest_unread_messages,
              wil_handle_types
            })
            const isSelected = fileSelectList.some(function(currentValue) {
              return (
                item.id == currentValue.id && item.type == currentValue.type
              )
            })
            return (
              <div
                className={styles.itemBox}
                key={item.id}
                title={item.file_name}
                onClick={() => this.previewFile(item)}
              >
                {isBatchOperation ? (
                  isSelected ? (
                    <i
                      className={`${globalStyles.authTheme}  ${styles.file_select_icon}`}
                      style={{ fontSize: 20, color: '#6A9AFF' }}
                    >
                      &#xe638;
                    </i>
                  ) : (
                    <i
                      className={`${globalStyles.authTheme} ${styles.file_select_icon}`}
                      style={{ fontSize: 20 }}
                    >
                      &#xe661;
                    </i>
                  )
                ) : (
                  ''
                )}
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url || ''} alt="" />
                ) : (
                  <div
                    className={`${globalStyles.authTheme} ${styles.otherFile}`}
                    dangerouslySetInnerHTML={{
                      __html: filterFileFormatType(item.file_name)
                    }}
                  ></div>
                )}
                <CustormBadgeDot
                  show_dot={un_read_count > 0}
                  type={'showCount'}
                  count={un_read_count}
                  // top={-4}
                  // right={-6}
                />
                <div className={styles.operate_area}>
                  <Tooltip title={'下载'}>
                    <div
                      className={`${globalStyles.authTheme}  ${styles.table_operate}`}
                      style={{ marginRight: 10 }}
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
              </div>
            )
          })}
      </div>
    )
  }
}

ThumbnailFilesTilingShow.defaultProps = {
  // 这是一个项目交流中缩略图组件
}
function mapStateToProps({
  imCooperation: { im_all_latest_unread_messages, wil_handle_types = [] },
  projectCommunication: { isBatchOperation, fileSelectList }
}) {
  return {
    im_all_latest_unread_messages,
    wil_handle_types,
    isBatchOperation,
    fileSelectList
  }
}

export default DragProvider(ThumbnailFilesTilingShow)
