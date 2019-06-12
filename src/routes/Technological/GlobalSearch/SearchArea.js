import React from 'react'
import { Input, Select, Icon } from 'antd'
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import { INPUT_CHANGE_SEARCH_TIME } from '../../../globalset/js/constant'
import ConditionInput from './components/CondistionInput/index'
import {connect} from "dva/index";
const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
const getEffectOrReducerByName = name => `globalSearch/${name}`
@connect(mapStateToProps)
export default class SearchArea extends React.Component {
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
  //固定条件
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
  //匹配条件
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
  //整体查询输入区域
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
          <ConditionInput
            style={{ width: '78%', fontSize: 14 }}
            value={searchInputValue}
            onChange={this.inputChange}
            placeholder={'请输入'}
          />
          <div className={`${indexstyles.search_trigger}`} style={{width: '6%'}} onClick={this.getGlobalSearchResult}>
            <i className={globalStyles.authTheme}>&#xe611;</i>
          </div>
          {/*<Input style={{ width: '84%', fontSize: 14 }}*/}
                 {/*value={searchInputValue}*/}
                 {/*onChange={this.inputChange}*/}
                 {/*placeholder={'请输入'} suffix={<i className={globalStyles.authTheme}>&#xe611;</i>}/>*/}
        </InputGroup>
      </div>
    )
  }

  getGlobalSearchResult = () => {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('getGlobalSearchResultList'),
      payload: {}
    })
  }

  render() {

    return(
      <div className={`${indexstyles.searchAreaOut}`}>
        {this.renderInputSearch()}
        <div style={{height: 28}}>
         {this.renderFixedConditions()}
        </div>
        {/*{this.renderMatchConditions()}*/}
      </div>
    )
  }
}

function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number, isInMatchCondition} } }) {
  return {
    searchTypeList, defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number, isInMatchCondition
  }
}
