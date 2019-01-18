import React from 'react';
import {connect} from "dva/index";
import QueueAnim from  'rc-queue-anim'
import indexStyles from './index.less'
import CardContent from './CardContent'
import Header from './Header'
import CardContentArticle from './CardContent/CardContentArticle'
import {WE_APP_TYPE_KNOW_CITY, WE_APP_TYPE_KNOW_POLICY} from "../../../../globalset/js/constant";
import EditCardDrop from './HeaderComponent/EditCardDrop'
import PersonNews from './PersonNews'
import technological from "../../../../models/technological";

const getEffectOrReducerByName = name => `workbench/${name}`
const getEffectOrReducerByName_2 = name => `technological/${name}`
const getEffectOrReducerByName_3 = name => `newsDynamic/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`

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
    getProjectUserList(data) {
      dispatch({
        type: getEffectOrReducerByName('getProjectUserList'),
        payload: data
      })
    },
    getOrgMembers(data) {
      dispatch({
        type: getEffectOrReducerByName('getOrgMembers'),
        payload: data
      })
    },
    getImRelaId(data) {
      dispatch({
        type: getEffectOrReducerByName('getImRelaId'),
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
    getProjectStarList(data) {
      dispatch({
        type: getEffectOrReducerByName('getProjectStarList'),
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
  const PersonNewsProps = {
    model,
    logout() {
      dispatch({
        type: getEffectOrReducerByName_2('logout'),
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName_2('routingJump'),
        payload: {
          route:path,
        },
      })
    },
    updateDatas (payload) {
      dispatch({
        type: getEffectOrReducerByName_2('updateDatas') ,
        payload:payload
      })
    },
    //组织
    getSearchOrganizationList(data) {
      dispatch({
        type: getEffectOrReducerByName_2('getSearchOrganizationList'),
        payload: data
      })
    },
    createOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName_2('createOrganization'),
        payload: data
      })
    },
    updateOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName_2('updateOrganization'),
      })
    },
    applyJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName_2('applyJoinOrganization'),
        payload: data
      })
    },
    inviteJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName_2('inviteJoinOrganization'),
        payload: data
      })
    },
    uploadOrganizationLogo(data) {
      dispatch({
        type: getEffectOrReducerByName_2('uploadOrganizationLogo'),
        payload: data
      })
    },
    changeCurrentOrg(data) {
      dispatch({
        type: getEffectOrReducerByName_2('changeCurrentOrg'),
        payload: data
      })
    }
  }
  const NewsListProps = {
    modal,
    model,
    showModal() {
      dispatch({ type: 'modal/showModal' })
    },
    hideModal() {
      dispatch({ type: 'modal/hideModal' })
    },
    getNewsDynamicList(next_id) {
      dispatch({
        type: getEffectOrReducerByName_3('getNewsDynamicList'),
        payload: {next_id}
      })
    },
    addCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByName_3('addCardNewComment'),
        payload: data
      })
    }
  }
  const CreateTaskProps = {
    modal,
    model,
    getCardDetail(payload){
      dispatch({
        type: getEffectOrReducerByName_4('getCardDetail') ,
        payload:payload
      })
    },
    updateTaskDatas(payload) {
      dispatch({
        type: getEffectOrReducerByName_4('updateDatas') ,
        payload:payload
      })
    },
    deleteTaskFile(data) {
      dispatch({
        type: getEffectOrReducerByName_4('deleteTaskFile'),
        payload: data,
      })
    },
    addTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName_4('addTaskGroup'),
        payload: data,
      })
    },
    deleteTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName_4('deleteTaskGroup'),
        payload: data,
      })
    },
    updateTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName_4('updateTaskGroup'),
        payload: data,
      })
    },
    getTaskGroupList(data){
      dispatch({
        type: getEffectOrReducerByName_4('getTaskGroupList'),
        payload: data
      })
    },
    addTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('addTask'),
        payload: data
      })
    },
    updateTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('updateTask'),
        payload: data
      })
    },
    deleteTask(id){
      dispatch({
        type: getEffectOrReducerByName_4('deleteTask'),
        payload: {
          id
        }
      })
    },
    updateChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('updateChirldTask'),
        payload: data
      })
    },
    deleteChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('deleteChirldTask'),
        payload: data
      })
    },

    archivedTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('archivedTask'),
        payload: data
      })
    },
    changeTaskType(data){
      dispatch({
        type: getEffectOrReducerByName_4('changeTaskType'),
        payload: data
      })
    },
    addChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('addChirldTask'),
        payload: data
      })
    },
    addTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByName_4('addTaskExecutor'),
        payload: data
      })
    },
    removeTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByName_4('removeTaskExecutor'),
        payload: data
      })
    },
    completeTask(data){
      dispatch({
        type: getEffectOrReducerByName_4('completeTask'),
        payload: data
      })
    },
    addTaskTag(data){
      dispatch({
        type: getEffectOrReducerByName_4('addTaskTag'),
        payload: data
      })
    },
    removeTaskTag(data){
      dispatch({
        type: getEffectOrReducerByName_4('removeTaskTag'),
        payload: data
      })
    },
    removeProjectMenbers(data){
      dispatch({
        type: getEffectOrReducerByName_4('removeProjectMenbers'),
        payload: data
      })
    },
    getCardCommentList(id) {
      dispatch({
        type: getEffectOrReducerByName_4('getCardCommentList'),
        payload: {
          id
        }
      })
    },
    addCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByName_4('addCardNewComment'),
        payload: data
      })
    },
    deleteCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByName_4('deleteCardNewComment'),
        payload: data
      })
    },
    getBoardTagList(data) {
      dispatch({
        type: getEffectOrReducerByName_4('getBoardTagList'),
        payload: data
      })
    },
    updateBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName_4('updateBoardTag'),
        payload: data
      })
    },
    toTopBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName_4('toTopBoardTag'),
        payload: data
      })
    },
    deleteBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName_4('deleteBoardTag'),
        payload: data
      })
    }
  }

  return(
    <div>
      <PersonNews {...PersonNewsProps} {...NewsListProps}/>
      <Header {...cardContentListProps} />
      {/*<EditCardDrop {...cardContentListProps}/>*/}
      <div className={indexStyles.workbenchOut}>
        <div className={indexStyles.cardItem}>
          <div  className={indexStyles.cardItem_left} style={{width: boxList.length>1?'50%':'100%'}}>
            {/*boxList.slice(0,Math.ceil(boxList.length / 2))*/}
            {boxList.map((value, key) => {
              const { code, name, id } = value
              let flag = key % 2 == 0

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
                  <CardContent  {...this.props} title={name} itemValue={value} itemKey={key} {...cardContentListProps} {...CreateTaskProps} boxId={id}  updateDatas={updateDatas} CardContentType={code}  />
                )
              }
              return flag && <div key={id}>{container}</div>
            })}
          </div>
          {boxList.length>1?(
            <div  className={indexStyles.cardItem_right}>
              {/*boxList.slice(Math.ceil(boxList.length / 2))*/}
              {boxList.map((value, key) => {
                const { code, name, id } = value
                let flag = key % 2 != 0

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
                    <CardContent  {...this.props} title={name} itemValue={value} itemKey={key} {...cardContentListProps} {...CreateTaskProps} boxId={id}  updateDatas={updateDatas} CardContentType={code}  />
                  )
                }
                return  flag && <div key={id}>{container}</div>
              })}
            </div>
          ):('')}

        </div>

    </div>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, workbench, technological,newsDynamic, workbenchTaskDetail, loading }) {
  const modelObj = {
    datas: {...technological['datas'],...workbench['datas'], ...newsDynamic['datas'], ...workbenchTaskDetail['datas']}
  }
  return { modal, model: modelObj, loading }
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
