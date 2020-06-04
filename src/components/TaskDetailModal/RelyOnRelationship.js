import React, { Component } from 'react'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Select } from 'antd'
const { Option } = Select;

export default class RelyOnRelationship extends Component {

  constructor(pros) {
    super(pros)
    this.state = {
      show_unflod_or_packup_arrow: false, // 是否展开 还是收起, true 表示点击展开(即收起状态, 箭头朝上)
    }
  }

  handleSpreadArrow = (e) => {
    e && e.stopPropagation();
    this.setState({
      show_unflod_or_packup_arrow: !this.state.show_unflod_or_packup_arrow
    })
  }

  // 显示详情依赖关系
  renderDetailRelyOnContent = () => {
    return (
      <div className={mainContentStyles.re_bottom}>
        <div className={mainContentStyles.re_task_dependency_group}>
          {/* 头部 */}
          <div className={mainContentStyles.re_task_dependency_group_header}>
            <div className={mainContentStyles.re_title}>前置事项:</div>
          </div>
          <div className={mainContentStyles.re_task_dependency_item}>
            {/* 关联的任务内容 */}
            <div className={`${mainContentStyles.dependency_task_info_wrap} ${mainContentStyles.matter_right}`}>
              <div className={mainContentStyles.dependency_task_info}>
                <div className={mainContentStyles.task_info_left}>
                  <div className={mainContentStyles.matter_complete}>已完成</div>
                  <div className={mainContentStyles.task_info_name}>根据暖通，水专业的提资修改</div>
                </div>
                <div className={mainContentStyles.date_info}>05/16 13:43 ~ 05/16 13:43</div>
              </div>
            </div>
            {/* 选择框 */}
            <div>
              <div className={mainContentStyles.re_task_select}>
                <div className={`${mainContentStyles.select_t_title} ${mainContentStyles.matter_right}`}>完成才开始</div>
                <div className={mainContentStyles.select_t_curr}>当前任务</div>
                {/* <Select showArrow={false} className={mainContentStyles.select_wrapper}></Select> */}
              </div>
            </div>
          </div>
          {/* 第二部分 */}
          {/* 头部 */}
          <div className={mainContentStyles.re_task_dependency_group_header}>
            <div className={mainContentStyles.re_title}>后置事项:</div>
          </div>
          <div className={mainContentStyles.re_task_dependency_item}>
            {/* 选择框 */}
            <div>
              <div className={mainContentStyles.re_task_select}>
                <div className={mainContentStyles.select_t_curr}>当前任务</div>
                <div className={`${mainContentStyles.select_t_title} ${mainContentStyles.matter_left}`}>完成才开始</div>
              </div>
            </div>
            {/* 关联的任务内容 */}
            <div className={`${mainContentStyles.dependency_task_info_wrap} ${mainContentStyles.matter_left}`}>
              <div className={mainContentStyles.dependency_task_info}>
                <div className={mainContentStyles.task_info_left}>
                  <div className={mainContentStyles.matter_incomplete}>未完成</div>
                  <div className={mainContentStyles.task_info_name}>完成水电初稿</div>
                </div>
                <div className={mainContentStyles.date_info}>2019/05/16 13:43 ~ 05/16 13:43</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { show_unflod_or_packup_arrow } = this.state
    return (
      <div className={mainContentStyles.relyOnContainer}>
        <div className={mainContentStyles.re_top}>
          <div className={mainContentStyles.re_left}>
            <span className={globalStyles.authTheme}>&#xe6ed;</span>
            <span>依赖关系: 存在<span style={{ color: '#1890ff' }}>3</span>条依赖关系</span>
          </div>
          <div onClick={this.handleSpreadArrow} className={mainContentStyles.re_right}>
            {
              show_unflod_or_packup_arrow ? (
                <span>收起 <span className={globalStyles.authTheme}>&#xe7ed;</span></span>
              ) : (
                <span>展开 <span className={globalStyles.authTheme}>&#xe7ee;</span></span>
              )
            }
          </div>
        </div>
        {
          show_unflod_or_packup_arrow ? this.renderDetailRelyOnContent() : ('')
        }
      </div>
    )
  }
}
