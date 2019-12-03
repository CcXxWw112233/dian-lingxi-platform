import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class MainContent extends Component {

  componentDidMount() {
    const { currentInitFileId, dispatch } = this.props
    if (currentInitFileId) {
      dispatch({
        type: 'publicFileDetailModal/fileInfoByUrl',
        payload: {
          id: currentInitFileId
        }
      })
    }

  }

  render() {
    return (
      <div>
        我的天
      </div>
    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicFileDetailModal: { currentInitFileId } } ) {
  return { currentInitFileId }
}
