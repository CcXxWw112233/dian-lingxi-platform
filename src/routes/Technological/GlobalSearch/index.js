import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import SearchResult from './SearchResult'
import { INPUT_CHANGE_SEARCH_TIME } from '../../../globalset/js/constant'
import {connect} from "dva/index";
import {getSearchOrganizationList} from "../../../services/technological/organizationMember";
const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
const getEffectOrReducerByName = name => `globalSearch/${name}`
@connect(mapStateToProps)
export default class GlobalSearch extends React.Component {
  state = {
    searchTimer: null,
  }

  constructor() {
    super()
    this.selectTypeChange = this.selectTypeChange.bind(this)
    this.inputChange = this.inputChange.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('getGlobalSearchTypeList'),
      payload: {
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  onCancel() {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        globalSearchModalVisible: false
      }
    })
  }

  selectTypeChange(value) {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        defaultSearchType: value,
        page_number: 1,
        // allTypeResultList: [],
        // sigleTypeResultList: []
      }
    })
    dispatch({
      type: getEffectOrReducerByName('getGlobalSearchResultList'),
      payload: {}
    })
  }

  inputChange(e) {
    const that = this
    const value = e.target.value
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        searchInputValue: value,
        page_number: 1,
        // allTypeResultList: [],
        // sigleTypeResultList: []
      }
    })
    const { searchTimer } = this.state
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    this.setState({
      searchTimer: setTimeout(function () {
        dispatch({
          type: getEffectOrReducerByName('getGlobalSearchResultList'),
          payload: {}
        })
      }, INPUT_CHANGE_SEARCH_TIME)
    })
  }

  //搜索查询区域
  renderFixedConditions = () => {
    return (
      <div className={indexstyles.fixed_conditions_area}>
        <div className={indexstyles.fixed_conditions_area_left}>
          <div className={indexstyles.fixed_conditions_area_left_item}>近期完成的任务</div>
          <div className={indexstyles.fixed_conditions_area_left_item}>最近添加的内容</div>
        </div>
        <div className={`${indexstyles.fixed_conditions_area_right} ${globalStyles.authTheme}`}>&#xe66f;</div>
      </div>
    )
  }

  renderMatchConditions = () => {
    const { match_conditions = [1, 2, 3, 4, 5] } = this.props
    return (
      <div className={`${globalStyles.global_card} ${indexstyles.match_conditions_area} ${globalStyles.global_vertical_scrollbar}`}>
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
  renderInputSearch = () => {
    const { searchTypeList = [], defaultSearchType, searchInputValue } = this.props
    return (
      <div style={{paddingTop: 20}} >
        <InputGroup compact size={'large'}>
          <Select value={defaultSearchType} size={'large'} onChange={this.selectTypeChange} style={{ width: '16%', fontSize: 14 }} suffixIcon={<Icon type="caret-down" />}>
            {searchTypeList.map((value, key) => {
              const { search_type, name } = value
              return (
                <Option value={search_type} key={key}>{name || ''}</Option>
              )
            })}
          </Select>
          <Input style={{ width: '84%', fontSize: 14 }}
                 value={searchInputValue}
                 onChange={this.inputChange}
                 placeholder={'请输入'} suffix={<i className={globalStyles.authTheme}>&#xe611;</i>}/>
        </InputGroup>
      </div>
    )
  }
  renderSearchEle = () => {
    const { isInMatchCondition } = this.props
    return (
      <div className={`${indexstyles.searchAreaOut}`}>
        {this.renderInputSearch()}
        {/*{this.renderFixedConditions()}*/}
        {/*{this.renderMatchConditions()}*/}
      </div>
    )
  }

  render() {

    const { defaultSearchType, globalSearchModalVisible, spinning, page_number } = this.props

    return(
      <Modal
        visible={globalSearchModalVisible}
        zIndex={1010}
        footer={false}
        destroyOnClose={false}
        onCancel={this.onCancel.bind(this)}>
        <div className={indexstyles.modal_out}>
          {this.renderSearchEle()}
          <SearchResult defaultSearchType={defaultSearchType} spinning={spinning} page_number={page_number}/>
        </div>
      </Modal>
    )
  }
}

function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number, isInMatchCondition} } }) {
  return {
    searchTypeList, defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number, isInMatchCondition
  }
}
