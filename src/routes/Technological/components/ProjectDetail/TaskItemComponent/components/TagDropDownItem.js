import React from 'react'
import { Input, Popconfirm, Dropdown  } from 'antd'
import TagDropDownStyles from './TagDropDown.less'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'

export default class TagDropDownItem extends React.Component {

  state = {
    isInEdit: false,
    name: '',
    onMouse: false,
    color: '245,34,45'
  }
  changeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  toTop() {

  }
  toChooseColor() {

  }

  toEdit() {
    this.setState({
      isInEdit:true
    })
  }

  toDelete() {

  }

  toCheckEdit() {
    this.setState({
      isInEdit:false
    })
  }
  setOnMouse(bool) {
    this.setState({
      onMouse:bool
    })
  }
  deleteConfirm() {

  }
  deleteCancel() {

  }

  setColor(value,e) {
    console.log(value)
    this.setState({
      color: value
    })
  }

  render() {

    const { isInEdit, name, onMouse, color } = this.state

    const colorArray = [
      '90,90,90',
      '245,34,45',
      '250,84,28',
      '250,140,22',
      '250,173,20',
      '250,219,20',
      '160,217,17',
      '82,196,26',
      '19,194,194',
      '24,144,255',
      '47,84,235',
      '114,46,209',
      '235,47,150'
    ]

    const selectColorNode = (
      <div className={TagDropDownStyles.selectColorOut}>
        {colorArray.map((value, key) => {
          return (
          <div onClick={this.setColor.bind(this,value)} key={key} style={{color: `rgba(${value})`,backgroundColor: `rgba(${value},0.1)`, border: `1px solid rgba(${value},1)`}}></div>
          )})
        }
      </div>
    )


    return (
      <div className={TagDropDownStyles.dropItem}
           onMouseLeave={this.setOnMouse.bind(this,false)}
           onMouseOver={this.setOnMouse.bind(this,true)}
           style={{color: `rgba(${color})`,backgroundColor: `rgba(${color},0.1)`, border: `1px solid rgba(${color},${onMouse?'1':'0.6'})`}}>

        <div className={TagDropDownStyles.dropItem_left}>
          {!isInEdit? (
            name
          ): (
            <input style={{width: 216,height: 20, border: 'none', outline: 'none',padding:4, color: `rgba(${color})`}} autoFocus maxLength={8} onChange={this.changeName.bind(this)} />
          )}
        </div>
        <div className={TagDropDownStyles.dropItem_right} >
          <div className={globalStyles.authTheme} style={{display: `${!isInEdit?'block': 'none'}`}} onClick={this.toTop.bind(this)}>&#xe6f8;</div>
          <Dropdown overlay={selectColorNode} placement={'topCenter'}>
            <div className={globalStyles.authTheme} style={{display: `${!isInEdit?'block': 'none'}`}}>&#xe6f8;</div>
          </Dropdown>
          <div className={globalStyles.authTheme} style={{display: `${!isInEdit?'block': 'none'}`}} onClick={this.toEdit.bind(this)}>&#xe6f8;</div>
          <Popconfirm  zIndex={2000} placement={'top'} autoAdjustOverflow title="确认删除该标签吗？" onConfirm={this.deleteConfirm.bind(this)} onCancel={this.deleteCancel.bind(this)} >
            <div className={globalStyles.authTheme} style={{display: `${!isInEdit?'block': 'none'}`}}>&#xe6f8;</div>
          </Popconfirm>
          {/*单独*/}
          <div className={globalStyles.authTheme} style={{display: `${!isInEdit?'none': 'block'}`}} onClick={this.toCheckEdit.bind(this)}>&#xe70c;</div>
        </div>


      </div>
    )
  }

}
