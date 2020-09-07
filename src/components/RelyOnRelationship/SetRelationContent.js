import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../utils/businessFunction'
import { TASKS, FLOWS } from '../../globalset/js/constant'
import { Select, Tooltip, Popconfirm } from 'antd'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

export default class SetRelationContent extends Component {

  state = {
    selectedItems: [],
    relationList: []
  };

  handleChange = selectedItems => {
    console.log(selectedItems);
    this.setState({ selectedItems, relationList: selectedItems });
  };

  // 删除字段
  handleDelCurrentField = (shouldDeleteId) => {
    this.props.handleDelCurrentField && this.props.handleDelCurrentField(shouldDeleteId)
  }

  // 渲染不同类型时标识以及ICON
  renderRelationItemIcon = (type) => {
    let icon = ''
    let dec = ''
    switch (type) {
      case '3': // 表示任务
        icon = <>&#xe66a;</>
        dec = `${currentNounPlanFilterName(TASKS)}`
        break;
      case '2': // 表示流程
        icon = <>&#xe629;</>
        dec = `${currentNounPlanFilterName(FLOWS)}`
        break;
      default:
        break;
    }
    return { icon, dec }

  }

  render() {
    const { onlyShowPopoverContent, currentItem = {} } = this.props
    const { id, data: { next = [] } } = currentItem
    const { selectedItems = [], relationList = [] } = this.state;
    const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));
    return (
      <div className={`${indexStyles.setRelationContainer} ${onlyShowPopoverContent && indexStyles.setRelationContainer1}`}>
        <div className={indexStyles.setRelationItem}>
          <div className={indexStyles.setRela_left}>
            <span onClick={() => { this.handleDelCurrentField(id) }} className={`${globalStyles.authTheme} ${indexStyles.setRela_delIcon}`}>&#xe7fe;</span>
            <div className={indexStyles.setRela_hover}>
              <span className={globalStyles.authTheme}>&#xe6ed;</span>
              <span>依赖关系</span>
            </div>
          </div>
          <div className={indexStyles.setRela_right}>
            <div className={indexStyles.setRela_r_top}>
              <div className={indexStyles.setRela_rt_left}>
                <span>当前{currentNounPlanFilterName(TASKS)}</span>
                <span className={indexStyles.setRela_rt_marks}>完成后才能开始</span>
              </div>
              <div className={indexStyles.setRela_rt_right}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  mode="multiple"
                  // value={null}
                  onChange={this.handleChange}
                  placeholder={`添加${currentNounPlanFilterName(TASKS)}依赖`}
                  className={indexStyles.setRela_select}>
                  {filteredOptions.map(item => (
                    <Select.Option key={item} value={item}>
                      <div className={indexStyles.setRela_select_option}>
                        <div>
                          <span className={`${globalStyles.authTheme}`}><span>&#xe66a;</span> {currentNounPlanFilterName(TASKS)}</span>
                          <span title={item}>{item}</span>
                        </div>
                        <span title={item}>#&nbsp;里程碑名称</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                {/* 显示添加设置的依赖项 */}
                <div>
                  {
                    !!(next && next.length) && next.map(item => {
                      if (item.relation == 'end_start') {
                        return (
                          <div key={item.id} className={indexStyles.setRela_rt_item}>
                            <div className={indexStyles.setRela_rt_item_content}>
                              <div className={indexStyles.setRela_rt_item_left}>
                                <span className={`${item.type == '3' ? indexStyles.setRela_task_icon : item.type == '2' ? indexStyles.setRela_flow_icon : ''} ${globalStyles.authTheme}`}><span style={{ marginRight: '4px' }}>{this.renderRelationItemIcon(item.type).icon}</span>{this.renderRelationItemIcon(item.type).dec}</span>
                                <span title={item.name}>{item.name}</span>
                              </div>
                              <div className={indexStyles.setRela_rt_item_right}>
                                <span>#&nbsp;前期准备</span>
                              </div>
                              <Popconfirm getPopupContainer={triggerNode => triggerNode.parentNode} title={'删除此依赖？'} placement="topLeft">
                                <span className={`${globalStyles.authTheme} ${indexStyles.setRela_delIcon}`}>&#xe7fe;</span>
                              </Popconfirm>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>
            </div>
            <div className={indexStyles.setRela_r_bottom}>
              <div className={indexStyles.setRela_rb_left}>
                <span>当前{currentNounPlanFilterName(TASKS)}</span>
                <span className={indexStyles.setRela_rt_marks}>完成后才能完成</span>
              </div>
              <div className={indexStyles.setRela_rb_right}>
                <Select className={indexStyles.setRela_select} style={{ width: '100%' }} />
                {/* 显示添加设置的依赖项 */}
                <div>
                  {
                    !!(next && next.length) && next.map(item => {
                      if (item.relation == 'end_end') {
                        return (
                          <div key={item.id} className={indexStyles.setRela_rb_item}>
                            <div className={indexStyles.setRela_rt_item_content}>
                              <div className={indexStyles.setRela_rt_item_left}>
                                <span className={`${item.type == '3' ? indexStyles.setRela_task_icon : item.type == '2' ? indexStyles.setRela_flow_icon : ''} ${globalStyles.authTheme}`}><span style={{ marginRight: '4px' }}>{this.renderRelationItemIcon(item.type).icon}</span>{this.renderRelationItemIcon(item.type).dec}</span>
                                <span title={item.name}>{item.name}</span>
                              </div>
                              <div className={indexStyles.setRela_rt_item_right}>
                                <span>#&nbsp;前期准备</span>
                              </div>
                              <Popconfirm getPopupContainer={triggerNode => triggerNode.parentNode} title={'删除此依赖？'} placement="topLeft">
                                <span className={`${globalStyles.authTheme} ${indexStyles.setRela_delIcon}`}>&#xe7fe;</span>
                              </Popconfirm>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SetRelationContent.defaultProps = {
  onlyShowPopoverContent: false, // 统一用来判断是显示哪一种样式
  currentItem: {}, // 当前字段的数据内容
  handleDelCurrentField: function () { }, // 删除字段回调
}
