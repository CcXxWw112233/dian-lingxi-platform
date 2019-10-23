import React from 'react'
import {connect} from 'dva'
import { min_page_width } from "../../globalset/js/styles";
import CustormModal from '../../components/CustormModal'
import DetailDom from './DetailDom'

@connect(mapStateToProps)
export default class DetailModal extends React.Component {
  state = {
    clientHeight: document.documentElement.clientHeight,
    clientWidth: document.documentElement.clientWidth,
  }
  constructor(props) {
    super(props);
    this.resizeTTY = this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeTTY);
  }

  onCancel() {
    const { modalVisibleName = 'modalVisible', modalVisibleValue } = this.props
    this.props.onCancel && this.props.onCancel()
  }

  resizeTTY = () => {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
  }

  render() {
    const { modalVisible, width, style, siderRightCollapsed} = this.props;
    const { clientWidth, clientHeight } = this.state;

    //const modalTop = 20
    let enableDisplayWidth = (siderRightCollapsed ? clientWidth - 300 : clientWidth - 56) * 0.9;
    let modalWidht = '';
    if (enableDisplayWidth> 1200) {

      modalWidht = '1200px';
    }else{
      modalWidht = enableDisplayWidth;
    }

    return (
      <CustormModal
        visible={modalVisible}
        width={1200}
        close={this.props.close}
        closable={false}
        maskClosable={false}
        footer={null}
        destroyOnClose
        bodyStyle={{ padding: '0px' }}
        style={{...style }}
        onCancel={this.onCancel.bind(this)}
        overInner={<DetailDom {...this.props} />}
      />
    )
  }
}


function mapStateToProps({
  technological: { datas: {
    siderRightCollapsed }
  },

}) {
  return { siderRightCollapsed }
}
