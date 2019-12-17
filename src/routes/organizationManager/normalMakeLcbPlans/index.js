import React, { Component } from 'react'
import LcbPlansItem from './LcbPlansItem'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less' 
import { ORGANIZATION, PROJECTS } from "@/globalset/js/constant";
import { currentNounPlanFilterName } from "@/utils/businessFunction";

export default class index extends Component {
  render() {
    return (
      <div>
        <div className={indexStyles.title}>
          <div className={`${globalStyles.authTheme} ${indexStyles.title_icon}`}>&#xe684;</div>
          <div style={{fontSize: '20px', fontWeight: 900, color: 'rgba(0,0,0,0.65)'}}>{`${currentNounPlanFilterName(PROJECTS)}解决方案`}</div>
        </div>
        <LcbPlansItem />
      </div>
    )
  }
}
