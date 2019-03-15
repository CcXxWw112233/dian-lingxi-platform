import React, { Component } from "react";
import { Button, Select, Spin, message, Tooltip } from "antd";
import styles from "./index.less";
import { connect } from "dva";
import { debounce } from "./../../../../utils/util";
import { associateUser } from "./../../../../services/technological/workbench";
import defaultUserAvatar from "./../../../../assets/invite/user_default_avatar@2x.png";
import { getPinyin } from "./../../../../utils/pinyin";

const Option = Select.Option;

@connect(({ technological, organizationMember }) => ({
  currentOrg: technological.datas.currentSelectOrganize,
  currentOrgAllMembersList: technological.datas.currentOrgAllMembersList,
  projectList: technological.datas.currentOrgProjectList,
  groupList:
    organizationMember.datas && organizationMember.datas.groupList
      ? organizationMember.datas.groupList
      : []
}))
class InviteOthers extends Component {
  constructor(props) {
    super(props);
    const { currentOrgAllMembersList } = props;
    this.fetchUsers = debounce(this.fetchUsers, 300);
    this.state = {
      inputValue: [],
      inputRet: [],
      fetching: false,
      selectedMember: [], //已经选择的成员或平台外人员
      membersListToSelect: Array.isArray(currentOrgAllMembersList)
        ? currentOrgAllMembersList
        : [], //人员选择列表
      isSyncWithOrg: false, //如果同步了组织,则不能不同和选择其他人。
      currentSyncSetsMemberList: {}, //原生的已经被同步的集合的所有成员，此处不能保存成数组，更不能过滤重复的人员，因为如果取消同步的时候，会移除已同步的集合的交集处的人员，引发意外的bug      isInSelectedList: false,
      currentMemberListSet: "org", //当前显示的集合 org || group-id || project-id
      isInSelectedList: false, //是否仅显示列表的
      step: "home" //当前的步进 home || group-list || group-id || project-list ||project-id
    };
  }
  handleSearchUser = user => {
    this.setState(
      {
        inputValue: [],
        inputRet: [],
        fetching: false
      },
      () => {
        this.fetchUsers(user);
      }
    );
  };
  genSplitSymbol = () => "$%$";
  genUserValueStr = (icon, name, user, isFromPlatForm) => {
    return `${icon}${this.genSplitSymbol()}${name}${this.genSplitSymbol()}${user}${this.genSplitSymbol()}${isFromPlatForm}`;
  };
  genUserToDefinedMember = user => {
    if (!user || !user.id) return;
    const { avatar = "default", full_name = "default", mobile, email } = user;
    const mobileOrEmail = mobile ? mobile : email;
    return this.parseUserValueStr(
      this.genUserValueStr(avatar, full_name, mobileOrEmail, true)
    );
  };
  parseUserValueStr = userValueStr => {
    if (!userValueStr) return;
    const [icon, name, user, isFromPlatForm] = userValueStr.split(
      this.genSplitSymbol()
    );
    return {
      type: isFromPlatForm === "true" ? "platform" : "other",
      icon,
      name,
      user
    };
  };
  fetchUsers = user => {
    if (!user) return;
    this.setState(
      {
        inputRet: [],
        fetching: true
      },
      () => {
        //发起请求
        associateUser(user)
          .then(res => {
            if (res.code && res.code === "0") {
              //如果查到了用户
              if (res.data && res.data.id) {
                const { avatar_icon, nickname } = res.data;
                const value = this.genUserValueStr(
                  avatar_icon,
                  nickname,
                  user,
                  true
                );
                this.setState({
                  inputRet: [
                    { value, avatar: avatar_icon, user, name: nickname }
                  ],
                  fetching: false
                });
              } else {
                const value = this.genUserValueStr(
                  "default",
                  "default",
                  user,
                  false
                );
                this.setState({
                  inputRet: [{ value, avatar: "default", user, name: null }],
                  fetching: false
                });
              }
            } else {
              message.error("获取联想用户失败");
            }
          })
          .catch(err => {
            message.error("获取联想用户失败");
          });
      }
    );
  };
  isMemberInSyncSetsMemberList = selectedUser => {
    const { currentSyncSetsMemberList } = this.state;
    function flattenDeep(arr1) {
      return arr1.reduce(
        (acc, val) =>
          Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
        []
      );
    }
    const flatMemberListFromCurrentSyncSets = flattenDeep(
      Object.values(currentSyncSetsMemberList)
    );
    return flatMemberListFromCurrentSyncSets.find(
      item =>
        item.mobile === selectedUser.user || item.email === selectedUser.user
    );
  };
  handleInputSelected = value => {
    const { selectedMember } = this.state;
    const selectedUser = this.parseUserValueStr(value.key);
    const isHasSameMemberInSelectedMember = () =>
      selectedMember.find(item => item.user === selectedUser.user);
    const isInSyncSet = this.isMemberInSyncSetsMemberList(selectedUser);
    if (isInSyncSet) {
      message.error("当前人员已经存在于要同步的集合中了");
    }
    if (isHasSameMemberInSelectedMember() || isInSyncSet) return;
    this.setState({
      selectedMember: [...selectedMember, selectedUser],
      inputValue: [],
      inputRet: [],
      fetching: false
    });
  };
  handleInputDeselected = value => {
    const selectedUser = this.parseUserValueStr(value.key);
    const { selectedMember } = this.state;
    this.setState({
      selectedMember: selectedMember.filter(
        item => item.user !== selectedUser.user
      )
    });
  };
  handleInputChange = value => {
    //这个函数根本就不会执行？？？
    this.setState({
      inputValue: value,
      inputRet: [],
      fetching: false
    });
  };
  genOptionLabel = item => {
    const { avatar, user, name } = item;
    //默认
    if (avatar === "default") {
      return (
        <p className={styles.input__select_wrapper}>
          <span className={styles.input__select_default_avatar} />
          <span className={styles.input__select_user}>{user}</span>
        </p>
      );
    }
    return (
      <p className={styles.input__select_wrapper}>
        <span className={styles.input__select_avatar}>
          <img src={avatar} width="24" height="24" alt="" />
        </span>
        <span className={styles.input__select_user}>{user}</span>
        <span className={styles.input__select_name}>({name})</span>
      </p>
    );
  };
  delFromSelectedMember = item => {
    this.setState(state => {
      const { selectedMember } = state;
      return {
        selectedMember: selectedMember.filter(i => i.user !== item.user)
      };
    });
  };
  addMemberToSelectedMember = item => {
    const { selectedMember } = this.state;
    const isMemberHasInSelectedMember = () =>
      selectedMember.find(each => each.user === item.user);
    if (isMemberHasInSelectedMember()) return;
    this.setState({
      selectedMember: [item, ...selectedMember]
    });
  };
  handleClickedResultListIcon = (item, e) => {
    if (e) e.stopPropagation();
    this.handleWhenSync(item);
    this.delFromSelectedMember(item);
  };
  handleWhenSync = item => {
    const condition = new Map([["org", this.removeSyncOrg()]]);
    const callback = condition.get(item.user);
    if (callback) callback();
  };
  removeSyncOrg = () => {
    this.setState({
      isSyncWithOrg: false
    });
  };
  handleToggleMemberInSelectedMember = (item, e) => {
    if (e) e.stopPropagation();
    const { selectedMember, isSyncWithOrg } = this.state;
    if (isSyncWithOrg) return;
    const member = this.genUserToDefinedMember(item);
    const isMemberHasInSelectedMember = () =>
      selectedMember.find(each => each.user === member.user);
    if (isMemberHasInSelectedMember()) {
      return this.delFromSelectedMember(member);
    }
    return this.addMemberToSelectedMember(member);
  };
  isAvatarValid = avatar => {
    return avatar && typeof avatar === "string" && avatar.startsWith("http");
  };
  checkMemberInSelectedMember = item => {
    const { selectedMember } = this.state;
    const mobileOrEmail = item.mobile ? item.mobile : item.email;
    return selectedMember.find(
      each => each.type === "platform" && each.user === mobileOrEmail
    );
  };
  sortMemberListByCapital = (arr = []) => {
    if (!arr.length) return [];
    return arr.sort((a, b) => {
      const getName = ele =>
        ele.full_name
          ? ele.full_name
          : ele.nickname
          ? ele.nickname
          : ele.mobile
          ? ele.mobile
          : ele.email
          ? ele.email
          : ele.name
          ? ele.name
          : "garbage data";
      const aNameCapital = getPinyin(getName(a), "").toUpperCase()[0];
      const bNameCapital = getPinyin(getName(b), "").toUpperCase()[0];
      return aNameCapital.localeCompare(bNameCapital);
    });
  };
  syncWithOrg = () => {
    const { isSyncWithOrg } = this.state;
    const { currentOrgAllMembersList, currentOrg } = this.props;
    //如果是要与组织同步，那么先移除已选列表的组织内成员，然后将组织添加到列表
    if (!isSyncWithOrg) {
      Promise.resolve(
        //删除已经在被同步的组织中的已添加成员
        this.delMultiFromSelectedMember(currentOrgAllMembersList)
      )
        .then(() =>
          this.addOrgMemberToCurrentSyncSetsMemberList(currentOrgAllMembersList)
        )
        .then(() => this.setOrgToSelectedMember(currentOrg));
    } else {
      Promise.resolve(this.delOrgFromSelectedMember(currentOrg)).then(() =>
        this.removeOrgMemberFromCurrentSyncSetMemberList()
      );
    }
    this.setState({
      isSyncWithOrg: !isSyncWithOrg
    });
  };
  removeOrgMemberFromCurrentSyncSetMemberList = () => {
    const { currentSyncSetsMemberList } = this.state;
    this.setState({
      currentSyncSetsMemberList: { ...currentSyncSetsMemberList, org: [] }
    });
  };
  addOrgMemberToCurrentSyncSetsMemberList = currentOrgAllMembersList => {
    const { currentSyncSetsMemberList } = this.state;
    this.setState({
      currentSyncSetsMemberList: {
        ...currentSyncSetsMemberList,
        org: [...currentOrgAllMembersList]
      }
    });
  };
  setOrgToSelectedMember = org => {
    const { selectedMember } = this.state;
    const item = {
      type: "org", //org||project||group
      icon: org.logo,
      name: org.name,
      user: org.id
    };
    this.setState({
      selectedMember: [item, ...selectedMember]
    });
  };
  delOrgFromSelectedMember = org => {
    const { selectedMember } = this.state;
    this.setState({
      selectedMember: selectedMember.filter(each => each.user !== org.id)
    });
  };
  delMultiFromSelectedMember = arr => {
    const { selectedMember } = this.state;
    console.log(arr, selectedMember);
    console.log(
      selectedMember.filter(
        each =>
          !arr.find(
            item => item.mobile === each.user || item.email === each.user
          )
      ),
      "filter selected member"
    );
    this.setState({
      selectedMember: selectedMember.filter(
        each =>
          !arr.find(
            item => item.mobile === each.user || item.email === each.user
          )
      )
    });
  };
  toggleSync = () => {
    const { currentMemberListSet } = this.state;
    const condition = new Map([["org", () => this.syncWithOrg()]]);
    const callback = condition.get(currentMemberListSet);
    if (callback) callback();
  };
  handleClickedInviteFromGroup = () => {
    this.setState({
      isInSelectedList: true,
      step: "group-list"
    });
  };
  handleClickedInviteFromGroupList = id => {
    const { groupList } = this.props;
    this.setState({
      isInSelectedList: false,
      step: `group-${id}`,
      membersListToSelect: groupList.find(item => item.id === id).members
    });
  };
  handleBack = () => {
    const { currentOrgAllMembersList, groupList } = this.props;
    const { step } = this.state;
    const [type, id] = step.split("-");
    //step: 当前的步进 home || group-list || group-id || project-list ||project-id
    const conditionMap = new Map([
      [
        `group-${id}`,
        () =>
          this.setState({
            isInSelectedList: true,
            step: "group-list",
            membersListToSelect: groupList.find(item => item.id === id).members
          })
      ],
      [
        "group-list",
        () =>
          this.setState({
            isInSelectedList: false,
            step: "home",
            membersListToSelect: Array.isArray(currentOrgAllMembersList)
              ? currentOrgAllMembersList
              : [] //人员选择列表
          })
      ]
    ]);
    const callback = conditionMap.get(step);
    if (callback) callback();
  };
  getGroupList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "organizationMember/getGroupList",
      payload: {}
    });
  };
  componentDidMount() {
    this.getGroupList();
  }
  renderWhenNoData = () => {
    return null;
  };
  renderCurrentSetSync = () => {
    const { step, isSyncWithOrg } = this.state;
    const { currentOrg } = this.props;

    return (
      <div className={styles.invite__select_member_all}>
        <span className={styles.invite__select_member_all_info}>
          <img
            className={styles.invite__select_member_all_avatar}
            width="20"
            height="20"
            src={currentOrg.logo}
            alt=""
          />
          <span className={styles.invite__select_member_all_title}>
            {currentOrg.name}
          </span>
        </span>
        <span className={styles.invite__select_member_all_operator}>
          {!isSyncWithOrg && (
            <span
              className={styles.invite__select_member_all_operator_sync}
              onClick={this.toggleSync}
            >
              同步
            </span>
          )}
          {isSyncWithOrg && (
            <span
              className={styles.invite__select_member_all_operator_cancel}
              onClick={this.toggleSync}
            >
              取消同步
            </span>
          )}
          <Tooltip title="全选所有人参与，同步人员变动">
            <span
              className={styles.invite__select_member_all_operator_prompt}
            />
          </Tooltip>
        </span>
      </div>
    );
  };
  renderSelectList = () => {
    const { step } = this.state;
    const { groupList, projectList } = this.props;
    const selectHome = (
      <div className={styles.invite__select_list_wrapper}>
        <div
          className={styles.invite__select_list_item}
          onClick={this.handleClickedInviteFromGroup}
        >
          <span className={styles.invite__select_list_item_text}>
            从分组邀请
          </span>
          <span className={styles.invite__select_list_item_icon} />
        </div>
        <div className={styles.invite__select_list_item}>
          <span className={styles.invite__select_list_item_text}>
            从项目邀请
          </span>
          <span className={styles.invite__select_list_item_icon} />
        </div>
      </div>
    );
    const selectGroupList = (
      <div className={styles.invite__select_list_wrapper}>
        {groupList.map(item => (
          <div
            key={item.id}
            className={styles.invite__select_list_item}
            onClick={() => this.handleClickedInviteFromGroupList(item.id)}
          >
            <span className={styles.invite__select_list_item_text}>
              {item.name}
            </span>
            <span className={styles.invite__select_list_item_icon} />
          </div>
        ))}
      </div>
    );
    const selectProjectList = (
      <div className={styles.invite__select_list_wrapper}>
        {projectList.map(item => (
          <div
            key={item.board_id}
            className={styles.invite__select_list_item}
            onClick={this.handleClickedInviteFromGroup}
          >
            <span className={styles.invite__select_list_item_text}>
              {item.board_name}
            </span>
            <span className={styles.invite__select_list_item_icon} />
          </div>
        ))}
      </div>
    );
    //step: "home" //当前的步进 home || group-list || group-id || project-list ||project-id
    const condition = new Map([
      ["home", selectHome],
      ["group-list", selectGroupList],
      ["project-list", selectProjectList]
    ]);
    return condition.get(step) ? condition.get(step) : null;
  };
  render() {
    const {
      title,
      submitText,
      currentOrg,
      currentOrgAllMembersList
    } = this.props;
    const {
      fetching,
      inputRet,
      inputValue,
      selectedMember,
      isSyncWithOrg,
      membersListToSelect,
      isInSelectedList,
      step
    } = this.state;
    const isGetData = () => currentOrg && currentOrgAllMembersList;
    if (!isGetData()) {
      return this.renderWhenNoData();
    }
    const sortedMembersListToSelect = this.sortMemberListByCapital(
      membersListToSelect
    );
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.invite__input}>
          <Select
            mode="multiple"
            value={inputValue}
            labelInValue
            placeholder="请输入被邀请人的手机号或邮箱"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={this.handleSearchUser}
            onChange={this.handleInputChange}
            onSelect={this.handleInputSelected}
            onDeselect={this.handleInputDeselected}
            style={{ width: "100%" }}
          >
            {inputRet.map(item => (
              <Option key={item.value}>{this.genOptionLabel(item)}</Option>
            ))}
          </Select>
        </div>
        <div className={styles.invite__select_wrapper}>
          {step !== "home" && (
            <div
              className={styles.invite__select_back_wrapper}
              onClick={this.handleBack}
            >
              <span className={styles.invite__select_back_icon} />
              <span className={styles.invite__select_back_text}>
                返回上一级
              </span>
            </div>
          )}
          <div className={styles.invite__select_content_wrapper}>
            {this.renderSelectList()}
            {this.renderCurrentSetSync()}
            {!isInSelectedList && (
              <div className={styles.invite__select_member_wrapper}>
                {sortedMembersListToSelect.map(item => (
                  <div
                    key={item.id}
                    className={styles.invite__select_member_item}
                    onClick={e =>
                      this.handleToggleMemberInSelectedMember(item, e)
                    }
                  >
                    <span className={styles.invite__select_member_item_info}>
                      <img
                        className={styles.invite__select_member_item_avatar}
                        width="20"
                        height="20"
                        src={
                          this.isAvatarValid(item.avatar)
                            ? item.avatar
                            : defaultUserAvatar
                        }
                        alt=""
                      />
                      <span className={styles.invite__select_member_item_title}>
                        {item.full_name}
                      </span>
                    </span>
                    <span
                      className={styles.invite__select_member_item_operator}
                    >
                      {isSyncWithOrg ? null : this.checkMemberInSelectedMember(
                          item
                        ) ? (
                        <span
                          className={
                            styles.invite__select_member_item_operator_selected
                          }
                        />
                      ) : (
                        <span
                          className={
                            styles.invite__select_member_item_operator_unselected
                          }
                        />
                      )}
                      {isSyncWithOrg && (
                        <span
                          className={
                            styles.invite__select_member_item_operator_disabled
                          }
                        />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.invite__result_wrapper}>
          <div className={styles.invite__result_list}>
            {selectedMember.map(item => (
              <div className={styles.invite__result_list_item} key={item.user}>
                <Tooltip title={item.type === "other" ? item.user : item.name}>
                  <div className={styles.invite__result_list_item_img_wrapper}>
                    <img
                      src={
                        item.type === "other"
                          ? defaultUserAvatar
                          : this.isAvatarValid(item.icon)
                          ? item.icon
                          : defaultUserAvatar
                      }
                      alt=""
                      width="24"
                      height="24"
                      className={styles.invite__result_list_item_img}
                    />
                    <span
                      className={styles.invite__result_list_icon}
                      onClick={e => this.handleClickedResultListIcon(item, e)}
                    />
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.invite__submit_wrapper}>
          <Button type="primary">{submitText}</Button>
        </div>
      </div>
    );
  }
}

InviteOthers.defaultProps = {
  title: "步骤三: 邀请他人一起参与项目",
  submitText: "完成创建"
};

export default InviteOthers;
