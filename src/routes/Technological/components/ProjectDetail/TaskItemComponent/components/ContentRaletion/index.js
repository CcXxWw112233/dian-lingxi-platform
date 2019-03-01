import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import RaletionDrop from './RaletionDrop'

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  isLeaf: false,
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  isLeaf: false,
}];

export default class ContentRaletion extends React.Component {
  state = {
    options
  }

  onChange(value, e, a) {
    console.log('11111', value, e, a)
  }

  loadData = (selectedOptions) => {
    console.log('11111', selectedOptions)

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [{
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      }];
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  }
  cascaderOnBlur(e) {
    console.log('11111', e)

  }
  render() {

    return(
      <div>
        <Cascader options={options}
                  onChange={this.onChange.bind(this)}
                  loadData={this.loadData.bind(this)}
                  autoFocus
                  size={'small'}
                  changeOnSelect
                  showSearch
                  // popupVisible
                  blur={this.cascaderOnBlur.bind(this)}
                  style={{width: 300}}
                  placeholder={'请选择'}
        />
      </div>
    )
  }
}
