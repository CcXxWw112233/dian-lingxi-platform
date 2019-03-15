import React from 'react'
import MenuSearchStyles from './MenuSearch.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'

export default class MenuSearchMultiple extends React.Component{
   state = {
     selectedKeys: [],
     resultArr: [],
     keyWord: ''
   }
  componentWillMount() {
    const { keyWord } = this.state
    const { usersArray = [] } = this.props
    console.log(usersArray)
    this.setState({
      resultArr: this.fuzzyQuery(usersArray, keyWord)
    })
  }
  componentWillReceiveProps (nextProps) {
    const { keyWord } = this.state
    const { usersArray = [] } = nextProps
    this.setState({
      resultArr: this.fuzzyQuery(usersArray, keyWord)
    })
  }
   menuDeselect = ({ item, key, selectedKeys }) => {
     if(!key){
      return false
     }
     this.setState({
       selectedKeys
     })
     this.props.setAssignees && this.props.setAssignees(selectedKeys)
   }
   menuSelect = ({ item, key, selectedKeys }) => {
      if(!key){
        return false
      }
     this.setState({
       selectedKeys
     })
     this.props.setAssignees && this.props.setAssignees(selectedKeys)
   }
  //模糊查询
  fuzzyQuery = (list, keyWord) => {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].indexOf(keyWord) !== -1) {
        arr.push(list[i]);
      }
    }
    return arr;
  }
  onChange = (e) => {
    const { usersArray } = this.props
    const keyWord = e.target.value
    const resultArr = this.fuzzyQuery(usersArray, keyWord)
    this.setState({
      keyWord,
      resultArr
    })
  }
   render(){
    // filterUserArray过滤的人
    const { usersArray = [], noMutiple, filterUserArray = [] } = this.props
    const { selectedKeys, keyWord, resultArr } = this.state
    return (
    <Menu multiple={!noMutiple} style={{padding: 8}} selectedKeys={selectedKeys} onDeselect={this.menuDeselect.bind(this)} onSelect={this.menuSelect.bind(this)}>
      <Input value={keyWord} onChange={this.onChange.bind(this)}/>
      {
        resultArr.map((val, key) => {
          let flag = true
          for(let userVal of filterUserArray) {
            if(userVal['name'] == val) {
              flag = false
              break
            }
          }
          return flag && (
            <Menu.Item style={{height: 32, lineHeight: '32px'}} key={key}>
              {val}
            </Menu.Item>
          )
        })
      }
    </Menu>
  )
  }

}


