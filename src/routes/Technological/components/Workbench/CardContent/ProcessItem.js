import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import Cookies from 'js-cookie'

export default class ProcessItem extends React.Component {
  gotoBoardDetail({flow_instance_id, board_id}) {
    this.props.routingJump(`/technological/projectDetail?board_id=${board_id}&appsSelectKey=2&flow_id=${flow_instance_id}`)
  }
  render() {
    const { itemValue = {} } = this.props
    const { flow_node_name, name, board_name, board_id, status='1', flow_instance_id } = itemValue //status 1running 2stop 3 complete
    const filterColor = (status)=> {
      let color = '#f2f2f2'
      if('1' ===status){
        color='#40A9FF'
      }else if('2' === status) {
        color='#FF4D4F'
      }else if('3'===status) {
        color='#73D13D'
      }else {

      }
      return color
    }
    return (
      <div className={indexstyles.processItem}>
        <div>{flow_node_name || name}<span style={{marginLeft: 6, color: '#8c8c8c', cursor: 'pointer'}} onClick={this.gotoBoardDetail.bind(this, {flow_instance_id, board_id})}>#{board_name}</span></div>
        <div>
          <div style={{backgroundColor: filterColor(status)}}></div>
        </div>
      </div>
    )
  }
}
