import React from 'react'
import { Icon } from 'antd'
export default class Header extends React.Component {

  close() {
    this.props.close()
  }
  render() {
    return (
      <div style = {{
        height:'52px',
        background:'rgba(255,255,255,1)',
        // borderBottom: '1px solid #E8E8E8',
        borderRadius:'4px 4px 0px 0px'}}>
        <div style={{
          width:'237px',
          height:'24px',
          background:'rgba(245,245,245,1)',
          borderRadius:'4px',
          textAlign: 'center',
          lineHeight: '24px',
          float: 'left'
        }}>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>示例项目</span>
          <span style={{color: '##8C8C8C', fontSize: '14px'}}> > </span>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>任务看板分组名称</span>
        </div>
        
        <div style={{
          float: 'right'
        }}>
          <Icon type="download" onClick = {() => {console.log(1)}} style={{marginRight: '20px', fontSize: '16px', cursor: 'pointer'}}/>
          <Icon type="ellipsis" onClick = {() => {console.log(2)}}  style={{marginRight: '20px', fontSize: '16px', cursor: 'pointer'}} />
          <Icon type="close" onClick = {this.close.bind(this)} style={{marginRight: '20px', fontSize: '16px', cursor: 'pointer'}} />
        </div>
      </div>
    )
  }
}