import React, { Component } from 'react'
import indexStyles from '../index.less'
import TemplateItem from './TemplateItem'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class TemplateContent extends Component {// 模板组件
  render() {
    return (
      <div className={`${indexStyles.templateContent}`}>
        <div className={indexStyles.addTemplate}>
          <span className={indexStyles.add_icon}>+</span>
          <span className={indexStyles.add_name}>新建模板</span>
        </div>
        <div className={`${indexStyles.templateItemContent} ${globalStyles.global_vertical_scrollbar}`}>
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
        </div>
      </div>
    )
  }
}

// 模板组件
TemplateContent.defaultProps = {

}
