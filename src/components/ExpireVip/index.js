import { Button, Dropdown } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import { ExpireType } from './constans'
import styles from './index.less'
import globalStyles from '../../globalset/css/globalClassName.less'
import { connect } from 'dva'
import { ExpireModel } from '../../models/technological/expireRenew'
import { LocalStorageKeys, PAYUPGRADEURL } from '../../globalset/js/constant'
import moment from 'moment'
import 'animate.css'

/** 快到期和即将到期的提示 */
@connect(
  ({
    [ExpireModel.namespace]: { expireVisible, expireType, tips, expiredTime }
  }) => ({
    expireVisible,
    expireType,
    tips,
    expiredTime
  })
)
export default class ExpireVip extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /** 立即续费按钮 */
  handleRenew = () => {
    window.open(PAYUPGRADEURL)
    this.closeModal()
  }

  /** 关闭窗口 */
  closeModal = () => {
    const { dispatch } = this.props
    /** 关闭弹窗 */
    dispatch({
      type: [ExpireModel.namespace, ExpireModel.reducers.updateDatas].join('/'),
      payload: {
        expireType: false
      }
    })
    window.localStorage.setItem(
      LocalStorageKeys.willExpireCloseTime,
      moment()
        .valueOf()
        .toString()
    )
  }

  /** 即将到期的渲染 */
  WillExpireRender = () => {
    const { tips, releaShow = true, expiredTime } = this.props
    if (!releaShow) return <span style={{ display: 'none' }}></span>
    return (
      <div
        className={`${styles.willExpireModal} animate__animated animate__fadeIn animate__faster`}
      >
        <div className={styles.willExpireContent}>
          <div className={styles.iconVip}>VIP</div>
          <div className={styles.vipTitle}>尊贵的会员</div>
          <div className={styles.tipContent}>
            {tips || `您的VIP特权将于 ${expiredTime || '近期'} 到期`}
          </div>
          <div className={styles.btns}>
            <Button
              style={{ borderRadius: 50 }}
              size="large"
              type="primary"
              block
              onClick={this.handleRenew}
            >
              立即续费
            </Button>
          </div>
          <div className={styles.close_modal}>
            <span
              className={`${globalStyles.authTheme}`}
              onClick={this.closeModal}
            >
              &#xe816;
            </span>
          </div>
        </div>
      </div>
    )
  }

  /** 过期的弹窗变化
   * @param {boolean} visible true | false
   */
  expiredVisibleChange = visible => {
    const { dispatch } = this.props
    dispatch({
      type: [ExpireModel.namespace, ExpireModel.reducers.updateDatas].join('/'),
      payload: {
        expireVisible: visible
      }
    })
  }

  /** 为已过期类型的弹窗提示 */
  ExpiredRender = () => {
    const {
      children,
      expireVisible,
      releaShow = true,
      tips,
      expiredTime
    } = this.props
    if (!releaShow) return children || null
    return (
      <Dropdown
        trigger={[]}
        visible={expireVisible}
        overlay={
          <div
            className={styles.expiredContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.close_modal_mini}>
              <span
                className={`${globalStyles.authTheme}`}
                onClick={this.closeModal}
              >
                &#xe816;
              </span>
            </div>
            <div className={styles.expiredContentTitle}>过期通知</div>
            <div className={styles.expiredTime}>
              {tips || (
                <span>
                  组织已过期，过期时间是{' '}
                  <b className={styles.time}>{expiredTime}</b>
                </span>
              )}
            </div>
            <div className={styles.expiredBtn}>
              <Button
                style={{ borderRadius: 50 }}
                type="primary"
                block
                onClick={this.handleRenew}
              >
                立即续费
              </Button>
            </div>
          </div>
        }
        onVisibleChange={this.expiredVisibleChange}
      >
        {children}
      </Dropdown>
    )
  }

  render() {
    const { expireType, children } = this.props
    return (t => {
      switch (t) {
        case ExpireType.WillExpire:
          return ReactDOM.createPortal(this.WillExpireRender(), document.body)
        case ExpireType.Expired:
          return this.ExpiredRender()
        default:
          return children || null
      }
    })(expireType)
  }
}
