import React from 'react'
import { Modal, Form, Button, Input, message, Select, Spin, Icon } from 'antd'
import indexstyles from './index.less'
import globalStyles from './../../../../../globalset/css/globalClassName.less'
import debounce from 'lodash/debounce';

const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

const splitStingQuot = '_%_#/@_$_'
//应用与
export default class CondistionInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      conditions_content: '',
      match_conditions_area_height: 40, //搜索框高度，也当作条件列表距离搜索框底部高度
    }
    this.conditaion_area_input_ref = React.createRef()
  }

  componentDidMount() {
    this.set_match_conditions_area_height()
  }

  set_match_conditions_area_height() {
    const target = this.conditaion_area_input_ref;
    const { current } = target
    const { clientHeight, clientWidth } = current
    this.setState({
      match_conditions_area_height: clientHeight
    })
  }

  onInput = e => {
    this.set_match_conditions_area_height()
    const innerHTML = e.target.innerHTML
    this.setState({
      conditions_content: innerHTML
    })
  }

  renderMatchConditions = () => {
    const { match_conditions = [1, 2, 3, 4, 5] } = this.props
    const { match_conditions_area_height = 40 } = this.state

    return (
      <div
        style={{top: match_conditions_area_height}}
        className={`${globalStyles.global_card} ${indexstyles.match_conditions_area} ${globalStyles.global_vertical_scrollbar}`}>
        {
          match_conditions.map((value, key) => {
            return (
              <div className={indexstyles.match_conditions_item}>
                <div className={indexstyles.match_conditions_item_title}>名称匹配</div>
                <div className={indexstyles.match_conditions_item_detail}>标题中包含：pdf</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const { style, conditions = [1, 2, 3, 4, 51, 2,1, 2, 3, 4, 51, 2,1, 2, 3, 4, 51, 2,] } = this.props
    return(
      <div style={style} className={indexstyles.search_out_right} >
        <div contentEditable="true" resize ='none'
             placeholder="请输入"
             ref={this.conditaion_area_input_ref}
             className={`${indexstyles.input_out}`}
             onInput={this.onInput}>
          <div className={`${indexstyles.conditions}`}>
            {
              conditions.map((value, key) => {
                return (
                  <div contenteditable="false" className={`${indexstyles.condition_item}`} key={key}>
                    <span>{`sd${key}`}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
        {/*{this.renderMatchConditions()}*/}
      </div>
    )
  }
}
//    const { fetching, data, selected_value } = this.state;

// state = {
//   data: [],
//   selected_value: [],
//   fetching: false,
// };
//
// constructor (props) {
//   super(props)
//   this.lastFetchId = 0;
//   this.fetchUser = debounce(this.fetchUser, 800);
// }
// fetchUser = value => {
//   this.lastFetchId += 1;
//   const fetchId = this.lastFetchId;
//   this.setState({ data: [], fetching: true });
//   fetch('https://randomuser.me/api/?results=5')
//     .then(response => response.json())
//     .then(body => {
//       if (fetchId !== this.lastFetchId) {
//         // for fetch callback order
//         return;
//       }
//       const data = body.results.map(user => ({
//         text: `${user.name.first} ${user.name.last}`,
//         value: user.login.username,
//       }));
//       this.setState({ data, fetching: false });
//     });
// };
// handleChange = data => {
//   const selected = data.map( item => {
//     const key = item.key
//     if(key.indexOf(splitStingQuot) == -1) {
//       return item
//     }
//     const arr = key.split(splitStingQuot)
//     const obj = {
//       key: arr[0],
//       label: arr[1],
//     }
//     return obj
//   })
//   this.setState({
//     selected_value: selected,
//     data: [],
//     fetching: false,
//   });
// };
{/*<Select*/}
  {/*mode="multiple"*/}
  {/*resize={'none'}*/}
  {/*labelInValue*/}
  {/*size={'large'}*/}
  {/*suffixIcon={<Icon type="caret-down" />}*/}
  {/*value={selected_value}*/}
  {/*maxRows={1}*/}
  {/*placeholder="请输入"*/}
  {/*notFoundContent={fetching ? <Spin size="small" /> : null}*/}
  {/*filterOption={false}*/}
  {/*onSearch={this.fetchUser}*/}
  {/*onChange={this.handleChange}*/}
  {/*style={{ width: '100%', resize: 'none'}}*/}
{/*>*/}
  {/*{data.map( d => (*/}
    {/*<Option key = {`${d.value}${splitStingQuot}${d.text}`} >*/}
      {/*<div className={indexstyles.match_conditions_item}>*/}
        {/*<div className={indexstyles.match_conditions_item_title}>名称匹配</div>*/}
        {/*<div className={indexstyles.match_conditions_item_detail}>标题中包含：{d.text}</div>*/}
      {/*</div>*/}
    {/*</Option>*/}
  {/*))}*/}
{/*</Select>*/}
