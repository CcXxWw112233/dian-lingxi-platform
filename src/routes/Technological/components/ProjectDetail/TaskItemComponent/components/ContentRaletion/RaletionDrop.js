import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import { getRelationsSelectionSub, getRelationsSelectionPre } from '../../../../../../../services/technological/task'

// const options = [{
//   value: 'zhejiang',
//   label: 'Zhejiang',
//   isLeaf: false,
// }, {
//   value: 'jiangsu',
//   label: 'Jiangsu',
//   isLeaf: false,
// }];

export default class RaletionDrop extends React.Component {
  state = {
    popupVisible: true,
    options: [],
    selected: []
  }

  componentWillMount() {
    const { datas: { relations_Prefix = [] } } = this.props.model
    let options = []
    for(let val of relations_Prefix) {
      const obj = {
        value: val['board_id'],
        label: val['board_name'],
        isLeaf: false,
      }
      const children = []

      if(val['board_apps']) {
        for(let val_ of val['board_apps']) {
          const obj_ = {
            value: val_['app_key'],
            label: val_['app_name'],
            isLeaf: false,
            children: []
          }
          children.push(obj_)
        }
        if(children.length) {
          obj.children = children
        }
      }


      options.push(obj)
    }
    this.setState({
      options
    })
  }

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const length = selectedOptions.length
    const that = this

    if(length == 1) {
      this.getRelationsSelectionPre({
        board_id: targetOption.value
      }, { target: targetOption })
    } else if (length == 2){
      setTimeout(function () {
        const { selected } = that.state
        that.getRelationsSelectionSub({
          board_id: selected[0],
          app_key: selected[1]
        }, { target: targetOption })
      }, 200)

    } else {
      setTimeout(function () {
        const { selected } = that.state
        that.getRelationsSelectionSub({
          board_id: selected[0],
          app_key: selected[1],
          parent_id: selected[selected.length - 1]
        }, { target: targetOption })
      }, 200)
    }

  }

  async getRelationsSelectionPre(data, { target }) {
    target.loading = true;
    const res = await getRelationsSelectionPre(data)
    target.loading = false;

    if(res.code == '0') {
      const children = []
      for(let val of res.data) {
        const obj = {
          label: val['app_name'],
          value: val['app_key'],
          isLeaf: false,
        }
        children.push(obj)
      }
      target.children = children
      this.setState({
        options: [...this.state.options],
      });
      // debugger
    } else {

    }
  }

  async getRelationsSelectionSub(data, { target }) {
    target.loading = true;
    const res = await getRelationsSelectionSub(data)
    target.loading = false;

    if(res.code == '0') {
      const children = []
      for(let val of res.data.parent_data) {
        const obj = {
          label: val['parent_name'],
          value: val['parent_id'],
          isLeaf: false,
        }
        children.push(obj)
      }
      for(let val of res.data.content_data) {
        const obj = {
          label: val['content_name'],
          value: val['content_id'],
        }
        children.push(obj)
      }

      target.children = children
      this.setState({
        options: [...this.state.options],
      });
    } else {

    }
  }

  onChange(value) {
    console.log('eee', value)
    this.setState({
      selected: value || []
    })
  }

  onPopupVisibleChange(bool) {
    if(!bool) {
      this.props.setIsInEditContentRelation(bool)
    }
  }
  render() {
    const {
      popupVisible,
      options
    } = this.state
    const { datas: { relations_Prefix = [] } } = this.props.model
    // console.log('relations_Prefix', relations_Prefix)

    return(
      <div>
        <Cascader options={options}
                  onChange={this.onChange.bind(this)}
                  loadData={this.loadData.bind(this)}
                  autoFocus
                  popupVisible={popupVisible}
                  size={'small'}
                  changeOnSelect
                  showSearch
                  style={{width: 300}}
                  placeholder={'请选择'}
                  onPopupVisibleChange={this.onPopupVisibleChange.bind(this)}
        />
      </div>
    )
  }
}
