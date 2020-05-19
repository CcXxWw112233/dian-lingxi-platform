import React, { Component } from 'react'
import { connect } from 'dva'
import BoardFeaturesItem from './BoardFeaturesItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './featurebox.less'
import TaskDetailModal from '@/components/TaskDetailModal'
import BoardFeaturesProcessItem from './BoardFeaturesProcessItem'
import { jsonArrayCompareSort, transformTimestamp } from '../../../../../utils/util'
import { compareOppositeTimer, removeEmptyArrayEle } from '../../../../../components/ProcessDetailModal/components/handleOperateModal'

@connect(mapStateToProps)
export default class BoardFeatures extends Component {

	constructor(props) {
		super(props)
		let new_flow_todo_list = this.updateFlowsOppositeTime(props.board_flow_todo_list)
		this.state = {
			board_todo_list: [].concat(...props.board_card_todo_list, ...new_flow_todo_list)
		}
	}

	componentWillReceiveProps(nextprops) {
		this.reorderBoardToDoList(nextprops)
	}

	// 先修改流程中的时间为相对时间
	updateFlowsOppositeTime = (arr) => {
		let new_arr = [...arr]
		new_arr = new_arr.map(item => {
			if (item.rela_type == '3' && item.deadline_type == '2') {
				let new_item = {...item}
				new_item = {...item, last_complete_time: compareOppositeTimer(item)}
				return new_item
			} else {
				return item
			}
		})
		return new_arr
	}
	// 时间冒泡排序
	timeSort(theTimeArr) {
		let maxLen = theTimeArr.length;
		for (let i = 0; i < maxLen; i++) {
			for (let j = 0; j < maxLen - i - 1; j++) {
				// if (!theTimeArr[j].compare_time)
				if (theTimeArr[j].compare_time > theTimeArr[j + 1].compare_time) { // 如果说前面的时间比后面的大, 那么把大的时间放在后面

					let tmplObj = theTimeArr[j];

					theTimeArr[j] = theTimeArr[j + 1];

					theTimeArr[j + 1] = tmplObj;
				} else { // 如果说前面的时间比后面的小, 保持不变
					let tmplObj = theTimeArr[j];
					theTimeArr[j] = tmplObj;
				}
			}
		}
		return theTimeArr;

	}

	// 对时间数组进行赋值比较
	compareEvaluationTimeArray = (array) => {
		if (!array) return []
		let newArray = JSON.parse(JSON.stringify(array || []))
		newArray = newArray.map(item => {
			if (item.rela_type == '1' || item.rela_type == '2') {
				let new_item = {...item}
				let compare_time = item.due_time ? item.due_time : item.start_time ? item.start_time : ''
				new_item = {...item, compare_time: compare_time}
				return new_item
			} else if (item.rela_type == '3') {
				let new_item = {...item}
				let compare_time = item.last_complete_time
				new_item = {...item, compare_time: compare_time}
				return new_item
			}
			
		})
		return newArray
	}

	// 对没有时间数据进行赋值比较
	compareEvaluationNonTimeArray = (array) => {
		if (!array) return []
		let newArray = JSON.parse(JSON.stringify(array || []))
		newArray = newArray.map(item => {
			if (item.rela_type == '1' || item.rela_type == '2') {
				let new_item = {...item}
				let compare_time = item.create_time
				new_item = {...item, compare_time: compare_time}
				return new_item
			} else if (item.rela_type == '3') {
				let new_item = {...item}
				let compare_time = item.last_complete_time
				new_item = {...item, compare_time: compare_time}
				return new_item
			}
		})
		return newArray
	}

	compareEvaluationOverruleArray = (array) => {
		let newArray = JSON.parse(JSON.stringify(array || []))
		newArray = newArray.map(item => {
			if(item.rela_type == '3') {
				let new_item = {...item}
				let compare_time = item.last_complete_time
				new_item = {...item, compare_time: compare_time}
				return new_item
			}
		})
		return newArray
	}

	// 重新排序
	reorderBoardToDoList = (props) => {
		const { board_card_todo_list = [], board_flow_todo_list = [] } = props 
		let new_flow_todo_list = this.updateFlowsOppositeTime(board_flow_todo_list)
		let new_board_todo_list = [].concat(...board_card_todo_list, ...new_flow_todo_list)
		// 1. 被驳回列表 并且按照时间排序
		let temp_overrule_arr = new_board_todo_list.filter(item => item.runtime_type == '1') // 将被驳回列表取出，并进行排序排序
		let overrule_arr = this.timeSort(this.compareEvaluationOverruleArray(temp_overrule_arr))
		// 2. 不是驳回列表并且存在时间的 不是创建时间
		let temp_overrule_time_arr = new_board_todo_list.filter(item => item.runtime_type != '1' && (((item.rela_type == '1' || item.rela_type == '2') && item.start_time || item.due_time) || (item.rela_type == '3' && item.deadline_type == '2')))
		let non_overrule_time_arr = this.timeSort(this.compareEvaluationTimeArray(temp_overrule_time_arr))
		// 3.不是驳回列表并且不存在时间的 采用创建时间
		let temp_overrule_non_time_arr = new_board_todo_list.filter(item => item.runtime_type != '1' && (((item.rela_type == '1' || item.rela_type == '2') && (!item.start_time && !item.due_time)) || (item.rela_type == '3' && item.deadline_type == '1')))
		let non_overrule_non_time_arr = this.timeSort(this.compareEvaluationNonTimeArray(temp_overrule_non_time_arr))
		// 想将时间都用一个值来进行比较 比如 任务 可能是 due_time 可能是 start_time, 不知道是否需要create_time, 而流程是 last_complete_time
		this.setState({
			board_todo_list: removeEmptyArrayEle([].concat(...overrule_arr,...non_overrule_time_arr, ...non_overrule_non_time_arr))
		})
	}

