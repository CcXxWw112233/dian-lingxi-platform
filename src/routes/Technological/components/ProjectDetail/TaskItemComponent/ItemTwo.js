import React from 'react'
import CreateTaskStyle from '../CreateTask.less'
import { Icon, Checkbox, Collapse } from 'antd'
import ItemTwoChirldren from './ItemTwoChirldren'

const Panel = Collapse.Panel

export default class ItemTwo extends React.Component {
  state = {
    isCheck: false
  }
  itemOneClick(e) {
    e.stopPropagation();
    this.setState({
      isCheck: !this.state.isCheck
    })
  }
  seeDetailInfo(data, e) {
    this.props.setDrawerVisibleOpen(data)
  }
  render() {
    const { isCheck } = this.state
    const { itemValue = {} } = this.props
    const { card_id, card_name, chirl_data=[] } = itemValue

    return (
      <div  key={'2'} className={CreateTaskStyle.item_2} >
        <div className={CreateTaskStyle.item_2_top}  onClick={this.seeDetailInfo.bind(this,{drawContent:itemValue})}>
          <div className={isCheck? CreateTaskStyle.nomalCheckBoxActive: CreateTaskStyle.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
            <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
          </div>
          <div>{card_name}</div>
          <div>
            <img src="" />
          </div>
          <div>
            <Icon type="ellipsis"  style={{fontSize:16}}/>
          </div>
        </div>
        {chirl_data.map((value, key) => {
          return(
            <div className={CreateTaskStyle.item_2_bott}>
              <Collapse accordion bordered={false} style={{backgroundColor:'#f5f5f5'}} defaultActiveKey={['2']}>
                <Panel header={<span style={{color: '#8c8c8c'}}>我收藏的项目</span>} key="1"  style={customPanelStyle}>
                  <ItemTwoChirldren ItemTwoChirldrenVaue={value} {...this.props}></ItemTwoChirldren>
                </Panel>
              </Collapse>
            </div>
          )
        })}

      </div>
    )
  }
}

const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize:12,
  color: '#8c8c8c',
  border: 0,
  overflow: 'hidden',
};
