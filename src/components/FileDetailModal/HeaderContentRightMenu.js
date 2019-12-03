import React, { Component } from 'react'
import headerStyles from './HeaderContent.less'
import VisitControl from '../../routes/Technological/components/VisitControl'
import InformRemind from '@/components/InformRemind'
import VersionSwitching from '@/components/VersionSwitching'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class HeaderContentRightMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      new_filePreviewCurrentVersionList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    // const { filePreviewCurrentVersionList = [] } = nextProps
    // if (!(filePreviewCurrentVersionList && filePreviewCurrentVersionList.length)) return
    // let new_filePreviewCurrentVersionList = [...filePreviewCurrentVersionList]
    // new_filePreviewCurrentVersionList = new_filePreviewCurrentVersionList.map(item => {
    //   let new_item = item
    //   new_item = { ...item, is_edit: false }
    //   return new_item
    // })

    // this.setState({
    //   new_filePreviewCurrentVersionList,
    // })
  }

  render() {
    const { currentPreviewFileData = {} } = this.props
    const { new_filePreviewCurrentVersionList = [] } = this.state
    const { board_id,  } = currentPreviewFileData
    // console.log(new_filePreviewCurrentVersionList, 'sssssssssssss_new_filePreviewCurrentVersionList')

    return (
      <div className={headerStyles.header_rightMenuWrapper}>
        {/* 版本信息 */}
        {/* <div className={headerStyles.margin_right10}>
          <VersionSwitching 
            // is_show={true}
            // handleVersionItem={this.handleVersionItem}
            // getVersionItemMenuClick={this.getVersionItemMenuClick}
            // handleFileVersionDecription={this.handleFileVersionDecription}
            // handleFileVersionValue={this.handleFileVersionValue}
            // uploadProps={uploadProps}
          />
        </div> */}
        {/* 另存为 */}
        <div className={headerStyles.margin_right10}>

        </div>
        {/* 访问控制 */}
        {/* <div className={headerStyles.margin_right10}>
          <VisitControl />
        </div> */}
        {/* 通知提醒 */}
        {/* <div className={headerStyles.margin_right10}>
          <InformRemind />
        </div> */}
        {/* 全屏 */}
        <div>
          
        </div>
      </div>
    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicFileDetailModal: { currentInitFileId, currentPreviewFileData = {}, filePreviewCurrentVersionList = [] } } ) {
  return { currentInitFileId, currentPreviewFileData, filePreviewCurrentVersionList }
}