	// 修改任务
	handleCard = ({ card_id, drawContent = {}, operate_properties_code }) => {
		const { is_realize } = drawContent
		// 设置完成或
		if (is_realize == '1') {
			this.handleDeleteCard({ card_id })
			return
		}
		// 移除自己
		if ('EXECUTOR' == operate_properties_code) {
			const { properties } = drawContent
			const user_id = (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}).id
			const excutors = properties.find(item => item.code == 'EXECUTOR').data || []
			if (excutors.findIndex(item => item.user_id == user_id) == -1) {
				this.handleDeleteCard({ card_id })
				return
			}
		}
		const { dispatch, board_card_todo_list = [] } = this.props
		const new_board_card_todo_list = [...board_card_todo_list]
		const index = new_board_card_todo_list.findIndex(item => item.id == card_id)
		if (index == -1) {
			return
		}
		new_board_card_todo_list[index] = { ...new_board_card_todo_list[index], ...drawContent, name: drawContent.card_name }
		dispatch({
			type: 'simplemode/updateDatas',
			payload: {
				board_card_todo_list: new_board_card_todo_list
			}
		})
	}
	handleDeleteCard = ({ card_id }) => {
		const { board_card_todo_list = [], dispatch } = this.props
		const new_board_card_todo_list = [...board_card_todo_list]
		const index = new_board_card_todo_list.findIndex(item => item.id == card_id)

		new_board_card_todo_list.splice(index, 1)
		dispatch({
			type: 'simplemode/updateDatas',
			payload: {
				board_card_todo_list: new_board_card_todo_list
			}
		})
	}
	// 渲染不同类型的代办列表
	renderDiffRelaTypeFeaturesItem = (value) => {
		const { id, rela_type } = value
		switch (rela_type) {
			case '1': // 表示任务
				return <BoardFeaturesItem key={id} itemValue={value} />
			case '2': // 表示日程
				return <BoardFeaturesItem key={id} itemValue={value} />
			case '3': // 表示流程
				return <BoardFeaturesProcessItem key={id} itemValue={value} />
			default:
				break;
		}
	}
	renderTodoList = () => {
		const { board_card_todo_list = [] } = this.props
		const { board_todo_list = [] } = this.state
		return (
			board_todo_list.length ? (
				board_todo_list.map(value => {
					const { id } = value
					// return <BoardFeaturesProcessItem key={id} itemValue={value} />
					return <>{this.renderDiffRelaTypeFeaturesItem(value)}</>
				})
			) : (
					<div className={`${globalStyles.authTheme} ${styles.nodataArea}`}>
						<div className={`${globalStyles.authTheme} ${styles.alarm}`}>&#xe6fb;</div>
						<div className={`${styles.title}`}>暂无待办事项</div>
					</div>
				)
		)
	}

	// 业务逻辑太复杂时间太紧张，关闭弹窗后再直接拉取接口查询待办事项
	setTaskDetailModalVisible = () => {
		const { dispatch, simplemodeCurrentProject = {} } = this.props
		const { board_id } = simplemodeCurrentProject
		let params = {
			_organization_id: localStorage.getItem('OrganizationId'),
		}
		if (board_id && board_id != '0') {
			params.board_ids = board_id
		}
		dispatch({
			type: 'simplemode/getBoardsTaskTodoList',
			payload: params
		})
	}

	renderWelcome = () => {
		return (
			<div className={`${globalStyles.authTheme} ${styles.nodataArea2}`}>
				<div className={`${globalStyles.authTheme} ${styles.alarm}`}>&#xe704;</div>
				<div className={`${styles.title}`}>欢迎来到聆悉，我们有以上项目功能，赶快新建一个项目体验吧～</div>
			</div>
		)
	}

	render() {
		const { drawerVisible, projectList = [], projectInitLoaded, board_card_todo_list = [] } = this.props
		return (
			<div>
				{
					projectInitLoaded ? (
						projectList.length ? (
							this.renderTodoList()
						) : (
								this.renderWelcome()
							)
					) : ('')
				}
				<div className={styles.feature_item} style={{ display: board_card_todo_list.length ? 'block' : 'none' }}></div>
				<TaskDetailModal
					task_detail_modal_visible={drawerVisible}
					setTaskDetailModalVisible={this.setTaskDetailModalVisible} //关闭任务弹窗回调
					handleTaskDetailChange={this.handleCard}
					handleDeleteCard={this.handleDeleteCard}
				/>
			</div>
		)
	}
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
	{
		simplemode: {
			simplemodeCurrentProject,
			board_card_todo_list = [],
			board_flow_todo_list = [],
		},
		workbench: {
			datas: { projectList, projectInitLoaded }
		},
		technological: {
			datas: { currentUserOrganizes, currentSelectOrganize = {} }
		},
		publicTaskDetailModal: { drawerVisible }
	}) {
	return {
		simplemodeCurrentProject,
		currentUserOrganizes,
		currentSelectOrganize,
		board_card_todo_list,
		board_flow_todo_list,
		drawerVisible,
		projectList,
		projectInitLoaded
	}
}