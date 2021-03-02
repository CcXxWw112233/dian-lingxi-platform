import React from 'react'
import styles from './Styles/PublicPreviewTable.less'
import Cookie from 'js-cookie'
import qs from 'querystring'
import { message } from 'antd'
import { getOnlineExcelDataWithProcess } from '../../services/technological/workFlow'
import { isApiResponseOk } from '../../utils/handleResponseData'
import PreviewTable from '../../components/previewTable'

export default class PublicPreviewTable extends React.Component {
  state = {
    data: {}
  }
  componentDidMount() {
    const { match } = this.props
    let param = {
      ...match.params,
      ...qs.parse(
        (window.location.search || window.location.hash).split('?')[1]
      )
    }

    this.checkParams(param)
  }
  /**
   * 校验是否传入了token
   */
  checkParams = (params = {}) => {
    const { id, token } = params
    if (!id) return message.warn('不存在的在线表格标识')
    if (!token) {
      return message.warn('没有权限查看')
    } else {
      Cookie.set('Authorization', token)
    }

    // 获取数据
    this.getOnlineExcelDataWithProcess(id)
  }

  /**
   * 获取表格数据
   * @param {*} props
   */
  getOnlineExcelDataWithProcess = id => {
    getOnlineExcelDataWithProcess({ id }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          data: res.data
        })
      }
    })
  }

  render() {
    const { data } = this.state
    return (
      <div className={styles.container}>
        <PreviewTable
          leadingOutVisible={false}
          data={data.sheet_data}
          minRows={25}
          style={{ maxHeight: '100%' }}
        />
      </div>
    )
  }
}
