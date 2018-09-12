import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Drawer } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'

export default class FileDetailContent extends React.Component {
  state = {
    currentVersionKey: 0
  }
  versionItemClick({value, key}){
    this.setState({
      currentVersionKey: key
    })
  }
  render() {
    const  getIframe = (src) => {
      const iframe = '<iframe style="height: 100%;width: 100%" class="multi-download"  src="'+src+'"></iframe>'
      return iframe
    }
    const  src = ''
    const versionList = [1,2,3]
    const { currentVersionKey } = this.state

    const getVersionItem = (value, key ) => {
      return (
        <div className={indexStyles.versionInfoListItem} key ={key} onClick={this.versionItemClick.bind(this,{value, key})}>
          <div className={currentVersionKey === key ?indexStyles.point : indexStyles.point2}></div>
          <div className={indexStyles.name}>闫世伟</div>
          <div className={indexStyles.info}>上传于2018-08-19 25:33</div>
          <div className={indexStyles.size}>265.9mb</div>
        </div>
      )
    }

    return (
      <div className={indexStyles.fileDetailContentOut}>
        <div className={indexStyles.fileDetailContentLeft}
             dangerouslySetInnerHTML={{__html: getIframe(src)}}></div>
        <div className={indexStyles.fileDetailContentRight}>
          <div className={indexStyles.fileDetailContentRight_top}>
             <div>版本信息</div>
             <div className={indexStyles.versionInfoList}>
               {versionList.map((value, key ) => {
                 return getVersionItem(value, key )
               })}
             </div>
          </div>
        </div>
      </div>
    )
  }
}








// <Drawer
//   mask={false}
//   placement="right"
//   closable={false}
//   visible={true}
//   maskClosable={true}
//   width={420}
//   top={172}
//   zIndex={1010}
//   maskStyle={{top: 60}}
{/*>*/}
  {/*<div>sasd</div>*/}
{/*</Drawer>*/}
