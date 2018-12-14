import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Drawer } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'

export default class FileDetailContent extends React.Component {

  versionItemClick({value, key}){
    const { file_resource_id } = value
    this.props.updateDatas({filePreviewCurrentVersionKey: key, filePreviewCurrentId: file_resource_id})
    this.props.filePreview({id: file_resource_id})
  }
  render() {
    const { datas: { isExpandFrame = false, filePreviewUrl, filePreviewIsUsable, filePreviewCurrentId, filePreviewCurrentVersionList=[], filePreviewCurrentVersionKey=0 } }= this.props.model

    const  getIframe = (src) => {
      const iframe = '<iframe style="height: 100%;width: 100%" class="multi-download"  src="'+src+'"></iframe>'
      return iframe
    }

    const getVersionItem = (value, key ) => {
      const { file_name, creator, update_time, file_size } = value
      return (
        <div className={indexStyles.versionInfoListItem} onClick={this.versionItemClick.bind(this,{value, key})}>
          <div className={filePreviewCurrentVersionKey === key ?indexStyles.point : indexStyles.point2}></div>
          <div className={indexStyles.name}>{creator}</div>
          <div className={indexStyles.info}>上传于{update_time}</div>
          <div className={indexStyles.size}>{file_size}</div>
        </div>
      )
    }

    return (
      <div className={indexStyles.fileDetailContentOut}>
        {filePreviewIsUsable? (
          <div className={indexStyles.fileDetailContentLeft}
               dangerouslySetInnerHTML={{__html: getIframe(filePreviewUrl)}}></div>
        ):(
          <div className={indexStyles.fileDetailContentLeft} style={{display: 'flex',justifyContent:'center',alignItems: 'center', fontSize: 16,color: '#595959'}}>
            <div>
              当前文件不支持预览，您可点击下载再进行查看
            </div>
          </div>
        )}

        <div className={indexStyles.fileDetailContentRight} style={{width: isExpandFrame?0:420}}>
          <div className={indexStyles.fileDetailContentRight_top}>
             <div>版本信息</div>
             <div className={indexStyles.versionInfoList}>
               {filePreviewCurrentVersionList.map((value, key ) => {
                 return (<div key={key}>{getVersionItem(value, key )}</div>)
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
