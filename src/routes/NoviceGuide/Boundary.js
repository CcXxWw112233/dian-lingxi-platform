// 指引界面
import React, { Component } from 'react'
import { Button } from 'antd'
import logo from '@/assets/library/lingxi_logo.png'
import styles from './index.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import manager from '@/assets/noviceGuide/undraw_file_manager.png'
import organizer from '@/assets/noviceGuide/undraw_online_organizer.png'

export default class Boundary extends Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<div className={styles.container}>
					<div className={styles.logo}>
						<img src={logo} />
					</div>
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
							<Button type="primary">好的,我知道了</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
