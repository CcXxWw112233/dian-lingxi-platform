import { Dropdown, Menu, Popover, Avatar, Input, Button, message } from 'antd'
import { connect } from 'dva'
import React, { useEffect, useMemo, useState } from 'react'
import { GANTTMODEL } from '../../../../../../../models/technological/workbench/gantt/gantt'
import {
  addBoardTag,
  addTaskTag,
  getBoardTagList,
  removeTaskTag,
  updateBoardTag
} from '../../../../../../../services/technological/task'
import { BarColors } from '../CardBarConstans'
import styles from './LabelSelect.less'

/** 保存全部的标签列表 */
// let labelList = []
/** 任务条存在的标签列表 */
// let card_label = []
function LabelSelect(props) {
  /** 添加标签的标识 */
  const ADDLABELKEY = 'addlabel'
  /** 修改任务标签的标识 */
  const EDITLABELKEY = 'editlabel'
  /** 菜单的visible控制 */
  const [labelVisible, setLabelVisible] = useState(false)
  /** 保存标签列表 */
  const [labelList, setLabelList] = useState([])
  /** 缓存标签列表 */
  const [cardLabel, setCardLabel] = useState([])
  /** 菜单列表 */
  const [menus, setMenus] = useState([])
  /** 已选择的列表 */
  const [selected, setSelect] = useState([])
  /** 搜索的文字 */
  const [search, setSearch] = useState('')
  /** 新增标签和修改标签的弹窗 */
  // const [addLabelVisible, setAddLabelVisible] = useState(false)
  /** 选择的颜色 */
  const [selectColor, setSelectColor] = useState('')
  /** 添加标签的名称 */
  const [labelText, setLabelText] = useState('')
  /** 显示添加还是修改的popover */
  const [visibleKey, setVisibleKey] = useState(EDITLABELKEY)
  /** 编辑的id */
  const [inEditId, setEditId] = useState('')

  useEffect(() => {
    /**
     * 标签数据列表
     * @enum {string} label_color 颜色
     * @enum {string} label_id 标识
     * @enum {string} label_name 标签名称
     */
    const label_data = props.data.label_data || []
    setSelect(label_data)
    // card_label = label_data
    setCardLabel(label_data)
    fetchLabelList(label_data)
  }, [])

  /** 获取标签列表 */
  const fetchLabelList = ld => {
    getBoardTagList({ board_id: props.board_id }).then(res => {
      if (res.code === '0') {
        setMenus(res.data)
        setLabelList(res.data)
        /** 更新替换项目的标签列表和任务条对应 */
        const label_data = ld || []
        const arr = label_data.map(item => {
          const label = res.data.find(l => l.id === item.label_id)
          if (label)
            return {
              ...label,
              label_id: label.id,
              label_name: label.name,
              label_color: label.color
            }
          return item
        })
        /** 更新任务条的标签等 */
        /** 触发更新 */
        props.updateTags && props.updateTags({ label_data: arr })
      }
    })
  }

  /** 搜索标签列表
   * @param {React.ChangeEvent} e 输入事件
   */
  const handleSearchLabel = e => {
    setSearch(e.target.value)
    updateSearch(e.target.value)
  }

  /** 更新搜索的列表 */
  const updateSearch = val => {
    if (!val) {
      setMenus(labelList)
      return
    }
    const list = labelList.filter(item => item.name.indexOf(val) !== -1)
    setMenus(list)
  }

  /** 点击了标签，去重和添加 */
  const handleClickLabel = val => {
    const obj = {
      label_id: val.id,
      label_name: val.name,
      label_color: val.color
    }
    const inArr = selected.map(item => item.label_id).includes(val.id)
    if (!inArr) {
      setSelect([...selected, obj])
      fetchAddLabel(obj)
      setCardLabel([...selected, obj])
    } else {
      const arr = selected.filter(item => item.label_id !== val.id)
      setSelect(arr)
      fetchRemoveLabel(obj)
      setCardLabel(arr)
    }
  }

  /** 提交添加的标签
   * @param {string} label_id 标签id
   * @param {string} label_name 标签名称
   * @param {string} label_color 标签颜色
   */
  const fetchAddLabel = data => {
    const { dispatch } = props
    addTaskTag({ card_id: props.data.id, label_id: data.label_id }).then(
      res => {
        const labeldata = (props.data.label_data || []).concat([data])
        /** 触发更新 */
        props.updateTags && props.updateTags({ label_data: labeldata })
        dispatch({
          type: GANTTMODEL.namespace + '/' + GANTTMODEL.updateListGroup,
          payload: {
            datas: [
              {
                ...props.data,
                label_data: labeldata
              }
            ]
          }
        })
      }
    )
  }

  /** 移除标签
   * @param {string} label_id 标签id
   * @param {string} label_name 标签名称
   * @param {string} label_color 标签颜色
   */
  const fetchRemoveLabel = data => {
    const { dispatch } = props
    removeTaskTag({ card_id: props.data.id, label_id: data.label_id }).then(
      res => {
        const labeldata = (props.data.label_data || []).filter(
          item => item.label_id !== data.label_id
        )
        /** 触发更新 */
        props.updateTags && props.updateTags({ label_data: labeldata })
        dispatch({
          type: GANTTMODEL.namespace + '/' + GANTTMODEL.updateListGroup,
          payload: {
            datas: [
              {
                ...props.data,
                label_data: labeldata
              }
            ]
          }
        })
      }
    )
  }

  /** 点击选择了颜色 */
  const handleSelectColor = color => {
    // 更新颜色选中变量
    setSelectColor(color)
  }

  /** 取消或者确定的重置功能 */
  const addCancel = () => {
    setSelectColor('')
    setLabelText('')
    setVisibleKey(EDITLABELKEY)
    setEditId('')
  }

  /** 保存新增和编辑的标签 */
  const saveAddLabel = async () => {
    if (!labelText) {
      message.warn('请输入标签名称')
      return
    }
    if (!selectColor) {
      message.warn('请选择标签对应的颜色')
      return
    }
    const param = {
      board_id: props.board_id,
      color: selectColor,
      name: labelText
    }
    if (inEditId) {
      /** 编辑标签 */
      await updateBoardTag({ ...param, id: inEditId })
        .then(res => {
          if (res.code === '0') {
            message.success('修改成功')
            return res
          }
          return Promise.reject(res)
        })
        .catch(err => {
          message.warn(err.message)
          return Promise.reject(err)
        })
    } else {
      /** 新增标签 */
      await addBoardTag(param)
        .then(res => {
          if (res.code === '0') {
            message.success('添加成功')
            return res
          } else {
            return Promise.reject(res)
          }
        })
        .catch(err => {
          message.warn(err.message)
          return Promise.reject(err)
        })
    }
    addCancel()
    fetchLabelList(cardLabel)
  }

  /** 编辑标签颜色名称菜单 */
  const UpdateLabel = (
    <div className={styles.colors_container} key="addlabeldom">
      <div className={styles.title}>标签属性</div>
      <div className={styles.input_name}>
        <Input
          placeholder="输入标签名称"
          onClick={e => e.target?.focus()}
          style={{ width: '100%' }}
          type="text"
          onChange={e => {
            e.stopPropagation()
            setLabelText(e.target?.value)
          }}
          value={labelText}
        />
      </div>
      <div className={styles.bar_colors}>
        {BarColors.map((item, index) => {
          return (
            <div
              onClick={() => handleSelectColor(item)}
              key={`colors_${index}`}
            >
              <Avatar
                style={{ backgroundColor: `rgb(${item})` }}
                className={selectColor === item ? styles.active : ''}
              />
            </div>
          )
        })}
      </div>
      <div className={styles.btn_group}>
        <Button type="primary" ghost onClick={addCancel}>
          取消
        </Button>
        <Button type="primary" ghost onClick={saveAddLabel}>
          确认
        </Button>
      </div>
    </div>
  )

  /** 根据类型来判断popover显示的什么 */
  const getPopoverContent = () => {
    switch (visibleKey) {
      case ADDLABELKEY:
        return UpdateLabel
      case EDITLABELKEY:
        return menu
      default:
        return null
    }
  }

  /** 编辑标签 */
  const handleEditLabel = val => {
    setSelectColor(val.color)
    setLabelText(val.name)
    setEditId(val.id)
    /** 转到编辑页面 */
    setVisibleKey(ADDLABELKEY)
  }


  /** 检测禁用是方法还是bool */
  const checkDisabled = () => {
    const { disabled } = props
    if (disabled instanceof Function) {
      return disabled.call(this, props.valueKey)
    }
    return disabled
  }

  /** 保存选中的标签 */
  // const saveLabels = () => {
  //   const { label_data } = props.data
  // }

  /** 弹窗菜单 */
  const menu = (
    <div key="menudom">
      <div className={styles.title}>标签</div>
      <div className={styles.search}>
        <Input
          onClick={e => {
            e.stopPropagation()
            e.target?.focus()
          }}
          placeholder="搜索"
          type="text"
          onChange={handleSearchLabel}
          style={{ width: '100%' }}
          value={search}
        />
      </div>
      <div className={styles.label_box}>
        {menus.map(item => {
          /** 是否已经选择了 */
          const isSelected = selected
            .map(label => label.label_id)
            .includes(item.id)
          return (
            <div
              className={styles.select_item}
              key={item.id}
              onClick={() => handleClickLabel(item)}
            >
              <Avatar
                style={{
                  backgroundColor: `rgb(${item.color})`,
                  marginRight: 10
                }}
                size={20}
              />
              <span>{item.name}</span>
              <div className={styles.operation}>
                <span
                  className={styles.edit}
                  onClick={e => {
                    e.stopPropagation()
                    handleEditLabel(item)
                  }}
                >
                  &#xe852;
                </span>
                <span
                  className={`${styles.active} ${
                    !isSelected ? styles.label_none : ''
                  }`}
                >
                  &#xe7fc;
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.btn_group}>
        {/* <Popover
          trigger="click"
          content={<UpdateLabel />}
          visible={addLabelVisible}
          onVisibleChange={val => setAddLabelVisible(val)}
          getPopupContainer={targetElement => targetElement.parentElement}
        >

        </Popover> */}
        <Button type="primary" ghost onClick={() => setVisibleKey(ADDLABELKEY)}>
          新标签
        </Button>
        {/* <Button type="primary" ghost onClick={saveLabels}>
          确认
        </Button> */}
      </div>
    </div>
  )

  return (
    <Popover
      title={null}
      overlayStyle={{ width: 260 }}
      visible={labelVisible}
      content={getPopoverContent()}
      trigger="click"
      onVisibleChange={val => setLabelVisible(checkDisabled() ? false : val)}
      placement="bottom"
      getPopupContainer={targetElement => targetElement.parentElement}
    >
      {props.children}
    </Popover>
  )
}
/**
 * 标签弹窗组件
 * @param {*} props React.props
 * @returns {JSX.Element}
 */
export default connect()(LabelSelect)
