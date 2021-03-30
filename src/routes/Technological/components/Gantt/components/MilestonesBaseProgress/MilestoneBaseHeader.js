import React, { Component } from 'react'
import { milestone_base_height } from '../../constants'
import styles from './index.less'
import outlineStyles from '../OutlineTree/index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Menu, Switch, Dropdown } from 'antd'
import { connect } from 'dva'
// 分组和大纲视图最顶部的里程碑那一栏
@connect(function({
  gantt: {
    datas: { outline_columns, outline_default_columns, outline_is_show_order }
  }
}) {
  return {
    outline_columns,
    outline_default_columns,
    outline_is_show_order
  }
})
export default class MilestoneBaseHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.fetchSetting()
  }

  // 获取设置项
  fetchSetting = async () => {
    const { dispatch, outline_columns, outline_default_columns } = this.props
    let data = await dispatch({
      type: 'gantt/getOutlineTableHeader'
    })
    let arr = Array.from(outline_default_columns)
    if (data) {
      arr = []
      for (const key in data) {
        if (data[key] == 1) {
          let obj = outline_columns.find(item => item.dataIndex === key)
          if (obj) arr.push(obj.key)
        }
      }
    }

    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_default_columns: arr,
        outline_is_show_order: !!+data?.is_show_order
      }
    })
  }
  computedWidth = arr => {
    if (arr.length === 3 || arr.length === 2) {
      return 460
    }
    if (arr.length === 4) {
      return 540
    }
    if (arr.length === 1) {
      return 370
    }
  }
  // 更新表头
  handleSelectionColumns = val => {
    const { dispatch, outline_columns, outline_default_columns } = this.props
    const { key, item } = val
    let dataIndex = item.props.item_key
    let arr = Array.from(outline_default_columns)
    let show = 0
    if (outline_default_columns.includes(key)) {
      arr = arr.filter(item => item !== key)
      show = 0
    } else {
      arr.push(key)
      show = 1
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_default_columns: arr
      }
    })
    setTimeout(() => {
      // 更新页面
      let width = this.computedWidth(arr)
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          gantt_head_width: width
        }
      })
      dispatch({
        type: 'gantt/setOutlineTableHeader',
        payload: {
          [dataIndex]: show
        }
      })
      // 更新缓存
      window.localStorage.setItem('gantt_head_width', width)
      const target = document.getElementById('gantt_header_wapper')
      target.style.width = `${width}px`
      // 提醒一下拖动条在哪
      const slidebar = target.querySelector('.draggableSlidebar')
      slidebar.classList.add(outlineStyles.slideActive_bar)
      setTimeout(() => {
        slidebar.classList.remove(outlineStyles.slideActive_bar)
      }, 800)
    }, 200)
  }

  // 切换是否显示编号
  toogleNumber = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_is_show_order: val
      }
    })
    dispatch({
      type: 'gantt/setOutlineTableHeader',
      payload: {
        is_show_order: val ? 1 : 0
      }
    })
  }
  // 下拉菜单
  SettingMenu = () => {
    const {
      dispatch,
      outline_columns,
      outline_default_columns,
      outline_is_show_order
    } = this.props

    return (
      <div className={outlineStyles.overlay_toogle_menu}>
        <Menu onClick={this.handleSelectionColumns}>
          {outline_columns.map(item => {
            return (
              <Menu.Item key={item.key} item_key={item.dataIndex}>
                <div className={outlineStyles.selectColumns}>
                  {item.title}
                  {outline_default_columns.includes(item.key) && (
                    <span
                      className={`${outlineStyles.active} ${globalStyles.authTheme}`}
                    >
                      &#xe7fc;
                    </span>
                  )}
                </div>
              </Menu.Item>
            )
          })}
        </Menu>
        <div className={outlineStyles.overlay_toogle_number}>
          <span>显示编号</span>
          <span>
            <Switch
              onChange={this.toogleNumber}
              checked={outline_is_show_order}
            />
          </span>
        </div>
      </div>
    )
  }
  render() {
    const {
      dispatch,
      outline_columns,
      outline_default_columns,
      outline_is_show_order
    } = this.props
    return (
      <div
        className={`${styles.base}`}
        style={{ height: milestone_base_height }}
      >
        <div className={outlineStyles.outline_header}>
          <div
            className={outlineStyles.flex1}
            style={{ flex: outline_default_columns.length <= 2 ? 2 : 1 }}
          >
            <Dropdown
              overlayClassName={outlineStyles.settingOverlay}
              trigger={['click']}
              overlay={this.SettingMenu()}
              overlayStyle={{ width: 200 }}
            >
              <div
                className={`${globalStyles.authTheme} ${outlineStyles.settings_icon}`}
              >
                &#xe78e;
              </div>
            </Dropdown>
            <div
              className={outlineStyles.item_title_name}
              style={{ width: 242 }}
            >
              项目里程碑
            </div>
          </div>
          <div className={outlineStyles.flex2}>
            {outline_columns
              .filter(c => outline_default_columns.includes(c.key))
              .map(item => {
                return (
                  <div className={outlineStyles[item.className]} key={item.key}>
                    {item.title}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }
}
