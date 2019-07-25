// 指引界面
import React, { Component } from 'react'
import { Button } from 'antd'
import logo from '@/assets/library/lingxi_logo.png'
import styles from './index.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import manager from '@/assets/noviceGuide/undraw_file_manager.png'
import organizer from '@/assets/noviceGuide/undraw_online_organizer.png'
import InputExport from './component/InputExport';


export default class Boundary extends Component {

	state = {
		is_show_cooperate_with: false, // 是否显示开始协作组件
		initInputList: [
			{ value: '' },
			{ value: '' },
			{ value: '' },
		], // 初始化的input框
		inputList: [
			{ value: '' },
			{ value: '' },
			{ value: '' },
		], // input框的
		is_add_more: false, // 是否点击添加更多的操作 默认为false 没有点击
	}

	// 点击ok
	handleNext = () => {
		this.setState({
			is_show_cooperate_with: true
		})
	}

	// 点击添加更多
	handleAddMore = () => {
		console.log(1111, 'sss')
		this.setState({
			is_add_more: true,
		}, () => {
			const { inputList, is_add_more, initInputList } = this.state
			let new_input_list = [...inputList]
			// 每次拼接都连接三个初始的
			new_input_list = new_input_list.concat([], ...initInputList)
			this.setState({
				inputList: new_input_list
			})
		})
		

	}

	// 显示初始指引页面
	renderInit() {
		return (
				<div className={styles.introduce}>
					<h1>欢迎使用灵犀，我们准备了以下功能以便你能更好地管理项目</h1>
					<div className={styles.middle}>
						<div className={styles.left}>
							<h3>项目功能</h3>
							<div className={`${styles.list}`}>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.calendar}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe671;</i>
									</span>
									<span>行程安排</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.check}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe674;</i>
									</span>
									<span>代办事项</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.folder}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe673;</i>
									</span>
									<span>文件托管</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.chat}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe683;</i>
									</span>
									<span>项目交流</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.process}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe682;</i>
									</span>
									<span>工作流程</span>
								</div>
							</div>
							<div className={`${styles.organizer} ${styles.border}`}>
								<img src={organizer} />
								<p>项目进度、任务、文件实时协作</p>
							</div>
						</div>
						<div className={styles.right}>
							<h3>辅助功能</h3>
							<div className={`${styles.list}`}>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.case}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe65a;</i>
									</span>
									<span>行程安排</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.policy}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe6c9;</i>
									</span>
									<span>代办事项</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.maps}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe677;</i>
									</span>
									<span>文件托管</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.read}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe670;</i>
									</span>
									<span>项目交流</span>
								</div>
								<div className={`${styles.cloumn}`}>
									<span className={`${styles.circle} ${styles.meeting}`}>
										<i className={`${glabalStyles.authTheme}`}>&#xe675;</i>
									</span>
									<span>工作流程</span>
								</div>
							</div>
							<div className={`${styles.manager} ${styles.border}`}>
								<img src={manager} />
								<p>项目进度、任务、文件实时协作</p>
							</div>
						</div>
					</div>
					<div className={styles.button}>
						<Button onClick={this.handleNext} type="primary">好的,我知道了</Button>
					</div>
				</div>
		)
	}

	// 显示开始协作
	renderCooperateWith() {
		const { inputList } = this.state
		let new_input_list = [...inputList]
		return (
			<div className={styles.introduce}>
        <h1 style={{textAlign: 'center', marginBottom: 88}}>是否现在就邀请其他人共同使用灵犀</h1>
        <div className={styles.form}>
          <h3 style={{marginBottom: 12}}>输入被邀请人手机号/邮箱</h3>
					{
						new_input_list.map((item, index) => {
							return <InputExport key={index} inputList={inputList} itemVal={item} index={index} />
						})
					}
					<span onClick={ this.handleAddMore } className={styles.add_more}>+  添加更多...</span>
					<div className={styles.code_wechat}>
						<span></span>
						<p>
							<b className={styles.line}></b>
							<i className={`${glabalStyles.authTheme} ${styles.wechat}`}>&#xe634;</i> 微信扫一扫直接邀请参与人
							<b className={styles.line}></b>
						</p>
					</div>
					<div className={styles.btn}><Button type="primary">开始协作</Button></div>
				</div>
			</div>
		)
	}

	renderContent() {
		const { is_show_cooperate_with } = this.state
		if (is_show_cooperate_with) {
			return this.renderCooperateWith()
		} else {
			return this.renderInit()
		}

	}

	render() {
		return (
			<div className={styles.wrapper}>
				<div className={styles.container}>
					<div className={styles.logo}>
						<img src={logo} />
					</div>
					{ this.renderContent() }
				</div>
			</div>
		)
	}
}
