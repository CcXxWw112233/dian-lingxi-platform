import React from 'react'
import TagDropDownStyles from './TagDropDown.less'
import TagDropDownItem from './TagDropDownItem.js'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'


export default class TagDropDown extends React.Component {
  toAdd() {

  }
  render() {
    const Data = [1,2,3,4]
    return (
      <div className={TagDropDownStyles.dropOut} >

        <div className={TagDropDownStyles.dropItem}>

          <div className={TagDropDownStyles.dropItem_left}>
            sss
          </div>
          <div className={TagDropDownStyles.dropItem_right}>
            <div className={globalStyles.authTheme} onClick={this.toAdd.bind(this)}>&#xe6f8;</div>
          </div>


        </div>

        {Data.map((value, key) => {
          return (
            <TagDropDownItem key={key} />
          )
        })}
      </div>
    )
  }

}
