import React from 'react'
import { Modal, Form, Button, Input, message, Select, Spin, Icon } from 'antd'
import indexstyles from './index.less'
import globalStyles from './../../../../../globalset/css/globalClassName.less'
// import debounce from 'lodash/debounce';
import {connect} from "dva/index";

const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

const splitStingQuot = '_%_#/@_$_'

function getDisplayName(ele) {
  if (typeof ele.type === 'string') {
    return ele.type;
  }
  return ele.type.name || ele.type.displayName || 'No Name';
}

function getAttrs(attrs) {
  return Object.keys(attrs).map(attr => (attr === 'children' ? '' : `${attr}="${attrs[attr]}"`)).join('');
}

function transfer(ele) {
  if (typeof ele === 'string' || typeof ele === 'number') {
    return ele;
  }

  const props = ele.props || {};
  const children = React.Children.toArray(props.children || []);

  const html = children.map(transfer);
  const tag = getDisplayName(ele);

  return `<${tag} ${getAttrs(props)}>${html.join('')}</${tag}>`;
}

//应用与
@connect(mapStateToProps)
export default class CondistionInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      match_conditions_area_height: 40, //搜索框高度，也当作条件列表距离搜索框底部高度
    }
    this.conditaion_area_input_ref = React.createRef()
  }

  componentDidMount() {
    this.set_match_conditions_area_height()
    this.set_conditions_content()
  }

  //设置//搜索框高度，也当作条件列表距离搜索框底部高度
  set_match_conditions_area_height = () => {
    const target = this.conditaion_area_input_ref;
    const { current } = target
    const { clientHeight } = current
    this.setState({
      match_conditions_area_height: clientHeight
    })
  }

  //设置输出框的内容
  set_conditions_content = () => {
    const target = this.conditaion_area_input_ref;
    const { current: { innerHTML } } = target
    this.parseContent(innerHTML)
  }

  //解析框内的内容
  parseContent = (innerHTML) => {
    // console.log('sss1', innerHTML)
    const id = 'conditions_content_'
    const ele = document.createElement('div')
    ele.id = id
    ele.innerHTML = innerHTML
    if(!ele.childNodes[0]) {
      return
    }
    const nodeList = ele.childNodes[0].childNodes;
    console.log('sss2', nodeList)
  }

  onInput = e => {
    this.set_match_conditions_area_height()
    const innerHTML = e.target.innerHTML
    this.set_conditions_content()
  }

  //选择条件
  selectCondition = (val) => {
    const { id, value, parent_name, name } = val
    const { selected_conditions = [], dispatch } = this.props
    const obj = { id, value, parent_name, name }
    const arr = selected_conditions.push(obj)
    dispatch({
      type: 'globalSearch/updateDatas',
      payload: {
        selected_conditions
      }
    })
    this.dynamicRenderEditContent(selected_conditions)
  }

  //搜索出来的条件列表
  renderMatchConditions = () => {
    const { match_conditions = [] } = this.props
    const { match_conditions_area_height = 40 } = this.state

    return (
      <div
        style={{top: match_conditions_area_height}}
        className={`${globalStyles.global_card} ${indexstyles.match_conditions_area} ${globalStyles.global_vertical_scrollbar}`}>
        {
          match_conditions.map((val, key) => {
            const { id, value, parent_name, name } = val
            return (
              <div className={indexstyles.match_conditions_item} onClick={() => this.selectCondition(val)} key={id}>
                <div className={indexstyles.match_conditions_item_title}>{parent_name}</div>
                <div className={indexstyles.match_conditions_item_detail}>{name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  //动态渲染输入框
  dynamicRenderEditContent = () => {
    const { selected_conditions = [] } = this.props
    const target = document.getElementById('conditaion_area_input_ref')
    target.innerHTML = transfer(this.renderEditContent())
    this.set_match_conditions_area_height()
    this.parseContent(target.innerHTML)
  }

  //选择的条件列表
  renderEditContent = () => {
    const { selected_conditions = [] } = this.props

    const itemStyle = `background-color: red;color: #ffffff;height: 24px; background:rgba(89,89,89,1);
                 display: inline-block; height: 24px;line-height: 24px; padding: 0 6px;color: #FFFFFF;
                  font-size: 12px; border-radius: 4px;margin-right: 6px; margin-bottom: 6px;`
    return (
      <div>
        <div className={`${indexstyles.conditions}`}>
          {
            selected_conditions.map((val, key) => {
              const { id, name } = val
              return (
                <div
                  contenteditable="false"
                  data-value={JSON.stringify(val)}
                  className={`${indexstyles.condition_item}`}
                  style={itemStyle}
                  key={id}>
                  {name}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    const { style, selected_conditions = [] } = this.props

    return(
      <div style={style} className={indexstyles.search_out_right} >
        <div contentEditable="true"
             suppressContentEditableWarning="true"
             placeholder="请输入"
             id={'conditaion_area_input_ref'}
             ref={this.conditaion_area_input_ref}
             className={`${indexstyles.input_out}`}
             onInput={this.onInput}>
          {/*{this.renderEditContent()}*/}
        </div>
        {this.renderMatchConditions()}
        {/*<div >*/}
          {/*<div className="index__conditions___2pyNI">*/}
            {/*<div contenteditable="false"data-value="{"id":1,"value":11,"parent_name":111,"name":1111}"className="index__condition_item___3bWsc">*/}
              {/*1111*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      </div>
    )
  }
}
function mapStateToProps({ globalSearch: { datas: { match_conditions, selected_conditions, isInMatchCondition } } }) {
  return {
    match_conditions, selected_conditions, isInMatchCondition
  }
}
