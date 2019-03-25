import React from 'react'
import { Dropdown, Input, Icon, Cascader, Menu } from 'antd'
import RaletionDrop from './RaletionDrop'
import RaletionList from './RaletionList'
import indexStyles from './index.less'
import SearchUrlRelation from './SearchUrlRelation'
import globalStyles from '../../globalset/css/globalClassName.less'
import {isApiResponseOk} from "../../utils/handleResponseData";
import {getRelations, JoinRelation} from "../../services/technological/task";

//内容关联相关
export default class ContentRaletion extends React.Component {
  state = {
    isInEditContentRelation: false,
    isInChoose: false,
    isInSearCh: false,
    relations: []
  }
  componentDidMount() {
    this.getRelations()
  }
  async getRelations(data) {
    const { board_id, link_id, link_local } = this.props
    const res = await getRelations({
      board_id,
      link_id,
      link_local,
    })
    if(isApiResponseOk(res)) {
      this.setState({
        relations: res.data || []
      })
    }else{

    }
  }
  async addRelation(data) {
    const res = await JoinRelation(data)
    if(isApiResponseOk(res)) {
      this.getRelations()
    }else{

    }
  }

  setIsInEditContentRelation(bool) {
    this.setState({
      isInEditContentRelation: bool,
      isInSearCh: !bool,
      isInChoose: bool
    })
  }
  setSearch(bool) {
    this.setState({
      isInEditContentRelation: bool,
      isInSearCh: bool,
      isInChoose: !bool
    })
  }
  render() {
    const { isInEditContentRelation, isInChoose, isInSearCh, relations = [] } = this.state
    const { board_id, link_id, link_local, } = this.props

    return(
      <div style={{width: 'auto'}}>
        {!isInEditContentRelation ? (
          <div className={`${indexStyles.contain_6} ${indexStyles.contain_6_2}`} >
            <div className={indexStyles.contain_6_add} >
              <Icon type="plus" style={{marginRight: 4}}/>关联内容
            </div>
            <div className={indexStyles.contain_6_add_2}>
              <div className={indexStyles.contain_6_add_2_left} onClick={this.setIsInEditContentRelation.bind(this, true)}>
                <span className={`${globalStyles.authTheme} ${indexStyles.iconMargin}`}>&#xe612;</span>选择内容
              </div>
              <div className={indexStyles.contain_6_add_2_middle}></div>
              <div className={indexStyles.contain_6_add_2_right} onClick={this.setSearch.bind(this, true)}>
                <span className={`${globalStyles.authTheme} ${indexStyles.iconMargin}`}>&#xe611;</span>搜索内容
              </div>
            </div>
          </div>
        ) : (
          isInChoose ? (
            <div className={indexStyles.contain_6} >
              <RaletionDrop {...this.props}
                            board_id ={board_id}
                            link_id={link_id}
                            link_local={link_local}
                            addRelation = {this.addRelation.bind(this)}
                            setIsInEditContentRelation={this.setIsInEditContentRelation.bind(this)}
              />
            </div>

          ) : (
           <SearchUrlRelation
              setSearch={this.setSearch.bind(this)}
              board_id ={board_id}
              link_id={link_id}
              link_local={link_local}
              addRelation = {this.addRelation.bind(this)}
           />
          )
        ) }
        <RaletionList {...this.props} relations={relations} />
      </div>
    )
  }
}
