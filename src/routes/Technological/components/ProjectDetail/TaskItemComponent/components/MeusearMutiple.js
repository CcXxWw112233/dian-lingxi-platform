import React from 'react'
// import MenuSearchStyles from './MenuSearch.less'
import { Icon, Input, Button, DatePicker, Menu, Spin } from 'antd'
import indexStyles from './menuseachNultiple.less'

// props => Inputlaceholder searchName listData  keyCode=>列表唯一标识字段，不能直接用map的key 。selectedKeys默认选中
//父组件设置方法， Dropdown visible设置为dropDonwVisible
// onVisibleChange(e,a){
//   this.setState({
//     dropDonwVisible: e
//   })
// }
export default class MenuSearchMultiple extends React.Component {
  state = {
    resultArr: [],
    keyWord: '',
    selectedKeys: []
  }
  componentWillMount() {
    const { keyWord } = this.state
    let selectedKeys = []
    const { listData = [], searchName, currentSelect = [] } = this.props
    for (let val of currentSelect) {
      selectedKeys.push(val['user_id'])
    }
    this.setState(
      {
        selectedKeys
      },
      () => {
        this.setState({
          resultArr: this.fuzzyQuery(listData, searchName, keyWord)
        })
      }
    )
  }
  componentWillReceiveProps(nextProps) {
    // const { keyWord } = this.state
    // const { listData,searchName } = nextProps
    // this.setState({
    //   resultArr: this.fuzzyQuery(listData, searchName, keyWord)
    // })
  }
  //模糊查询
  handleMenuReallySelect = e => {
    this.setSelectKey(e)
  }
  handleMenuReallyDeselect(e) {
    this.setSelectKey(e)
  }
  setSelectKey(e) {
    const { key, selectedKeys } = e
    if (!key) {
      return false
    }
    this.setState(
      {
        selectedKeys
      },
      () => {
        const { listData = [], searchName } = this.props
        const { keyWord } = this.state
        this.setState({
          resultArr: this.fuzzyQuery(listData, searchName, keyWord)
        })
      }
    )
    this.props.chirldrenTaskChargeChange({ selectedKeys })
  }
  onCheck() {
    if (this.props.onCheck && typeof this.props.onCheck === 'function') {
      this.props.onCheck(this.state.selectedKeys)
    }
  }
  fuzzyQuery = (list, searchName, keyWord) => {
    var arr = []
    for (var i = 0; i < list.length; i++) {
      if (list[i][searchName].indexOf(keyWord) !== -1) {
        arr.push(list[i])
      }
    }

    //添加任务执行人后往前插入
    const { selectedKeys } = this.state
    for (let i = 0; i < arr.length; i++) {
      if (selectedKeys.indexOf(arr[i]['user_id']) != -1) {
        if (i > 0 && selectedKeys.indexOf(arr[i - 1]['user_id']) == -1) {
          const deItem = arr.splice(i, 1)
          arr.unshift(...deItem)
        }
      }
    }
    return arr
  }
  onChange = e => {
    const { listData = [], searchName } = this.props
    const keyWord = e.target.value
    const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
    this.setState({
      keyWord,
      resultArr
    })
  }
  render() {
    const { keyWord, resultArr, selectedKeys = [] } = this.state
    const {
      Inputlaceholder = '搜索',
      searchName,
      menuSearchSingleSpinning,
      keyCode
    } = this.props

    return (
      <Menu
        style={{
          padding: '8px 0px',
          boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)',
          maxWidth: 200
        }}
        selectedKeys={selectedKeys}
        onDeselect={this.handleMenuReallyDeselect.bind(this)}
        onSelect={this.handleMenuReallySelect.bind(this)}
        multiple
      >
        <div style={{ margin: '0 10px 10px 10px' }}>
          <Input
            placeholder={Inputlaceholder}
            value={keyWord}
            onChange={this.onChange.bind(this)}
          />
        </div>
        {resultArr.map((value, key) => {
          const { avatar, name, user_name, user_id } = value
          return (
            <Menu.Item
              className={indexStyles.menuItem}
              style={{
                height: 32,
                lineHeight: '32px',
                margin: 0,
                padding: '0 10px'
              }}
              key={value[keyCode]}
            >
              <div className={indexStyles.menuItemDiv}>
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={user_id}
                >
                  {avatar ? (
                    <img
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20,
                        marginRight: 4
                      }}
                      src={avatar}
                    />
                  ) : (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: '#f5f5f5',
                        marginRight: 4
                      }}
                    >
                      <Icon
                        type={'user'}
                        style={{
                          fontSize: 12,
                          marginLeft: 10,
                          color: '#8c8c8c'
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      overflow: 'hidden',
                      verticalAlign: ' middle',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 90,
                      marginRight: 8
                    }}
                  >
                    {name || user_name || '佚名'}
                  </div>
                </div>
                <div
                  style={{
                    display:
                      selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none'
                  }}
                >
                  <Icon type="check" />
                </div>
              </div>
            </Menu.Item>
          )
        })}
        {/*<div className={indexStyles.checkOk} onClick={this.onCheck.bind(this)}>确定</div>*/}
      </Menu>
      //       {/*<Spin spinning={menuSearchSingleSpinning} size={'small'}>*/}
      //   </Spin>
    )
  }
}
