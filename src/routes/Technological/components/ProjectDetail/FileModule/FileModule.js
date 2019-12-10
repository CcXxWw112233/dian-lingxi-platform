import React from 'react'
import indexStyles from './index.less'
import { Table, Button } from 'antd';
import FileList from './FileList'
import MoveToDirectory from './MoveToDirectory'
import BreadCrumbFileNav from './BreadCrumbFileNav'
import FileDetail from './FileDetail'
// import FileDetailModal from './FileDetail/FileDetailModal'
import FileListRightBarFileDetailModal from './FileListRightBarFileDetailModal'
import FileDetailModal from '@/components/FileDetailModal'
import { connect } from 'dva';

@connect(mapStateToProps)
export default class FileIndex extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      previewFileModalVisibile: false
    }
  }

  setPreviewFileModalVisibile = () => {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }

  render() {
    const { isInOpenFile, dispatch, filePreviewCurrentFileId, fileType } = this.props
    const { marginTop = '20px' } = this.props;
    return (
      <div>
        {/*{isInOpenFile && <FileDetail {...this.props} />}*/}
        <div className={indexStyles.fileOut} style={{ marginTop: marginTop }}>
          <BreadCrumbFileNav />
          <FileList setPreviewFileModalVisibile={this.setPreviewFileModalVisibile} />
          <MoveToDirectory />
        </div>
        {
          this.state.previewFileModalVisibile && (
            <FileListRightBarFileDetailModal fileType={fileType} filePreviewCurrentFileId={filePreviewCurrentFileId} previewFileModalVisibile={this.state.previewFileModalVisibile} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile} />
          )
        }
      </div>
    )
  }
}
function mapStateToProps({
  projectDetailFile: {
    datas: {
      isInOpenFile
    }
  },
  publicFileDetailModal: {
    filePreviewCurrentFileId,
    fileType
  }
}) {
  return {
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType
  }
}