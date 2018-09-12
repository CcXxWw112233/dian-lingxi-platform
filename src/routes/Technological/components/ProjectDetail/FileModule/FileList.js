
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input } from 'antd';
import CreatDirector from './CreatDirector'
import globalStyles from '../../../../../globalset/css/globalClassName.less'


const bodyOffsetHeight = document.querySelector('body').offsetHeight

export default class FileList extends React.Component {
  state = {
    //排序，tru为升序，false为降序
    nameSort: true,
    sizeSort: true,
    founderSort: true,
  };
  //table变换
  handleChange = (pagination, filters, sorter) => {

  }
  //选择框单选或者全选
  onSelectChange = (selectedRowKeys) => {
    this.props.updateDatas({ selectedRowKeys });
    console.log(selectedRowKeys)
  }

  //item操作
  operationMenuClick(id) {
    console.log(id)
  }

  //列表排序, 有限排序文件夹
  normalSort(filedata_1, filedata_2, key, state) {
    const that = this
    filedata_1.sort(function(a,b){
      if(that.state[state]) {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
    filedata_2.sort(function(a,b){
      if(that.state[state]) {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
    this.props.updateDatas({
      fileList: [...filedata_1, ...filedata_2]
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
  sizeSort(filedata_1, filedata_2, key, state) {
    const that = this
    filedata_1.sort(function(a, b){
      if(that.state[state]) {
        return that.fiterSizeUnit(a[key]) - that.fiterSizeUnit(b[key]);
      } else {
        return that.fiterSizeUnit(b[key]) - that.fiterSizeUnit(a[key])
      }
    });
    filedata_2.sort(function(a, b){
      if(that.state[state]) {
        return that.fiterSizeUnit(a[key]) - that.fiterSizeUnit(b[key]);
      } else {
        return that.fiterSizeUnit(b[key]) - that.fiterSizeUnit(a[key])
      }
    });
    this.props.updateDatas({
      fileList: [...filedata_1, ...filedata_2]
    })
  }
  listSort(key) {
    const { datas = {} } = this.props.model
    const {  fileList, filedata_1, filedata_2, selectedRowKeys } = datas
    switch (key) {
      case '1':
        this.setState({
          nameSort: !this.state.nameSort
        },function () {
          this.normalSort(filedata_1, filedata_2, 'name', 'nameSort')
        })
        break
      case '2':
        this.setState({
          sizeSort: !this.state.sizeSort
        },function () {
          this.sizeSort(filedata_1, filedata_2, 'size', 'sizeSort')
        })
        break
      case '3':
        this.setState({
          founderSort: !this.state.founderSort
        },function () {
          this.normalSort(filedata_1, filedata_2, 'founder', 'founderSort')
        })
        break
      default:
        break
    }
    //排序的时候清空掉所选项
    this.props.updateDatas({selectedRowKeys: []})

  }

  //文件名类型
  judgeFileType(fileName) {
    let themeCode = ''
    const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase()
    switch (type) {
      case '.xls':
        themeCode = '&#xe6d5;'
        break
      case '.png':
        themeCode = '&#xe6d4;'
        break
      case '.xlsx':
        themeCode = '&#xe6d3;'
        break
      case '.ppt':
        themeCode = '&#xe6d2;'
        break
      case '.gif':
        themeCode = '&#xe6d1;'
        break
      case '.jpeg':
        themeCode = '&#xe6d0;'
        break
      case '.pdf':
        themeCode = '&#xe6cf;'
        break
      case '.docx':
        themeCode = '&#xe6ce;'
        break
      case 'txt':
        themeCode = '&#xe6cd;'
        break
      case '.doc':
        themeCode = '&#xe6cc;'
        break
      case '.jpg':
        themeCode = '&#xe6cb;'
        break
      default:
        themeCode = '&#xe6cb;'
        break
    }
    return themeCode
  }

  //文件夹或文件点击
  open(data) {
    const { datas = {} } = this.props.model
    const { breadcrumbList = [], currentParrentDirectoryId } = datas
    const { parrentId, id } = data
    if(parrentId === currentParrentDirectoryId){
      breadcrumbList.push(data)
    }else {
      breadcrumbList[breadcrumbList.length - 1] = data
    }
    this.props.updateDatas({breadcrumbList, currentParrentDirectoryId: id})
  }
  openDirectory(data) {
    this.open(data)
    //接下来做文件夹请求的操作带id
  }
  openFile(data) {
    this.open(data)
    //接下来打开文件
    this.props.updateDatas({isInOpenFile: true})
  }

  render() {
    const { datas = {} } = this.props.model
    const { selectedRowKeys, fileList } = datas
    const {  nameSort, sizeSort, founderSort, } = this.state;

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
        key: 'name',
        render: ({type, name, isInAdd, id, parrentId}) => {
          if(isInAdd) {
            return(
              <CreatDirector {...this.props} />
            )
          }else {
            return(type === '1' ?
              (<span onClick={this.openDirectory.bind(this,{type, name, isInAdd, id, parrentId} )}><i className={globalStyles.authTheme} style={{fontStyle: 'normal',fontSize: 22, color: '#1890FF', marginRight: 8, cursor: 'pointer' }}>&#xe6c4;</i>{name}</span>)
              : (<span onClick={this.openFile.bind(this,{type, name, isInAdd, id, parrentId} )} ><i className={globalStyles.authTheme} style={{fontStyle: 'normal',fontSize: 22, color: '#1890FF', marginRight: 8, cursor: 'pointer' }} dangerouslySetInnerHTML={{__html: this.judgeFileType(name)}}></i>{name}</span>))
          }
        }
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
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: data => ({
              disabled: data.isInAdd === true, // Column configuration not to be checked
            }),
          }}
          columns={columns}
          dataSource={fileList}
          pagination={false}
          rowClassName={indexStyles.tableRow}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    )
  }
}
