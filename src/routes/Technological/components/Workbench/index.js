import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import CardContent from './CardContent'
import Header from './Header'

const getEffectOrReducerByName = name => `workbench/${name}`

const Workbench = (props) => {
  const { dispatch, model, modal } = props
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
  const cardContentListProps = {
    modal,
    model,
    completeTask(data) {
      dispatch({
        type: getEffectOrReducerByName('completeTask'),
        payload: data
      })
    },
    getResponsibleTaskList(data) {
      dispatch({
        type: getEffectOrReducerByName('getResponsibleTaskList'),
        payload: data
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route:path,
        },
      })
    }
  }
  return(
    <div>
      <Header />
       <div className={indexStyles.workbenchOut}>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'我负责的任务'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'1'}/>
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我关注的任务'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'2'} />
        </div>
      </div>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'待我处理的流程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'3'} />
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我参与的流程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'4'} />
        </div>
      </div>
      <div className={indexStyles.cardItem}>
        <div className={indexStyles.cardItem_left}>
          <CardContent title={'我收藏的文档'} {...cardContentListProps} updateDatas={updateDatas}CardContentType={'5'} />
        </div>
        <div className={indexStyles.cardItem_right}>
          <CardContent title={'我上传的文档'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'6'}/>
        </div>
      </div>
    </div>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, workbench, loading }) {
  return { modal, model: workbench, loading }
}
export default connect(mapStateToProps)(Workbench)


