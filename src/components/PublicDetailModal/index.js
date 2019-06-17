import React from 'react'
import {min_page_width} from "../../globalset/js/styles";
import CustormModal from '../../components/CustormModal'
import DetailDom from './DetailDom'

export default class DetailModal extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onCancel(){
    const { modalVisibleName = 'modalVisible', modalVisibleValue } = this.props
    this.props.setPublicDetailModal && this.props.setPublicDetailModal({
      [modalVisibleName]: false
    })
  }

  render() {
    const { modalVisibleName } = this.props
    const modalVisibleValue = this.props[modalVisibleName]
    //modalVisibleName 在多个应用该modal的地方区分状态名称
    //modalVisibleValue  值为从props传递的[modalVisibleName] true/false
    const modalTop = 20
    return(
      <CustormModal
        visible={true}
        width={'90%'}
        close={this.props.close}
        closable={false}
        maskClosable={false}
        footer={null}
        destroyOnClose
        bodyStyle={{top: 0}}
        style={{top: modalTop}}
        onCancel={this.onCancel.bind(this)}
        overInner={<DetailDom {...this.props} modalTop={modalTop}/>}
      />
    )
  }
}
