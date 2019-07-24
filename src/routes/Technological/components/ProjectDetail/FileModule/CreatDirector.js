import React from 'react'
import { Input, Button } from 'antd'

export default class CreatDirector extends React.Component {
  state = {
    file_name: ''
  }
  nameInputChange(e) {
    this.setState({
      file_name: e.target.value
    })
  }
  onOk() {
    if(!this.state.file_name) {
      return false
    }
    const {datas: { projectDetailInfoData = {}, currentParrentDirectoryId }} = this.props.model
    const { board_id } = projectDetailInfoData

    const { datas: { fileList = [], filedata_1 = [] } } = this.props.model
    fileList.shift()
    filedata_1.shift()
    this.props.addNewFolder({
      board_id,
      folder_name: this.state.file_name,
      parent_id: currentParrentDirectoryId
    })
    this.props.updateDatasFile({fileList, filedata_1, isInAddDirectory: false})
  }
  onCancel() {
    const { datas: { fileList = [], filedata_1 = [] } } = this.props.model
    fileList.shift()
    filedata_1.shift()
    this.props.updateDatasFile({fileList, filedata_1, isInAddDirectory: false})
  }
  render () {
    return (
      <div style={{fontSize: 14}}>
        <Input autoFocus style={{width: 160, height: 24}} onChange={this.nameInputChange.bind(this)}/>
        <Button style={{height: 24, marginLeft: 8}} type={'primary'} onClick={this.onOk.bind(this)}>确认</Button>
        <Button style={{marginLeft: 8, height: 24}} onClick={this.onCancel.bind(this)}>取消</Button>
      </div>
    )
  }
}
