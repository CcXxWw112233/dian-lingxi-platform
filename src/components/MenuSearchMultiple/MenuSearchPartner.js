import React from 'react'
// import MenuSearchStyles from './MenuSearch.less'
import { Input, Menu, Spin, Icon, message } from 'antd'
import indexStyles from './MenuSearchPartner.less'
import ShowAddMenberModal from '../../routes/Technological/components/Project/ShowAddMenberModal'
import { checkIsHasPermissionInBoard, } from "../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_BOARD_MEMBER } from "@/globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData';
import { organizationInviteWebJoin, commInviteWebJoin, } from '../../services/technological/index'
import { connect } from 'dva';

@connect(({ technological, }) => ({
    technological
}))
export default class MenuSearchPartner extends React.Component {
    state = {
        resultArr: [],
        keyWord: '',
        selectedKeys: []
    }
    componentWillMount() {
        // const { keyWord } = this.state
        // const { listData, searchName, selectedKeys = [] } = this.props
        // this.setState({
        //     resultArr: this.fuzzyQuery(listData, searchName, keyWord),
        //     selectedKeys
        // }, () => {
        //     this.setState({
        //         resultArr: this.fuzzyQuery(listData, searchName, keyWord)
        //     })
        // })
        const { keyWord } = this.state
        let selectedKeys = []
        const { listData = [], searchName, currentSelect = [] } = this.props
        for (let val of currentSelect) {
            selectedKeys.push(val['user_id'])
        }
        this.setState({
            selectedKeys
        }, () => {
            this.setState({
                resultArr: this.fuzzyQuery(listData, searchName, keyWord),
            })
        })
    }
    componentWillReceiveProps(nextProps) {

    }
    //模糊查询
    handleMenuReallySelect = (e) => {
        this.setSelectKey(e)
    }
    handleMenuReallyDeselect(e) {
        this.setSelectKey(e)
    }
    setSelectKey(e) {
        const { key, selectedKeys } = e
        if (!key) {
            return false
        }
        this.setState({
            selectedKeys
        }, () => {
            const { listData = [], searchName } = this.props
            const { keyWord } = this.state
            this.setState({
                resultArr: this.fuzzyQuery(listData, searchName, keyWord),
            })
        })
        this.props.chirldrenTaskChargeChange({ selectedKeys })
    }
    onCheck() {
        if (this.props.onCheck && typeof this.props.onCheck === 'function') {
            this.props.onCheck(this.state.selectedKeys)
        }
    }
    fuzzyQuery = (list, searchName, keyWord) => {
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][searchName].indexOf(keyWord) !== -1) {
                arr.push(list[i]);
            }
        }

        //添加任务执行人后往前插入
        const { selectedKeys } = this.state
        for (let i = 0; i < arr.length; i++) {
            if (selectedKeys.indexOf(arr[i]['user_id']) != -1) {
                if (i > 0 && selectedKeys.indexOf(arr[i - 1]['user_id']) == -1) {
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
    addMenbersInProject = (data) => {
        const { invitationType, invitationId, rela_Condition, dispatch, board_id, } = this.props
        const temp_ids = data.users.split(",")
        const invitation_org = localStorage.getItem('OrganizationId')

        organizationInviteWebJoin({
            _organization_id: invitation_org,
            type: invitationType,
            users: temp_ids
        }).then(res => {
            if (res && res.code === '0') {
                commInviteWebJoin({
                    id: invitationId,
                    role_id: res.data.role_id,
                    type: invitationType,
                    users: res.data.users,
                    rela_condition: rela_Condition,
                }).then(res => {
                    if (isApiResponseOk(res)) {
                        if (invitationType === '4') {
                            dispatch({
                                type: 'projectDetail/projectDetailInfo',
                                payload: {
                                    id: board_id
                                }
                            })
                            // dispatch({
                            //     type: 'projectDetailTask/getCardDetail',
                            //     payload: {
                            //         id: invitationId
                            //     }
                            // })
                            dispatch({
                                type: 'workbenchTaskDetail/projectDetailInfo',
                                payload: {
                                    id: board_id
                                }
                            })
                            // dispatch({
                            //     type: 'workbenchTaskDetail/getCardDetail',
                            //     payload: {
                            //         id: board_id,
                            //         board_id: board_id,
                            //         calback: function (data) {
                            //             dispatch({
                            //                 type: 'workbenchPublicDatas/getRelationsSelectionPre',
                            //                 payload: {
                            //                     _organization_id: invitation_org
                            //                 }
                            //             })
                            //         }
                            //     }
                            // })
                        } else if (invitationType === '7') {
                            dispatch({
                                type: 'projectDetail/projectDetailInfo',
                                payload: {
                                    id: invitationId
                                }
                            })
                        } else if (invitationType === '8') {
                            dispatch({
                                type: 'projectDetail/projectDetailInfo',
                                payload: {
                                    id: board_id
                                }
                            })
                            dispatch({
                                type: 'projectDetailProcess/getProcessInfo',
                                payload: {
                                    id: invitationId
                                }
                            })
                            dispatch({
                                type: 'workbenchDetailProcess/getProcessInfo',
                                payload: {
                                    id: board_id
                                }
                            })
                        }
                    } else {
                        message.warn(res.message, MESSAGE_DURATION_TIME)
                    }
                })
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        })
    }
    setShowAddMenberModalVisibile() {
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return false
        }
        this.setState({
            ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
        })
    }
    render() {
        const { keyWord, resultArr, selectedKeys = [] } = this.state
        const { Inputlaceholder = '搜索', searchName, menuSearchSingleSpinning, keyCode, invitationType, invitationId, rela_Condition, } = this.props

        return (
            <div>
                <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: 200, }}
                    selectedKeys={selectedKeys}
                    onDeselect={this.handleMenuReallyDeselect.bind(this)}
                    onSelect={this.handleMenuReallySelect} multiple >

                    <div style={{ margin: '0 10px 10px 10px' }}>
                        <Input placeholder={Inputlaceholder} value={keyWord} onChange={this.onChange.bind(this)} />
                    </div>
                    <div style={{ padding: 0, margin: 0, height: 32, lineHeight: '32px', cursor: 'pointer' }} onClick={this.setShowAddMenberModalVisibile.bind(this)}>
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                            <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '&#xe70b;', marginRight: 4, color: 'rgb(73, 155, 230)', }}>
                                <Icon type={'plus-circle'} style={{ fontSize: 12, marginLeft: 10, color: 'rgb(73, 155, 230)' }} />
                            </div>
                            <span style={{ color: 'rgb(73, 155, 230)' }}>邀请他人参与</span>
                        </div>
                    </div>
                    {
                        resultArr.map((value, key) => {
                            const { avatar, name, user_name, user_id } = value
                            return (
                                <Menu.Item className={indexStyles.menuItem} style={{ height: 32, lineHeight: '32px', margin: 0, padding: '0 10px', }} key={value[keyCode]} >

                                    <div className={indexStyles.menuItemDiv}>
                                        <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                                            {avatar ? (
                                                <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 4 }} src={avatar} />
                                            ) : (
                                                    <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 4, }}>
                                                        <Icon type={'user'} style={{ fontSize: 12, marginLeft: 10, color: '#8c8c8c' }} />
                                                    </div>
                                                )}
                                            <div style={{ overflow: 'hidden', verticalAlign: ' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90, marginRight: 8 }}>{name || user_name || '佚名'}</div>
                                        </div>
                                        <div style={{ display: selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none' }}>
                                            <Icon type="check" />
                                        </div>
                                    </div>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>

                <ShowAddMenberModal
                    // title={titleText}
                    addMenbersInProject={this.addMenbersInProject}
                    show_wechat_invite={true}
                    {...this.props}
                    invitationType={invitationType}
                    invitationId={invitationId}
                    rela_Condition={rela_Condition}
                    invitationOrg={localStorage.getItem('OrganizationId')}
                    modalVisible={this.state.ShowAddMenberModalVisibile}
                    setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}
                />
            </div>

        )
    }

}

MenuSearchPartner.deafultProps = {

}
