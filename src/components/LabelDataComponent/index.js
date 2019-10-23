import React from 'react'
import { Input, Menu, Spin, Icon, message, Dropdown, Tooltip } from 'antd'
import indexStyles from './index.less'
import { isApiResponseOk } from "@/utils/handleResponseData"
import globalStyles from '@/globalset/css/globalClassName.less'


export default class LabelDataComponent extends React.Component {
  state = {

  }

  componentWillReceiveProps(nextProps) {

  }

  handleMenuClick = (e) => {
    const { selectedValue } = this.props;
    const { key } = e;
    if (selectedValue) {
      if (selectedValue == key) {
        this.setSelectKey(e, 'remove')
      } else {
        this.setSelectKey(e, 'update')
      }

    } else {
      this.setSelectKey(e, 'add')
    }
  }

  setSelectKey(e, type) {
    let { key, item = {} } = e;
    if (!key) {
      return false
    }
  }

  fuzzyQuery = (list, searchName, keyWord) => {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i][searchName].indexOf(keyWord) !== -1) {
        arr.push(list[i]);
      }
    }
  }

  onChange = (e) => {
    const { listData = [], searchName } = this.props
    const keyWord = e.target.value
    const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
    this.setState({
      keyWord,
      resultArr
    })
  }


  render() {
    const { Inputlaceholder = '搜索', children, keyWord } = this.props

    return (
      <div>

        <Dropdown
          trigger={['click']}
          overlay={
            <div>
              <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: 200, }}
                // selectedKeys={[selectedValue]}
                // onClick={this.handleMenuClick}
                multiple={false}
                visible={true} >

                <div style={{ margin: '0 10px 10px 10px' }}>
                  <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
                </div>

                <Menu className={globalStyles.global_vertical_scrollbar} style={{ maxHeight: '248px', overflowY: 'auto' }}>
                  <div style={{ padding: 0, margin: 0, height: 32, lineHeight: '32px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }} >
                      <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                        <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                      </div>
                      <span style={{ color: 'rgb(73, 155, 230)' }}>新建标签</span>
                    </div>
                  </div>
                </Menu>
              </Menu>
            </div>
          }
        >
          <div >
            {children}
          </div>
        </Dropdown>
      </div>

    )
  }

}
