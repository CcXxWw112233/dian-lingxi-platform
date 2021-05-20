import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox } from 'antd'
import styles from './index.less'
import {
  milestone_base_height,
  task_item_height,
  task_item_margin_top
} from '../../constants'

const CheckboxGroup = Checkbox.Group

@connect(mapStateToProps)
export default class BatchOperateCheckbox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.recusionCheckOutlineIds(1)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.outline_tree.length !== nextProps.outline_tree.length) {
      this.recusionCheckOutlineIds(2)
    }
  }
  recusionCheckOutlineIds = flag => {
    const { outline_tree = [] } = this.props
    let realy_outline_tree_round_ids = [] //大纲树递归获取数据成为一维数组
    const recusion = arr => {
      for (let val of arr) {
        if (val.id) {
          realy_outline_tree_round_ids.push(val.id)
        }
        if (val.children?.length) {
          recusion(val.children)
        }
      }
    }
    recusion(outline_tree)
    this.setState({
      realy_outline_tree_round_ids
    })
  }

  onCheckAllChange = () => {
    const { batch_opetate_ids = [], dispatch } = this.props
    const { realy_outline_tree_round_ids = [] } = this.state
    let _batch_opetate_ids = []
    if (
      batch_opetate_ids.length &&
      batch_opetate_ids.length === realy_outline_tree_round_ids.length
    ) {
      //如果原来为全选，就变为空
    } else {
      //其它情况下，没有已选或者选了一部分，都变为全选
      _batch_opetate_ids = realy_outline_tree_round_ids
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: _batch_opetate_ids
      }
    })
  }
  singleChange = ({ target }) => {
    const { batch_opetate_ids = [], dispatch } = this.props
    const { checked, value } = target
    let _batch_opetate_ids = [...batch_opetate_ids]
    if (!checked) {
      _batch_opetate_ids = batch_opetate_ids.filter(item => item != value)
    } else {
      _batch_opetate_ids.push(value)
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: _batch_opetate_ids
      }
    })
  }
  render() {
    const {
      batch_operating,
      outline_tree_round = [],
      ceiHeight,
      batch_opetate_ids
    } = this.props
    // const { indeterminate, checkAll } = this.state
    return (
      <>
        {batch_operating && (
          <div
            className={styles.checbox_group_wrapper}
            style={{
              height: outline_tree_round.length * ceiHeight
            }}
          >
            <div style={{ marginTop: 8 }}>
              {/* <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
              ></Checkbox> */}
              <div style={{ height: 22, width: 20 }}></div>
            </div>
            <div style={{ marginTop: 12 }}>
              {outline_tree_round.map(item => {
                const { id, add_id } = item
                return (
                  <div
                    key={id || add_id}
                    style={{
                      height: task_item_height,
                      marginBottom: task_item_margin_top
                    }}
                  >
                    {id ? (
                      <Checkbox
                        value={id}
                        onChange={this.singleChange}
                        checked={batch_opetate_ids.includes(id)}
                      />
                    ) : (
                      ' '
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      outline_tree,
      outline_tree_round = [],
      batch_opetate_ids,
      batch_operating,
      ceiHeight
    }
  }
}) {
  return {
    outline_tree,
    batch_opetate_ids,
    batch_operating,
    outline_tree_round,
    ceiHeight
  }
}
