import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Select } from 'antd'
import { currentNounPlanFilterName } from '../../utils/businessFunction';
import { TASKS, FLOWS } from '../../globalset/js/constant';
import { timestampToTimeNormal } from '../../utils/util';
const { Option } = Select;

export default class RelyOnRelationship extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show_unflod_or_packup_arrow: false, // 是否展开 还是收起, true 表示点击展开(即收起状态, 箭头朝上)
      relationshipList: props.relationshipList || {}
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      relationshipList: nextProps.relationshipList
    })
  }

  // 展开收起
  handleSpreadArrow = (e) => {
    e && e.stopPropagation();
    this.setState({
      show_unflod_or_packup_arrow: !this.state.show_unflod_or_packup_arrow
    })
  }

  // 渲染不同完成状态
  renderCompleteStatus = (type, status) => {
    let dec = ''
    let color = 'rgba(0,0,0,0.45)'
    if (type == '3') { // 表示任务
      switch (status) {
        case '0': // 表示未完成
          // dec = '未完成'
          break
        case '1': // 表示已完成
          dec = '已完成'
          color = '#1890FF'
          break;
        default:
          break;
      }
      return { dec, color }
    } else if (type == '2') { // 表示流程
      switch (status) {
        case '0': // 表示未开始
          // dec = '未开始'
          break
        case '1': // 表示进行中
          // dec = '进行中'
          break;
        case '2': // 表示已终止
          dec = '已终止'
          color = 'rgba(0,0,0,0.25)'
          break
        case '3': // 表示已完成
          dec = '已完成'
          color = '#1890FF'
          break
        default:
          break;
      }
      return { dec, color }
    }

  }

  // 渲染不同图标
  rendetDiffIconContent = (type) => {
    let container = <div></div>
    switch (type) {
      case '3': // 表示任务
        container = (
          <div className={`${indexStyles.task_icon}`}>
            <span className={globalStyles.authTheme}>&#xe66a;</span>
            <span>{currentNounPlanFilterName(TASKS)}</span>
          </div>
        )
        break;
      case '2': // 表示流程
        container = (
          <div className={`${indexStyles.flow_icon}`}>
            <span className={globalStyles.authTheme}>&#xe68c;</span>
            <span>{currentNounPlanFilterName(FLOWS)}</span>
          </div>
        )
        break
      default:
        break;
    }
    return container
  }

  // 显示详情依赖关系
  renderDetailRelyOnContent = () => {
    const { relationshipList = {} } = this.state
    const preposeList = relationshipList['last']
    const postpositionList = relationshipList['next']
    return (
      <div className={indexStyles.re_bottom}>
        <div className={indexStyles.re_task_dependency_group}>
          {/* 头部 */}
          {
            !(preposeList && preposeList.length) ? ('') : (
              <div className={indexStyles.re_task_dependency_group_header}>
                <div className={indexStyles.re_title}>前置事项:</div>
              </div>
            )
          }
          {
            !(preposeList && preposeList.length) ? ('') : preposeList.map(item => {
              const { id, due_time, start_time, name, type, is_realize } = item
              return (
                <div key={id} className={indexStyles.re_task_dependency_item}>
                  {/* 关联的任务内容 */}
                  <div className={`${indexStyles.dependency_task_info_wrap} ${indexStyles.matter_right}`}>
                    <div className={indexStyles.dependency_task_info}>
                      <div className={indexStyles.task_info_left}>
                        {this.rendetDiffIconContent(type)}
                        <div className={`${indexStyles.task_info_name} ${is_realize == '1' && indexStyles.line_through}`}>{name}</div>
                        <div style={{ color: this.renderCompleteStatus(type, is_realize).color, flexShrink: 0 }}>{this.renderCompleteStatus(type, is_realize).dec ? `(${this.renderCompleteStatus(type, is_realize).dec})` : ''}</div>
                      </div>
                      <div className={indexStyles.date_info}>{timestampToTimeNormal(start_time, '/', true)}{(start_time && due_time) && '~'} {timestampToTimeNormal(due_time, '/', true)}</div>
                    </div>
                  </div>
                  {/* 选择框 */}
                  <div>
                    <div className={indexStyles.re_task_select}>
                      <div className={`${indexStyles.select_t_title} ${indexStyles.matter_right}`}>完成才开始</div>
                      <div className={indexStyles.select_t_curr}>当前任务</div>
                      {/* <Select showArrow={false} className={indexStyles.select_wrapper}></Select> */}
                    </div>
                  </div>
                </div>
              )
            })
          }

          {/* 第二部分 */}
          {/* 头部 */}
          {
            !(postpositionList && postpositionList.length) ? ('') : (
              <div className={indexStyles.re_task_dependency_group_header}>
                <div className={indexStyles.re_title}>后置事项:</div>
              </div>
            )
          }
          {
            !(postpositionList && postpositionList.length) ? ('') : postpositionList.map(item => {
              const { id, due_time, start_time, name, type, is_realize } = item
              return (
                <div className={indexStyles.re_task_dependency_item}>
                  {/* 选择框 */}
                  <div>
                    <div className={indexStyles.re_task_select}>
                      <div className={indexStyles.select_t_curr}>当前任务</div>
                      <div className={`${indexStyles.select_t_title} ${indexStyles.matter_left}`}>完成才开始</div>
                    </div>
                  </div>
                  {/* 关联的任务内容 */}
                  <div className={`${indexStyles.dependency_task_info_wrap} ${indexStyles.matter_left}`}>
                    <div className={indexStyles.dependency_task_info}>
                      <div className={indexStyles.task_info_left}>
                        {this.rendetDiffIconContent(type)}
                        <div className={`${indexStyles.task_info_name} ${is_realize == '1' && indexStyles.line_through}`}>{name}</div>
                        <div style={{ color: this.renderCompleteStatus(type, is_realize).color, flexShrink: 0 }}>{this.renderCompleteStatus(type, is_realize).dec ? `(${this.renderCompleteStatus(type, is_realize).dec})` : ''}</div>
                      </div>
                      <div className={indexStyles.date_info}>{timestampToTimeNormal(start_time, '/', true)}{(start_time && due_time) && '~'} {timestampToTimeNormal(due_time, '/', true)}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    const { show_unflod_or_packup_arrow, relationshipList = {} } = this.state
    const number = relationshipList['number']
    return (
      <>
        {
          (!(relationshipList['last'] && relationshipList['last'].length) && !(relationshipList['next'] && relationshipList['next'].length)) ? ('') : (
            <div className={indexStyles.relyOnContainer}>
              <div className={indexStyles.re_top}>
                <div className={indexStyles.re_left}>
                  <span className={globalStyles.authTheme}>&#xe6ed;</span>
                  <span>依赖关系: 存在<span style={{ color: '#1890ff' }}>{number}</span>条依赖关系</span>
                </div>
                <div onClick={this.handleSpreadArrow} className={indexStyles.re_right}>
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
      </>

    )
  }
}
