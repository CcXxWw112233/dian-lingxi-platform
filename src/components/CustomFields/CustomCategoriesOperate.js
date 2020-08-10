import React, { Component } from 'react'
import RextFieldContent from './component/RadioFieldContent';
import commonStyles from './common.less'
import CheckboxFieldContent from './component/CheckboxFieldContent';
import DateFieldContent from './component/DateFieldContent';
import NumberFieldContent from './component/NumberFieldContent';
import TextFieldContent from './component/TextFieldContent';
import MemberFieldContent from './component/MemberFieldContent';

export default class CustomCategoriesOperate extends Component {

  renderContent = (type) => {
    let mainContent = (<div></div>)
    mainContent = (<RextFieldContent />)
    mainContent = (<CheckboxFieldContent />)
    mainContent = (<DateFieldContent />)
    mainContent = (<NumberFieldContent />)
    // mainContent = (<TextFieldContent />)
    // switch (type) {
    //   case 'text':
    //     mainContent = (<TextFieldContent />)
    //     break;
    
    //   default:
    //     break;
    // }
    return mainContent
  }

  render() {
    return (
      <div className={commonStyles.custom_operate_wrapper}>
        {this.renderContent()}
        <MemberFieldContent />
      </div>
    )
  }
}
