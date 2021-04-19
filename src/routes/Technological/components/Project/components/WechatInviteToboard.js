import React, { Component } from 'react'
import CustormModal from '../../../../../components/CustormModal'
import globalStyles from '@/globalset/css/globalClassName.less'
import { scanQrCodeJoin } from '../../../../../services/technological/index'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { message } from 'antd'

export default class WechatInviteToboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code_type: '2', //2二维码一次性有效，1二维码长期有效
      qr_code_src: ''
    }
  }
  onCancel = () => {
    this.setState({
      code_type: '1'
    })
    this.props.setModalVisibile && this.props.setModalVisibile()
  }
  componentWillReceiveProps(nextProps) {
    const { modalVisible } = nextProps
    if (modalVisible) {
      this.getQRCode({ code_type: this.state.code_type })
    }
  }
  getQRCode = ({ code_type }) => {
    const {
      invitationType,
      invitationId,
      invitationOrg,
      rela_Condition
    } = this.props
    const relaCondition = rela_Condition && ''
    const userId = JSON.parse(localStorage.getItem('userInfo')).id
    console.log(this.props, 'WechatInviteToboard==========')
    scanQrCodeJoin({
      type: invitationType,
      id: invitationId,
      _organization_id: invitationOrg,
      rela_condition: relaCondition,
      user_id: userId,
      code_type
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          qr_code_src: res.data.code_url
        })
      } else {
        message.error(res.message)
      }
    })
  }
  changeCodeType = () => {
    const { code_type } = this.state
    const code_type_ = code_type == '1' ? '2' : '1'
    this.setState({
      code_type: code_type_
    })
    this.getQRCode({ code_type: code_type_ })
  }
  renderOverInner = () => {
    const { qr_code_src, code_type } = this.state
    return (
      <div>
        <div
          style={{
            color: '#595959',
            fontSize: '20px',
            color: '#595959',
            fontWeight: 'bold'
          }}
        >
          微信扫码邀请参与人
        </div>
        <div
          style={{
            margin: '0 auto',
            marginTop: 28,
            height: 196,
            width: 196,
            background: 'rgba(216,216,216,1)'
          }}
        >
          <img src={qr_code_src} style={{ height: 196, width: 196 }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 14
          }}
        >
          <div
            style={{ width: 48, height: 1, background: 'rgba(0,0,0,0.09)' }}
          ></div>
          <div
            style={{
              margin: '0 10px',
              color: 'rgba(0,0,0,0.65)',
              cursor: 'pointer'
            }}
          >
            <i
              className={globalStyles.authTheme}
              style={{ color: '#46A318', marginRight: 4 }}
            >
              &#xe634;
            </i>
            使用微信扫一扫
          </div>
          <div
            style={{ width: 48, height: 1, background: 'rgba(0,0,0,0.09)' }}
          ></div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 14
          }}
        >
          {code_type == '2'
            ? '为了安全起见，本二维码仅限单次扫码使用，'
            : '本二维码已切换为长期有效（含转发），'}
          <br />
          <span
            className={globalStyles.link_mouse}
            style={{ cursor: 'pointer' }}
            onClick={this.changeCodeType}
          >
            点击此处
          </span>
          切换为
          {code_type == '2' ? '长期有效' : '一次性有效'}
        </div>
      </div>
    )
  }
  render() {
    const { modalVisible } = this.props
    return (
      <div>
        <CustormModal
          visible={modalVisible} //modalVisible
          width={472}
          zIndex={1150}
          maskClosable={false}
          footer={null}
          destroyOnClose
          style={{ textAlign: 'center' }}
          onCancel={this.onCancel}
          overInner={this.renderOverInner()}
        ></CustormModal>
      </div>
    )
  }
}
WechatInviteToboard.defaultProps = {
  modalVisible: false,
  setModalVisibile: function() {}
}
