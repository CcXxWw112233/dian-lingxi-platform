import React from 'react'
import { Modal, Form, Button, Input, message, Icon } from 'antd'
import DrawDetailInfo from './DrawDetailInfo'
import DetailMember from './DetailMember'
import {min_page_width} from "../../../../../globalset/js/styles";
import CustormModal from '../../../../../components/CustormModal'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
const FormItem = Form.Item
const TextArea = Input.TextArea


class DetailInfoModal extends React.Component {
  state = {
    is_show_all_member: false, // 是否显示全部成员, 默认为 false, 不显示
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  // 点击取消的事件
  onCancel(){
    this.props.updateDatas({
      projectInfoDisplay: false
    })
    this.setState({
      is_show_all_member: false,
    })
  }

  // 切换头部的标题
  handleTriggetModalTitle = () => {
    this.setState({
      is_show_all_member: true
    })
  }

  // 点击返回按钮
  handleBack() {
    this.setState({
      is_show_all_member: false,
    })
  }

  render() {
    const { modalVisible } = this.props;
    const { is_show_all_member } = this.state
    return(
      <CustormModal
        title={is_show_all_member ? (
          <div style={{textAlign: 'center', fontSize: 16, fontWeight: 500, color:'rgba(0,0,0,0.85)', display: 'flex'}}>
            <span><Icon onClick={ () => { this.handleBack() } } className={DrawDetailInfoStyle.back} type="left" /></span>
            <span style={{flex: '1'}}>全部成员</span>
          </div>
        ) : (
          <div style={{textAlign: 'center', fontSize: 16, fontWeight: 500, color: '#000'}}>项目信息</div>
        )} 
        visible={modalVisible}
        width={614}
        zIndex={1006}
        maskClosable={false}
        footer={null}
        destroyOnClose
        onCancel={this.onCancel.bind(this)}
        overInner={
          is_show_all_member ? (
            <DetailMember {...this.props} is_show_all_member={is_show_all_member} />
          ) : (
            <DrawDetailInfo {...this.props} is_show_all_member={is_show_all_member} handleTriggetModalTitle={this.handleTriggetModalTitle} />
          )
        }
      />
    )
  }
}
export default Form.create()(DetailInfoModal)
