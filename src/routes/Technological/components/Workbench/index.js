import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import CardContent from './CardContent'
import Header from './Header'
import CardContentArticle from './CardContent/CardContentArticle'
import {WE_APP_TYPE_KNOW_CITY, WE_APP_TYPE_KNOW_POLICY} from "../../../../globalset/js/constant";

const getEffectOrReducerByName = name => `workbench/${name}`

const Workbench = (props) => {
  // console.log(props)
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
    getArticleList(data) {
      dispatch({
        type: getEffectOrReducerByName('getArticleList'),
        payload: data
      })
    },
    getArticleDetail(data) {
      dispatch({
        type: getEffectOrReducerByName('getArticleDetail'),
        payload: data
      })
    },
    updateViewCounter(data) {
      dispatch({
        type: getEffectOrReducerByName('updateViewCounter'),
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
          <CardContent title={'项目统计'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'projectCount'}/>
          <CardContent title={'会议安排'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'meeting'}/>
          <CardContent title={'我负责的任务'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'task'}/>
          <CardContent title={'审核进程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'waitingDoFlows'}/>
          <CardContent title={'我的文档'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'file'}/>
          <CardContentArticle title={'优秀案例'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'case'} appType={WE_APP_TYPE_KNOW_CITY} />
          <CardContent title={'隐翼地图'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'map'}/>
          <CardContentArticle title={'政策法规'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'policy'} appType={WE_APP_TYPE_KNOW_POLICY}/>
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


// <div className={indexStyles.cardItem}>
// <div className={indexStyles.cardItem_left}>
// <CardContent title={'待我处理的流程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'3'} />
// </div>
// <div className={indexStyles.cardItem_right}>
//   <CardContent title={'我参与的流程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'4'} />
//   </div>
// </div>
// <div className={indexStyles.cardItem}>
//   <div className={indexStyles.cardItem_left}>
//     <CardContent title={'我收藏的文档'} {...cardContentListProps} updateDatas={updateDatas}CardContentType={'5'} />
//   </div>
//   <div className={indexStyles.cardItem_right}>
//   <CardContent title={'我上传的文档'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'6'}/>
// </div>
// </div>
