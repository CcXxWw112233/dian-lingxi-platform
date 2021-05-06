import { Dropdown, Spin } from 'antd'
import React from 'react'
import {
  getCardWithAttributesDetail,
  getMilestoneDetail
} from '../../../../../../../services/technological/task'
import { TempType } from '../../../CalendarPlan/constans'
import styles from './index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'

/** 渲染控制点的描述信息 */
export default class DescriptionRender extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 弹窗显示 */
      visible: false,
      /** 描述 */
      description: '',
      /** 是否加载中 */
      loading: false
    }
    /** 没有数据时，显示的文本 */
    this.notDataText = '暂无说明信息'
  }

  /** 渲染头部样式 */
  TitleRender = () => {
    const { title = 'Title' } = this.props
    return (
      <div className={styles.header_title}>
        {title}
        <span
          className={`${globalStyles.authTheme} ${styles.close_icon}`}
          onClick={() =>
            this.setState({
              visible: false
            })
          }
        >
          &#xe816;
        </span>
      </div>
    )
  }

  /** 渲染内容 */
  DesRender = () => {
    const { description, loading } = this.state
    return (
      <div className={styles.content}>
        <this.TitleRender />
        <div className={styles.content_description}>
          {loading ? (
            <div className={styles.loadingSpin}>
              <Spin
                spinning={true}
                tip="数据获取中"
                style={{ width: '100%' }}
              />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: description || this.notDataText
              }}
            ></div>
          )}
        </div>
      </div>
    )
  }

  /** 获取里程碑详情
   * @param {string} id 里程碑的id
   */
  fetchMilestoneDetail = async id => {
    if (!id) return { desc: '' }
    return getMilestoneDetail({ id }).then(res => {
      if (res.code === '0') {
        return { desc: res.data?.remarks }
      }
      return Promise.reject(res)
    })
  }

  /** 获取任务的详情
   * @param {string} id 任务的id
   */
  fetchCardDetail = async id => {
    if (!id) return { desc: '' }
    return getCardWithAttributesDetail({ id }).then(res => {
      if (res.code === '0') {
        return { desc: res.data?.description }
      }
      return Promise.reject(res)
    })
  }

  /** 获取数据的描述 */
  fetchDescription = async () => {
    const { data = {} } = this.props
    /** 描述详情 */
    let desc = ''
    this.setState({
      loading: true,
      description: ''
    })
    switch (data.type) {
      case TempType.milestoneType:
        const resp = await this.fetchMilestoneDetail(data.id)
        desc = resp.desc
        break
      case TempType.cardType:
        const res = await this.fetchCardDetail(data.id)
        desc = res.desc
        break
      default:
        break
    }
    this.setState({
      description: desc || this.notDataText,
      loading: false
    })
  }

  render() {
    const { children } = this.props
    return (
      <Dropdown
        {...this.props}
        title={null}
        trigger={['click']}
        visible={this.state.visible}
        onVisibleChange={val => {
          this.setState({ visible: val })
          if (val) this.fetchDescription()
        }}
        overlay={this.DesRender()}
        overlayStyle={{ width: 320, padding: 0 }}
        overlayClassName={styles.descriptionOverlay}
      >
        {children}
      </Dropdown>
    )
  }
}
