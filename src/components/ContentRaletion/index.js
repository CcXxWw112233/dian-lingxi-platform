import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import RaletionDrop from './RaletionDrop'
import RaletionList from './RaletionList'
import indexStyles from './index.less'

//内容关联相关
export default class ContentRaletion extends React.Component {
  state = {
    isInEditContentRelation: false
  }
  setIsInEditContentRelation(bool) {
    this.setState({
      isInEditContentRelation: bool,
      contentDropVisible: bool
    })
  }
  addRelation(data) {
    this.props.addRelation && this.props.addRelation(data)
  }
  render() {
    const { isInEditContentRelation } = this.state
    const { board_id, link_id, link_local, relations = [] } = this.props
    return(
      <div>
        {!isInEditContentRelation ? (
          <div className={indexStyles.contain_6} >
            <div className={indexStyles.contain_6_add} onClick={this.setIsInEditContentRelation.bind(this, true)}>
              <Icon type="plus" style={{marginRight: 4}}/>关联内容
            </div>
          </div>
        ) : (
          <div className={indexStyles.contain_6} >
            <RaletionDrop {...this.props}
                          board_id ={board_id}
                          link_id={link_id}
                          link_local={link_local}
                          addRelation = {this.addRelation.bind(this)}
                          setIsInEditContentRelation={this.setIsInEditContentRelation.bind(this)}
            />
          </div>
        ) }
        <RaletionList {...this.props} relations={relations}/>
      </div>
    )
  }
}
