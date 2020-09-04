import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../utils/businessFunction'
import { TASKS } from '../../globalset/js/constant'
import { Select } from 'antd'

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

  render() {
    const { selectedItems = [], relationList = [] } = this.state;
    const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));
    console.log(relationList);
    return (
      <div className={indexStyles.setRelationContainer}>
        <div className={indexStyles.setRelationItem}>
          <div className={indexStyles.setRela_left}>
            <span className={`${globalStyles.authTheme} ${indexStyles.setRela_delIcon}`}>&#xe7fe;</span>
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
                  placeholder="Inserted are removed"
                  // value={null}
                  onChange={this.handleChange}
                  placeholder={`添加${currentNounPlanFilterName(TASKS)}依赖`}
                  className={indexStyles.setRela_select}>
                  {filteredOptions.map(item => (
                    <Select.Option key={item} value={item}>
                      <div className={indexStyles.setRela_select_option}>
                        <div>
                          <span className={`${indexStyles.setRela_task_icon} ${globalStyles.authTheme}`}><span>&#xe66a;</span> {currentNounPlanFilterName(TASKS)}</span>
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
                    !!(relationList && relationList.length) && relationList.map(item => {
                      return (
                        <div className={indexStyles.setRela_rt_item}>
                          <div className={indexStyles.setRela_rt_item_content}>
                            <div className={indexStyles.setRela_rt_item_left}>
                              <span className={`${indexStyles.setRela_task_icon} ${globalStyles.authTheme}`}><span>&#xe66a;</span> {currentNounPlanFilterName(TASKS)}</span>
                              <span>{item}</span>
                            </div>
                            <div className={indexStyles.setRela_rt_item_right}>
                              <span>#&nbsp;前期准备</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            {/* <div className={indexStyles.setRela_r_bottom}>
              <div className={indexStyles.setRela_rb_left}>
                <span>当前{currentNounPlanFilterName(TASKS)}</span>
                <span className={indexStyles.setRela_rt_marks}>完成后才能完成</span>
              </div>
              <div className={indexStyles.setRela_rb_right}>
                <Select className={indexStyles.setRela_select} style={{width: '100%'}} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}
