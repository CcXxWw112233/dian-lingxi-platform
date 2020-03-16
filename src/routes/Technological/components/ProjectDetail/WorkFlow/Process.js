import React, { Component } from 'react'
import indexStyles from './index.less'
import { connect } from 'dva'
import ProcessDefault from './ProcessDefault'

@connect(mapStateToProps)
export default class Process extends Component {

  filterPage = () => {
    const { processPageFlagStep } = this.props
    let containner = (<div></div>)
    switch (processPageFlagStep) {
      case '1':
        containner = (<ProcessDefault />)
        break
      case '2':
        // containner = (<EditProcess />)
        break
      case '3':
        // containner = (<ProcessStartConfirm />)
        break
      case '4':
        containner = (<ProcessDefault />)
        break
      default:
        containner = (<ProcessDefault />)
        break
    }
    return containner
  }

  render() {
    const { isInOpenFile, filePreviewCurrentFileId, fileType, currentPreviewFileName } = this.props
    return (
      <div className={indexStyles.processOut}>
        {/* {this.filterPage()} */}
        <ProcessDefault />
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    processPageFlagStep
  },
  publicFileDetailModal: {
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    currentPreviewFileName
  }
}) {
  return { processPageFlagStep, isInOpenFile, filePreviewCurrentFileId, fileType, currentPreviewFileName }
}
