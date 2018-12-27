import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import CardContent from './CardContent'
import Header from './Header'
import CardContentArticle from './CardContent/CardContentArticle'
import {WE_APP_TYPE_KNOW_CITY, WE_APP_TYPE_KNOW_POLICY} from "../../../../globalset/js/constant";
import EditCardDrop from './HeaderComponent/EditCardDrop'

const getEffectOrReducerByName = name => `workbench/${name}`

const Workbench = (props) => {
  // console.log(props)
  const { dispatch, model, modal } = props
  const { datas: {boxList = []}} = model
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
    updateDatas(payload) {
      dispatch({
        type: getEffectOrReducerByName('updateDatas') ,
        payload:payload
      })
    },
    completeTask(data) {
      dispatch({
        type: getEffectOrReducerByName('completeTask'),
        payload: data
      })
    },
    getBoxList(data) {
      dispatch({
        type: getEffectOrReducerByName('getBoxList'),
        payload: data
      })
    },
    getItemBoxFilter(data) {
      dispatch({
        type: getEffectOrReducerByName('getItemBoxFilter'),
        payload: data
      })
    },
    getMeetingList(data) {
      dispatch({
        type: getEffectOrReducerByName('getMeetingList'),
        payload: data
      })
    },
    getSchedulingList(data) {
      dispatch({
        type: getEffectOrReducerByName('getSchedulingList'),
        payload: data
      })
    },
    getJourneyList(data) {
      dispatch({
        type: getEffectOrReducerByName('getJourneyList'),
        payload: data
      })
    },
    getTodoList(data) {
      dispatch({
        type: getEffectOrReducerByName('getTodoList'),
        payload: data
      })
    },

    getResponsibleTaskList(data) {
      dispatch({
        type: getEffectOrReducerByName('getResponsibleTaskList'),
        payload: data
      })
    },
    getUploadedFileList(data) {
      dispatch({
        type: getEffectOrReducerByName('getUploadedFileList'),
        payload: data
      })
    },
    getBackLogProcessList(data) {
      dispatch({
        type: getEffectOrReducerByName('getBackLogProcessList'),
        payload: data
      })
    },
    getJoinedProcessList(data) {
      dispatch({
        type: getEffectOrReducerByName('getJoinedProcessList'),
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
    },
    filePreview(data) {
      dispatch({
        type: getEffectOrReducerByName('filePreview'),
        payload: data
      })
    },
    fileDownload(data) {
      dispatch({
        type: getEffectOrReducerByName('fileDownload'),
        payload: data
      })
    },
    addBox(data) {
      dispatch({
        type: getEffectOrReducerByName('addBox'),
        payload: data
      })
    },
    deleteBox(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteBox'),
        payload: data
      })
    },
    updateBox(data) {
      dispatch({
        type: getEffectOrReducerByName('updateBox'),
        payload: data
      })
    }
  }
  return(
    <div>
      <Header {...cardContentListProps} />
      {/*<EditCardDrop {...cardContentListProps}/>*/}
      <div className={indexStyles.workbenchOut}>
        <div className={indexStyles.cardItem}>
          <div  className={indexStyles.cardItem_left}>
            {boxList.slice(0,Math.ceil(boxList.length / 2)).map((value, key) => {
              const { code, name, id } = value
              let container = ''
              if('EXCELLENT_CASE' === code || 'POLICIES_REGULATIONS' === code) { //优秀案例或晓策志
                container = (
                  <CardContentArticle
                                    {...this.props}
                                     title={name} {...cardContentListProps}
                                      updateDatas={updateDatas} CardContentType={code}
                                      boxId={id}
                                    itemValue={value}
                                      appType={'EXCELLENT_CASE'===code?WE_APP_TYPE_KNOW_CITY : WE_APP_TYPE_KNOW_POLICY}/>
                )
              }else{
                container = (
                  <CardContent  {...this.props} title={name} itemValue={value} itemKey={key} {...cardContentListProps} boxId={id}  updateDatas={updateDatas} CardContentType={code}  />
                )
              }
              return <div key={id}>{container}</div>
            })}
          </div>
          <div  className={indexStyles.cardItem_right}>
            {boxList.slice(Math.ceil(boxList.length / 2)).map((value, key) => {
              const { code, name, id } = value
              let container = ''
              if('EXCELLENT_CASE' === code || 'POLICIES_REGULATIONS' === code) { //优秀案例或晓策志
                container = (
                  <CardContentArticle
                                    {...this.props}
                                     title={name} {...cardContentListProps}
                                      updateDatas={updateDatas}
                                      CardContentType={code}
                                      boxId={id}
                                    itemValue={value}
                                      appType={'EXCELLENT_CASE'===code?WE_APP_TYPE_KNOW_CITY : WE_APP_TYPE_KNOW_POLICY}/>
                )
              }else{
                container = (
                  <CardContent  {...this.props} title={name} itemValue={value} itemKey={key} {...cardContentListProps} boxId={id}  updateDatas={updateDatas} CardContentType={code}  />
                )
              }
              return <div key={id}>{container}</div>
            })}
          </div>
          {/*<CardContent title={'项目统计'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'projectCount'}/>*/}
          {/*<CardContent title={'会议安排'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'meeting'}/>*/}
          {/*<CardContent title={'我负责的任务'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'task'}/>*/}
          {/*<CardContent title={'审核进程'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'waitingDoFlows'}/>*/}
          {/*<CardContent title={'我的文档'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'file'}/>*/}
          {/*<CardContentArticle title={'优秀案例'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'case'} appType={WE_APP_TYPE_KNOW_CITY} />*/}
          {/*<CardContent title={'隐翼地图'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'yymap'}/>*/}
          {/*<CardContentArticle title={'政策法规'} {...cardContentListProps} updateDatas={updateDatas} CardContentType={'policy'} appType={WE_APP_TYPE_KNOW_POLICY}/>*/}
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
