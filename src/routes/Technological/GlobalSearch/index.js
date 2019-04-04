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

  render() {

    const { searchTypeList = [], defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number } = this.props.model

    const searchEle = () => {
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

    return(
      <Modal
        visible={globalSearchModalVisible}
        zIndex={1010}
        footer={false}
        destroyOnClose={false}
        onCancel={this.onCancel.bind(this)}>
        {searchEle()}
        <SearchResult defaultSearchType={defaultSearchType} spinning={spinning} page_number={page_number}/>
      </Modal>
    )
  }
}

function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number} } }) {
  return {
    model: { searchTypeList, defaultSearchType, searchInputValue, globalSearchModalVisible, spinning, page_number },
  }
}
