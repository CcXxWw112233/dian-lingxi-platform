import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import FileDetailContent from './FileDetailContent'

export default class FileDetailModal extends Component {

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
  resizeTTY = () => {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
  }

  render() {
    const { file_detail_modal_visible, setPreviewFileModalVisibile, filePreviewCurrentFileId, fileType } = this.props
    const { clientWidth, clientHeight } = this.state
    return (
      <div id={'container_publicFileDetailModal'}>
        <FileDetailContent
          clientWidth={clientWidth}
          clientHeight={clientHeight}
          file_detail_modal_visible={file_detail_modal_visible} 
          setPreviewFileModalVisibile={setPreviewFileModalVisibile} 
          filePreviewCurrentFileId={filePreviewCurrentFileId} 
          fileType={fileType}
          {...this.props}
          />
      </div>
    )
  }
}


