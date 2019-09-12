import React from 'react'
import dva, { connect } from "dva/index"
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { Icon, Divider, Tooltip, message } from 'antd';
import { MESSAGE_DURATION_TIME } from "@/globalset/js/constant";
import BoardDropdownSelect from '../../Components/DropdownSelect/BoardDropdownSelect'

const MiniBoxNavigations = (props) => {
    const { dispatch, myWorkbenchBoxList = [], workbenchBoxContentWapperModalStyle, currentSelectedWorkbenchBox = {} } = props;

    const getIsDisabled = (item) => {
        const { rela_app_id, code } = item
        const { currentUserOrganizes = [] } = props
        let isDisabled = true
        if("regulations" == code || "maps" == code) {
          if(localStorage.getItem('OrganizationId') == '0') {
              let flag = false
              for(let val of currentUserOrganizes) {
                for(let val2 of val['enabled_app_list']) {
                  if(rela_app_id == val2['app_id'] && val2['status'] == '1') {
                    flag = true
                    isDisabled = false
                    break
                  }
                }
                if(flag) {
                  break
                }
              }
          } else {
            const org = currentUserOrganizes.find(item => item.id == localStorage.getItem('OrganizationId')) || {}
            const enabled_app_list = org.enabled_app_list || []
            for(let val2 of enabled_app_list) {
              if(rela_app_id == val2['app_id'] && val2['status'] == '1') {
                isDisabled = false
                break
              }
            }
          }
        } else {
          isDisabled = false
        }
        return isDisabled
    }

    const goHome = () => {
        dispatch({
            type: 'simplemode/routingJump',
            payload: {
                route: '/technological/simplemode/home'
            }
        })
    };

    const setWorkbenchPage = (box) => {
        const isDisableds = getIsDisabled(box)
        if(isDisableds) {
            message.warn('暂无可查看的数据')
            return
        }
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                currentSelectedWorkbenchBox: box
            }
        })

    }


    return (

        <div className={indexStyles.workbenchboxsNavsWapper}>
            <div style={{ width: '100%' }}>
                <div className={indexStyles.boxnavsWapper}>
                    <Tooltip placement="bottom" title='首页' className={`${indexStyles.nav} ${indexStyles.home}`} onClick={goHome}>
                        <i className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }} >&#xe66e;</i>
                    </Tooltip>
                    <div style={{color: '#fff'}}>
                        <BoardDropdownSelect iconVisible={false} />
                    </div>
                    <Divider className={indexStyles.divider} type="vertical" />
                    {
                        myWorkbenchBoxList.map((item, key) => {
                            const { rela_app_id, id, code } = item
                            const isDisableds = getIsDisabled(item)
                            return (
                                <Tooltip key={item.id} onClick={e => setWorkbenchPage({ rela_app_id, id, code })} placement="bottom" title={item.name} className={`${indexStyles.nav} ${indexStyles.menu} ${currentSelectedWorkbenchBox.code == item.code ? indexStyles.selected : ''}`} disabled={isDisableds} key={key}>
                                  
                                    <div dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme}`} style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '24px', textShadow: '1px 2px 0px rgba(0,0,0,0.15)' }}></div>
                                    <div className={indexStyles.text}>{item.name}</div>

                                </Tooltip>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default connect(({ simplemode: {
    myWorkbenchBoxList
},
technological: {
    datas: { currentUserOrganizes }
  },
 }) => ({
    myWorkbenchBoxList,
    currentUserOrganizes
}))(MiniBoxNavigations)

