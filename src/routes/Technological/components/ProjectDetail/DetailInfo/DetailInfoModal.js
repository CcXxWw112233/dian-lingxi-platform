import React from 'react'
import { Modal, Form, Button, Input, message, Icon } from 'antd'
import DrawDetailInfo from './DrawDetailInfo'
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

  onCancel(){
    this.props.updateDatas({
      projectInfoDisplay: false
    })
  }

  handleTriggetModalTitle = () => {
    this.setState({
      is_show_all_member: true
    })
  }

  render() {
    const { modalVisible } = this.props;
    const { is_show_all_member } = this.state
    return(
      <CustormModal
        title={is_show_all_member ? (
          <div style={{textAlign: 'center', fontSize: 16, fontWeight: 500, color:'rgba(0,0,0,0.85)', display: 'flex'}}>
            <span><Icon className={DrawDetailInfoStyle.back} style={{color:'rgba(0,0,0,0.45)', cursor: 'pointer'}} type="left" /></span>
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
        overInner={<DrawDetailInfo {...this.props} is_show_all_member={is_show_all_member} handleTriggetModalTitle={this.handleTriggetModalTitle} />}
      />
    )
  }
}
export default Form.create()(DetailInfoModal)
