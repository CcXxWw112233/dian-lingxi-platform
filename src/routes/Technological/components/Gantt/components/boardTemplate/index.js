import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { date_area_height } from '../../constants'
import { Dropdown, Menu, message, Tree, Icon, Spin } from 'antd'
import { connect, } from 'dva';
import { getBoardTemplateList, getBoardTemplateInfo, createCardByTemplate } from '../../../../../../services/technological/gantt'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { createMilestone } from '../../../../../../services/technological/prjectDetail'

const MenuItem = Menu.Item
const TreeNode = Tree.TreeNode;

@connect(mapStateToProps)
export default class BoardTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected_plane_keys: '', //已选择的项目模板
            show_type: '1', // 0 1 2 //默认关闭 / 出现动画 / 隐藏动画
            drag_node_data: {
                data_id: '',
                data_type: '',
                data_name: ''
            },
            selected_template_id: '',
            selected_template_name: '请选择模板',
            template_list: [],
            template_data: [], //模板数据
        }
    }
    getHeight = () => {
        const target = document.getElementById('gantt_card_out_middle')
        if (target) {
            return target.clientHeight - date_area_height
        }
        return '100%'
    }
    componentDidMount() {
        this.listenDrag()
        this.getBoardTemplateList()
    }
    // 获取模板列表
    getBoardTemplateList = async () => {
        const res = await getBoardTemplateList({ _organization_id: localStorage.getItem('OrganizationId') })
        if (isApiResponseOk(res)) {
            const { data } = res
            this.setState({
                template_list: data
            })
            if (data && data.length) {
                this.setState({
                    selected_template_name: data[0].name,
                    selected_template_id: data[0].id
                })
                this.getTemplateInfo(data[0].id)
            }
        } else {
            message.error(res.message)
        }
    }
    // 获取特定模板内容
    getTemplateInfo = async (template_id) => {
        this.setState({
            spinning: true
        })
        const res = await getBoardTemplateInfo({ template_id })
        this.setState({
            spinning: false
        })
        if (isApiResponseOk(res)) {
            this.setState({
                template_data: res.data
            })
        } else {
            message.error(res.message)
        }
    }
    selectTemplate = (e) => {
        const { key } = e
        const { template_list = [] } = this.state
        if ('0_0' == key) {

        } else {
            this.setState({
                selected_template_id: key,
                selected_template_name: template_list.find(item => item.id == key).name || '请选择模板'
            })
            this.getTemplateInfo(key)
        }
    }

    renderTemplateList = () => {
        const { template_list = [] } = this.state
        return (
            <Menu onClick={this.selectTemplate}>
                <MenuItem key={`0_0`} style={{ color: '#1890FF' }}>
                    <i className={globalStyles.authTheme}>&#xe8fe;</i>
                    &nbsp;
                     新建方案
                </MenuItem>
                {
                    template_list.map(item => {
                        const { id, name } = item
                        return (
                            <MenuItem
                                key={`${id}`}
                                className={globalStyles.global_ellipsis}
                                style={{ width: 216 }}>
                                {name}
                            </MenuItem>
                        )
                    })
                }
            </Menu>
        )
    }
    renderTreeItemName = ({ template_data_type, name }) => {
        let icon = ''
        if (template_data_type == '1') {
            icon = <div className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: 18, marginRight: 6 }}>&#xe6ef;</div>
        } else {
            icon = <div className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: 18, marginRight: 6 }} >&#xe6f0;</div>
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon}
                <div>{name}</div>
            </div>
        )
    }
    renderTemplateTree = (data) => {
        return (
            data.map(item => {
                const { name, template_data_type, child_content, id } = item
                if (child_content) {
                    return (
                        <TreeNode
                            data_type={template_data_type}
                            data_id={id}
                            data_name={name}
                            icon={<i className={globalStyles.authTheme}>&#xe6f0;</i>}
                            key={id}
                            title={this.renderTreeItemName({ template_data_type, name })}
                            selectable={false}>
                            {this.renderTemplateTree(child_content)}
                        </TreeNode>
                    );
                }
                return <TreeNode
                    data_type={template_data_type}
                    data_id={id}
                    data_name={name}
                    key={id}
                    title={this.renderTreeItemName({ template_data_type, name })}
                    selectable={false}
                    icon={<Icon type="caret-down" style={{ fontSize: 20, color: 'rgba(0,0,0,.45)' }} />}
                />;
            })
        )
    }
    setShowType = () => {
        const { show_type } = this.state
        let new_type
        if ('0' == show_type) {
            new_type = '1'
        } else if ('1' == show_type) {
            new_type = '2'
        } else if ('2' == show_type) {
            new_type = '1'
        } else {

        }
        this.setState({
            show_type: new_type
        })
    }
    // 处理document的drag事件
    listenDrag = () => {
        const that = this
        let drag_init_target = '' //用来存储所拖拽的对象
        let drag_init_html = '' //用来存储所拖拽的对象的内容

        document.addEventListener("dragstart", function (event) {
            //dataTransfer.setData()方法设置数据类型和拖动的数据
            // event.dataTransfer.setData("Text", 'demo');
            // 拖动 p 元素时输出一些文本
            // document.getElementById("demo").innerHTML = "开始拖动 p 元素.";
            //修改拖动元素的透明度
            event.target.style.opacity = "0.4";
            drag_init_target = event.target
            drag_init_html = event.target.innerHTML

            const { drag_node_data: { data_name, data_type } } = that.state

        });
        //在拖动p元素的同时,改变输出文本的颜色
        document.addEventListener("drag", function (event) {
            // document.getElementById("demo").style.color = "red";
        });
        // 当拖完p元素输出一些文本元素和重置透明度
        document.addEventListener("dragend", function (event) {
            // document.getElementById("demo").innerHTML = "完成 p 元素的拖动";
            event.target.style.opacity = "1";
        });
        /* 拖动完成后触发 */
        // 当p元素完成拖动进入droptarget,改变div的边框样式
        document.addEventListener("dragenter", function (event) {
            // if (event.target.className == "droptarget") {
            //     event.target.style.border = "3px dotted red";
            // }
        });
        // 默认情况下,数据/元素不能在其他元素中被拖放。对于drop我们必须防止元素的默认处理
        document.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        // 当可拖放的p元素离开droptarget，重置div的边框样式
        document.addEventListener("dragleave", function (event) {
            // if (event.target.className == "droptarget") {
            //     event.target.style.border = "";
            // }
        });
        /*对于drop,防止浏览器的默认处理数据(在drop中链接是默认打开)
        复位输出文本的颜色和DIV的边框颜色
        利用dataTransfer.getData()方法获得拖放数据
        拖拖的数据元素id(“drag1”)
        拖拽元素附加到drop元素*/
        document.addEventListener("drop", function (event) {
            event.preventDefault();
            drag_init_target.innerHTML = drag_init_html
            if (event.target.className.indexOf('ganttDetailItem') != -1) {
                const { list_id, start_time, end_time } = event.target.dataset
                that.handleDragCompleted({ list_id, start_time, end_time })
            }
        });
    }
    onDragStart = ({ node }) => {
        const { data_id, data_type, data_name } = node.props
        this.setState({
            drag_node_data: {
                data_id,
                data_type,
                data_name
            }
        })
    }
    handleDragCompleted = ({ list_id, start_time, end_time }) => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                current_list_group_id: list_id
            }
        })
        const { drag_node_data: { data_type }, drag_node_data } = this.state
        // console.log('sssss_目标位置', { list_id, start_time, end_time })
        // console.log('sssss_拖动对象', drag_node_data)
        if (data_type == '1') {
            this.createMilestone({ end_time })
        } else if (data_type == '2') {
            this.createCard({ list_id, start_time, end_time })
        } else {

        }
    }
    // 创建里程碑
    createMilestone = async ({ end_time }) => {
        const { drag_node_data: { data_name } } = this.state
        const { dispatch, gantt_board_id } = this.props
        const params = {
            board_id: gantt_board_id,
            deadline: end_time,
            name: data_name
        }
        if (!end_time) {
            return
        }
        const res = await createMilestone(params)
        if (isApiResponseOk(res)) {
            dispatch({
                type: 'gantt/getGttMilestoneList',
                payload: {

                }
            })
        } else {
            message.error(res.message)
        }
    }
    // 创建任务
    createCard = async ({ list_id, start_time, end_time }) => {
        const { dispatch, gantt_board_id } = this.props
        const { drag_node_data: { data_name, data_id } } = this.state

        const params = {
            board_id: gantt_board_id,
            content_id: data_id,
            due_time: end_time,
            start_time,
            list_id: list_id != '0' ? list_id : ''
        }
        console.log('sssssparams', params)
        const res = await createCardByTemplate({ ...params })
        if (isApiResponseOk(res)) {
            this.props.insertTaskToListGroup && this.props.insertTaskToListGroup(res.data) //创建任务后，返回的数据手动插入
        } else {
            message.error(res.message)
        }
    }
    render() {
        const { template_data, show_type, selected_template_name, spinning } = this.state
        const { gantt_board_id } = this.props
        return (
            gantt_board_id && gantt_board_id != '0' ?
                (
                    <div
                        className={`${styles.container_init}   ${show_type == '1' && styles.container_show} ${show_type == '2' && styles.container_hide}`}
                        style={{
                            height: this.getHeight(),
                            top: date_area_height
                        }}>
                        <div className={styles.top}>
                            <Dropdown overlay={this.renderTemplateList()}>
                                <div className={styles.top_left}>
                                    <div className={`${globalStyles.global_ellipsis} ${styles.name}`}>{selected_template_name}</div>
                                    <div className={`${globalStyles.authTheme} ${styles.down}`}>&#xe7ee;</div>
                                </div>
                            </Dropdown>
                            <div className={`${globalStyles.authTheme} ${styles.top_right}`}>&#xe781;</div>
                        </div>
                        <Spin spinning={spinning}>
                            <div className={styles.main}>
                                <Tree
                                    draggable
                                    onDragStart={this.onDragStart}
                                    switcherIcon={
                                        <Icon type="caret-down" style={{ fontSize: 20, color: 'rgba(0,0,0,.45)' }} />
                                    }
                                >
                                    {this.renderTemplateTree(template_data)}
                                </Tree>

                            </div>
                        </Spin>
                        <div
                            onClick={this.setShowType}
                            className={`${styles.switchSpin_init} ${show_type == '1' && styles.switchSpinShow} ${show_type == '2' && styles.switchSpinClose}`}
                            style={{
                                top: (this.getHeight() + date_area_height) / 2
                            }} >
                            <div className={`${styles.switchSpin_top}`}></div>
                            <div className={`${styles.switchSpin_bott}`}></div>
                        </div>
                    </div >
                ) : (
                    <></>
                )
        )
    }
}
function mapStateToProps({
    gantt: {
        datas: {
            gantt_board_id
        }
    }
}) {
    return {
        gantt_board_id
    }
}