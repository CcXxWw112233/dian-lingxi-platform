import React from 'react'
import { Dropdown, Input, Icon, Cascader, Tooltip } from 'antd'
import indexStyles from './index.less'
import globalStyles from '../../globalset/css/globalClassName.less'
//relations 关联内容的列表
export default class RaletionList extends React.Component {

  state = {
    isShowAll: false
  }

  handleDeleteRelation = (e, id) => {
    const {handleDeleteRelationItem} = this.props
    if(e) e.stopPropagation()
    handleDeleteRelationItem(id)
  }

  relationClick(content_url) {
    const protocol = content_url.substring(0, 4)
    const url = protocol == 'http'? content_url: `http://${content_url}`
    window.open(url)
  }
  isShowAll() {
    this.setState({
      isShowAll: !this.state.isShowAll
    })
  }
  judgeType(linked_sign) {
    let themeCode = ''
    switch (linked_sign) {
      case 'board':
        themeCode = '&#xe7c6;'
        break
      case 'app_2':
        themeCode = '&#xe6d4;'
        break
      case 'app_3':
        themeCode = '&#xe6d3;'
        break
      case 'app_4':
        themeCode = '&#xe6d2;'
        break
      case 'html':
        themeCode = '&#xe61d;'
        break
      case 'group ':
        themeCode = '&#xe60e;'
        break
      case 'template':
        themeCode = '&#xe60e;'
        break
      case 'folder':
        themeCode = '&#xe60b;'
        break
      case 'task':
        themeCode = '&#xe6cd;'
        break
      case 'file':
        themeCode = '&#xe6cc;'
        break
      case 'flow':
        themeCode = '&#xe6cb;'
        break
      default:
        themeCode = '&#xe6cc;'
        break
    }
    return themeCode
  }


  render() {
   const { relations } = this.props
   const { isShowAll } = this.state
  //  console.log('this is relations', relations)
    return(
      <div className={indexStyles.relaData}>
        {relations.map((value, key) => {
          const { id, linked_name, linked_url, linked_sign } = value
          if(isShowAll){
            return (
              <div key={id} className={indexStyles.relaData_item} onClick={this.relationClick.bind(this, linked_url)}>
                <div>
                  <span className={globalStyles.authTheme} style={{color: '#1890FF', fontSize: 20, marginRight: 4}} dangerouslySetInnerHTML={{__html: this.judgeType(linked_sign)}}></span>
                  <span>{linked_name}</span>
                </div>
                <Tooltip title='删除'>
                <span className={indexStyles.relaData_item_delete_icon} onClick={(e) => this.handleDeleteRelation(e, id)}><i className={globalStyles.authTheme}>&#xe7c3;</i></span>
                </Tooltip>
              </div>
            )
          } else {
            if(key < 2) {
              return (
                <div key={id} className={indexStyles.relaData_item} onClick={this.relationClick.bind(this, linked_url)}>
                  <div>
                    <span className={globalStyles.authTheme} style={{color: '#1890FF', fontSize: 20, marginRight: 4}} dangerouslySetInnerHTML={{__html: this.judgeType(linked_sign)}}></span>
                    <span>{linked_name}</span>
                  </div>
                  <Tooltip title='删除'>
                  <span className={indexStyles.relaData_item_delete_icon} onClick={(e) => this.handleDeleteRelation(e, id)}><i className={globalStyles.authTheme}>&#xe7c3;</i></span>
                  </Tooltip>
                </div>
              )
            }
          }
        })}
        <span onClick={this.isShowAll.bind(this)} style={{cursor: 'pointer', color: 'rgb(73, 155, 230)', marginTop: '8px'}}> {isShowAll?'收起部分':'查看更多'} </span>
      </div>
    )
  }
}
