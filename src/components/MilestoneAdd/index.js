import React from 'react'
import { Input, Menu, Spin, Icon, message, Dropdown, Tooltip } from 'antd'
import indexStyles from './index.less'
import { createMilestone, getMilestoneList } from '@/services/technological/prjectDetail'
import { isApiResponseOk } from "@/utils/handleResponseData"
import { compareTwoTimestamp } from '@/utils/util'
import AddLCBModal from '@/routes/Technological/components/Gantt/components/AddLCBModal'

import { connect } from 'dva';
import globalStyles from '@/globalset/css/globalClassName.less'
/**加入里程碑组件 */
@connect(({ }) => ({

}))
export default class MilestoneAdd extends React.Component {
    state = {
        milestoneAddVisible: false,
        visible: false,
        resultArr: [],
        keyWord: '',
        milestoneList: [],
        add_lcb_modal_visible: false
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, dataInfo } = nextProps;
        const { dataInfo: oldDataInfo = {} } = this.props;
        if (dataInfo.board_id && dataInfo.board_id != oldDataInfo.board_id) {
            this.getMilestone(dataInfo.board_id)
        }
    }

    //获取项目里程碑列表
    getMilestone = (id, callBackObject, milestoneId) => {
        getMilestoneList({ id }).then((res) => {
            console.log("res", res);
            if (isApiResponseOk(res)) {
                this.setState({
                    milestoneList: res.data
                }, () => {
                    callBackObject && callBackObject.callBackFun(res.data, callBackObject.param);
                });

            } else {
                message.error(res.message)
            }
        })
    }
    //模糊查询


    handleMenuClick = (e) => {
        const { selectedValue } = this.props;
        const { key } = e;
        if (selectedValue) {
            if (selectedValue == key) {
                this.setSelectKey(e, 'remove')
            } else {
                this.setSelectKey(e, 'update')
            }

        } else {
            this.setSelectKey(e, 'add')
        }
    }

    setSelectKey(e, type) {
        let { key, item = {} } = e;
        if (!key) {
            return false
        }
        // this.setState({
        //     selectedValue
        // }, () => {
        //     const { listData = [], searchName } = this.props
        //     const { keyWord } = this.state
        //     this.setState({
        //         resultArr: this.fuzzyQuery(listData, searchName, keyWord),
        //     })
        // })
        //console.log(item);
        const { props } = item;
        const { info } = props;

        this.props.onChangeMilestone && this.props.onChangeMilestone({ key, type, info })
    }

    fuzzyQuery = (list, searchName, keyWord) => {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][searchName].indexOf(keyWord) !== -1) {
                arr.push(list[i]);
            }
        }

        //添加里程碑后往后放
        const { milestoneList } = this.state
        for (let i = 0; i < arr.length; i++) {
            if (milestoneList.indexOf(arr[i]['id']) != -1) {
                if (i > 0 && milestoneList.indexOf(arr[i - 1]['id']) == -1) {
                    const deItem = arr.splice(i, 1)
                    arr.unshift(...deItem)
                }
            }
        }
        return arr;
    }

    onChange = (e) => {
        const { listData = [], searchName } = this.props
        const keyWord = e.target.value
        const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
        this.setState({
            keyWord,
            resultArr
        })
    }

    setMilestoneAddVisible = (visible) => {
        this.setState({
            milestoneAddVisible: visible
        });
    }

    setAddLCBModalVisibile = (visible) => {
        this.setState({
            add_lcb_modal_visible: visible
        });
    }

    // 创建里程碑
    submitCreatMilestone = (data) => {
        const { dispatch } = this.props
        const { users, currentSelectedProject, due_time, add_name } = data
        const params = {
            board_id: currentSelectedProject,
            deadline: due_time,
            name: add_name,
            users
        }
        createMilestone(params).then((res) => {
            if (isApiResponseOk(res)) {
                this.getMilestone(params.board_id, { callBackFun: this.getMilestoneListCallbackFun, param: res.data });
                message.success("新建里程碑成功")
            } else {
                message.error(res.message)
            }
        });
    }

    getMilestoneListCallbackFun = (milestoneList, param) => {
        const { selectedValue } = this.props;
        const key = param;
        let actionType = '';
        if (selectedValue) {
            if (selectedValue == key) {
                actionType = 'remove';
            } else {
                actionType = 'update';
            }
        } else {
            actionType = 'add';
        }

        const info = milestoneList.filter((item) => item.id == key)[0];
        this.props.onChangeMilestone && this.props.onChangeMilestone({ key, type: actionType, info })
    }

    render() {
        const { milestoneList, add_lcb_modal_visible = false } = this.state
        const { visible, children, selectedValue, dataInfo = {} } = this.props
        console.log(dataInfo);
        return (
            <div>

                <Dropdown
                    overlay={
                        <div>
                            <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: 200, }}
                                selectedKeys={[selectedValue]}
                                onClick={this.handleMenuClick}
                                multiple={false}
                                visible={true} >

                                {/* <div style={{ margin: '0 10px 10px 10px' }}>
                                    <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
                                </div> */}
                                <Menu className={globalStyles.global_vertical_scrollbar} style={{ maxHeight: '248px', overflowY: 'auto' }}>
                                    <div style={{ padding: 0, margin: 0, height: 32, lineHeight: '32px', cursor: 'pointer' }} onClick={() => this.setAddLCBModalVisibile(true)}>
                                        <div style={{ display: 'flex', alignItems: 'center' }} >
                                            <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                                                <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                                            </div>
                                            <span style={{ color: 'rgb(73, 155, 230)' }}>新建里程碑</span>
                                        </div>
                                    </div>
                                    {
                                        milestoneList.map((value, key) => {
                                            const { id, name, deadline } = value
                                            return (
                                                <Menu.Item className={!compareTwoTimestamp(deadline, dataInfo.due_time) ? `${indexStyles.menuItem} ${indexStyles.disabled} ` : `${indexStyles.menuItem}`}
                                                    style={{ height: '40px', lineHeight: '40px', margin: 0, padding: '0 12px' }}
                                                    key={id} info={value}
                                                    disabled={!compareTwoTimestamp(deadline, dataInfo.due_time)}>

                                                    <div className={indexStyles.menuItemDiv}>
                                                        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} key={id}>
                                                            <div style={{ overflow: 'hidden', verticalAlign: ' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90, marginRight: 8 }}>{name}</div>
                                                        </div>

                                                        <div style={{ display: selectedValue == id ? 'block' : 'none' }}>
                                                            <Icon type="check" />
                                                        </div>
                                                        {!compareTwoTimestamp(deadline, dataInfo.due_time) && (
<Tooltip title="当前任务的截止时间无法超出里程碑截止时间">
                                                                <div className={indexStyles.menuItemTip}><Icon type="question-circle" /></div>
                                                            </Tooltip>
)}

                                                    </div>
                                                </Menu.Item>
                                            )
                                        })
                                    }
                                </Menu>
                            </Menu>
                        </div>
                    }
                >
                    <div >
                        {children}
                    </div>
                </Dropdown>

                <AddLCBModal
                    current_selected_board={{ ...dataInfo, users: dataInfo.data }}
                    board_id={dataInfo.board_id}
                    add_lcb_modal_visible={add_lcb_modal_visible}
                    setAddLCBModalVisibile={this.setAddLCBModalVisibile}
                    submitCreatMilestone={this.submitCreatMilestone}
                    zIndex={1007}
                />
            </div>

        )
    }

}

MilestoneAdd.deafultProps = {

}
