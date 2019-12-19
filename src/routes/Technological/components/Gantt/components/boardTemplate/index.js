import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { date_area_height } from '../../constants'
import { Dropdown, Menu, message, Tree, Icon } from 'antd'

const MenuItem = Menu.Item
const TreeNode = Tree.TreeNode;

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
            template_data: [
                {
                    name: '啊收到了',
                    id: '1',
                    type: '1',
                    child_data: [
                        {
                            name: '1-1',
                            id: '1-1',
                            type: '2',
                            parent_id: '0',
                            child_data: [
                                {
                                    name: '1-1-1',
                                    id: '1-1-1',
                                    type: '2',
                                    parent_id: '1-1',
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '2',
                    id: '2',
                    type: '1',
                    child_data: [
                        {
                            name: '2-1',
                            id: '2-1',
                            type: '2',
                            parent_id: '0',
                            child_data: [
                                {
                                    name: '2-1-1',
                                    id: '2-1-1',
                                    type: '2',
                                    parent_id: '2-1',
                                }
                            ]
                        }
                    ]
                },

            ], //模板数据
        }
    }
    getHeight = () => {
        const target = document.getElementById('gantt_card_out_middle')
        if (target) {
            return target.clientHeight - date_area_height
        }
        return '100%'
    }
    selectPlane = (e) => {
        const { key } = e

    }
    plansMenu = () => {
        return (
            <Menu onClick={this.selectPlane}>
                <MenuItem key={`0_0`} style={{ color: '#1890FF' }}>
                    <i className={globalStyles.authTheme}>&#xe8fe;</i>
                    &nbsp;
                     新建方案
                </MenuItem>
                <MenuItem
                    className={globalStyles.global_ellipsis}
                    style={{ width: 216 }}>
                    爱丽丝的接口拉萨角度来看爱上了大家拉克丝的
                </MenuItem>
            </Menu>
        )
    }
    renderTreeItemName = ({ type, name }) => {
        let icon = ''
        if (type == '1') {
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
                const { name, type, child_data, id } = item
                if (child_data) {
                    return (
                        <TreeNode
                            data_type={type}
                            data_id={id}
                            data_name={name}
                            icon={<i className={globalStyles.authTheme}>&#xe6f0;</i>}
                            key={id}
                            title={this.renderTreeItemName({ type, name })}
                            selectable={false}>
                            {this.renderTemplateTree(child_data)}
                        </TreeNode>
                    );
                }
                return <TreeNode
                    data_type={type}
                    data_id={id}
                    data_name={name}
                    key={id}
                    title={this.renderTreeItemName({ type, name })}
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
    componentDidMount() {
        this.listenDrag()
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
            console.log('sssss_start', that.state.drag_node_data, that.renderTreeItemName({ name: data_name, type: data_type }).innerHTML)
            drag_init_target = event.target
            drag_init_html = event.target.innerHTML

            const { drag_node_data: { data_name, data_type } } = that.state
            // event.target.innerHTML = that.renderTreeItemName({ name: data_name, type: data_type }).innerHTML

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
        const { drag_node_data } = this.state
        // console.log('sssss_目标位置', { list_id, start_time, end_time })
        // console.log('sssss_拖动对象', drag_node_data)
    }
    render() {
        const { template_data, show_type } = this.state
        return (
            <div className={
                `
                ${styles.container_init}  
                ${show_type == '1' && styles.container_show}
                ${show_type == '2' && styles.container_hide}
                `
            } style={{
                height: this.getHeight(),
                top: date_area_height
            }}>
                <div className={styles.top}>
                    <Dropdown overlay={this.plansMenu()}>
                        <div className={styles.top_left}>
                            <div className={`${globalStyles.global_ellipsis} ${styles.name}`}>城市规划方案城市规划方案</div>
                            <div className={`${globalStyles.authTheme} ${styles.down}`}>&#xe7ee;</div>
                        </div>
                    </Dropdown>
                    <div className={`${globalStyles.authTheme} ${styles.top_right}`}>&#xe781;</div>
                </div>
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
                <div
                    onClick={this.setShowType}
                    className={
                        `
                        ${styles.switchSpin_init}  
                        ${show_type == '1' && styles.switchSpinShow}
                        ${show_type == '2' && styles.switchSpinClose}
                        `
                    }
                    style={{
                        top: (this.getHeight() + date_area_height) / 2
                    }} >
                    <div className={`${styles.switchSpin_top}`}></div>
                    <div className={`${styles.switchSpin_bott}`}></div>
                </div>
            </div >
        )
    }
}
