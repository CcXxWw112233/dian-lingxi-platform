import React from 'react'
import indexStyles from '../../index.less'
import { Avatar, Modal } from 'antd'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../../../utils/businessFunction";
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { Collapse } from 'antd';
import TemplateItem from './TemplateItem'
const Panel = Collapse.Panel;

export default class TemplateContent extends React.Component {
  state = {

  }
  templateStartClick({id}) {
    this.props.getTemplateInfo && this.props.getTemplateInfo(id)
  }
  deleteTemplate({id}) {
    const that = this
    Modal.confirm({
      title: `确认删除该模板？`,
      zIndex: 2000,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.props.deleteProcessTemplate && that.props.deleteProcessTemplate({id})
      }
    });


  }
  startEdit() {
    this.props.updateDatasProcess({
      processPageFlagStep: '2'
    })
  }

  render() {
    const { datas: { processTemplateList = [] }} = this.props.model
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 160
    return (
      <div className={indexStyles.content}>
        <div className={indexStyles.paginationContent} style={{maxHeight: maxContentHeight}}>
          {processTemplateList.map((value, key) => {
            const { id } = value
            return (
             <TemplateItem {...this.props} key={id} itemValue={value} />
            )
          })}
        </div>
        <div className={indexStyles.add} onClick={this.startEdit.bind(this)}>新增模板</div>
      </div>
    )
  }
}
const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize: 16,
  border: 0,
  marginLeft: 10,
  overflow: 'hidden',
};
