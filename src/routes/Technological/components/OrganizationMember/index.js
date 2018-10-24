import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import Header from './Header'
import CreateGroup from './CreateGroup'

const getEffectOrReducerByName = name => `organizationMember/${name}`

const OrganizationMember = (props) => {
  const { dispatch, model, modal } = props
  const CreateGroupProps = {
    modal,
    model,
    CreateGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('CreateGroup'),
        payload: data,
      })
    },
    removeMembersWithGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('removeMembersWithGroup'),
        payload: data,
      })
    },
    setMemberWitchGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('setMemberWitchGroup'),
        payload: data,
      })
    },
  }

  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route:path,
      },
    })
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }
  return(
    <div className={indexStyles.OMout} style={{ minHeight: '100%', height: 'auto' , position: 'relative',width: '100%', overflow: 'hidden'}}>
      <Header />
      <CreateGroup {...CreateGroupProps} updateDatas={updateDatas} />
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, organizationMember, loading }) {
  return { modal, model: organizationMember, loading }
}
export default connect(mapStateToProps)(OrganizationMember)


