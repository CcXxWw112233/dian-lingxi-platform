
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon } from 'antd';

const bodyOffsetHeight = document.querySelector('body').offsetHeight
// let da=['dfdsfs','1211','455','.dewdw','445fsdf','r45','_fsdf','d_tthg','东方闪电','啊啊']
// da.sort(function(a,b){
//   return a.localeCompare(b);
// });
// console.log(da);
// let aa = [21,52,32]
// aa.sort(function(a,b){
//   return a - b;
// });
// console.log(aa);


export default class FileList extends React.Component {
  state = {
    selectedRowKeys: [],//选择的列表项
    //排序，tru为升序，false为降序
    nameSort: true,
    sizeSort: true,
    founderSort: true,
  };

  //选择框单选或者全选
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  //item操作
  operationMenuClick(id) {
    console.log(id)
  }

  //table变换
  handleChange = (pagination, filters, sorter) => {

  }

  //列表排序
  normalSort(data, key, state) {
    if (!data || !Array.isArray(data)) {
      return false
    }
    const that = this
    data.sort(function(a,b){
      if(that.state[state]) {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
   this.setState({
     dataSource: data
   })
  }
  fiterSizeUnit(size) {
    let transSize
    const sizeTransNumber = parseFloat(size)
    if(size.indexOf('G') !== -1){
      transSize = 1024*1024*1024* sizeTransNumber
    }else if(size.indexOf('MB') !== -1){
      transSize = 1024*1024 * sizeTransNumber
    }else if(size.indexOf('KB') !== -1){
      transSize = 1024 * sizeTransNumber
    }else{
      transSize = sizeTransNumber
    }
    return transSize
  }
  sizeSort(data, key, state) {
    if (!data || !Array.isArray(data)) {
      return false
    }
    const that = this
    data.sort(function(a, b){
      if(that.state[state]) {
        return that.fiterSizeUnit(a[key]) - that.fiterSizeUnit(b[key]);
      } else {
        return that.fiterSizeUnit(b[key]) - that.fiterSizeUnit(a[key])
      }
    });
    this.setState({
      dataSource: data
    })
  }
  listSort(key) {
    const { dataSource } = this.props
    switch (key) {
      case '1':
        this.setState({
          nameSort: !this.state.nameSort
        },function () {
          this.normalSort(dataSource, 'name', 'nameSort')
        })
        break
      case '2':
        this.setState({
          sizeSort: !this.state.sizeSort
        },function () {
          this.sizeSort(dataSource, 'size', 'sizeSort')
        })
        break
      case '3':
        this.setState({
          founderSort: !this.state.founderSort
        },function () {
          this.normalSort(dataSource, 'founder', 'founderSort')
        })
        break
      default:
        break
    }
  }

  render() {
    const { dataSource } = this.props
    const { selectedRowKeys, nameSort, sizeSort, founderSort, } = this.state;

    const operationMenu = (id) => {
      return (
        <Menu onClick={this.operationMenuClick.bind(this, id)}>
          <Menu.Item key="1">收藏</Menu.Item>
          <Menu.Item key="2">下载</Menu.Item>
          <Menu.Item key="3">移动</Menu.Item>
          <Menu.Item key="4">复制</Menu.Item>
          <Menu.Item key="5" >移到回收站</Menu.Item>
        </Menu>
      )
    }

    const columns = [
      {
        title: <div style={{color: '#8c8c8c', cursor: 'pointer'}} onClick={this.listSort.bind(this, '1')} >文件名<Icon type={nameSort? "caret-down"  : "caret-up" } theme="outlined" style={{fontSize: 10, marginLeft: 6, color: '#595959'}}/></div>,
        dataIndex: 'name',
        key: 'name',
      }, {
        title: <div style={{color: '#8c8c8c', cursor: 'pointer'}} onClick={this.listSort.bind(this, '2')}>大小<Icon type={sizeSort? "caret-down"  : "caret-up" }  theme="outlined" style={{fontSize: 10, marginLeft: 6, color: '#595959'}}/></div>,
        dataIndex: 'size',
        key: 'size',
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },  {
        title:<div style={{color: '#8c8c8c', cursor: 'pointer'}} onClick={this.listSort.bind(this, '3')}>创建人<Icon type={founderSort? "caret-down"  : "caret-up" }  theme="outlined" style={{fontSize: 10, marginLeft: 6, color: '#595959'}}/></div>,
        dataIndex: 'founder',
        key: 'founder',
      },
      {
        title: '操作',
        key: 'operation',
        render: ({id}) =>
          <div>
            <Dropdown overlay={operationMenu(id)}>
              <Icon type="ellipsis" theme="outlined" style={{fontSize: 22, color: '#000000'}}/>
            </Dropdown>
          </div>,
      },
    ];


    return (
      <div className={indexStyles.tableOut} style={{minHeight: (bodyOffsetHeight)}}>
        <Table
          rowSelection={{selectedRowKeys, onChange: this.onSelectChange,}}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName={indexStyles.tableRow}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    )
  }
}
