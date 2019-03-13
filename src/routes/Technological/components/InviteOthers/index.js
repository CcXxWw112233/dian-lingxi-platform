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
      membersListToSelect: Array.isArray(currentOrgAllMembersList) ? currentOrgAllMembersList : [], //人员选择列表
      isSyncWithOrg: false,

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
    const { avatar = "default", nickname = "default", mobile, email } = user;
    const mobileOrEmail = mobile ? mobile : email;
    return this.parseUserValueStr(
      this.genUserValueStr(avatar, nickname, mobileOrEmail, true)
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
  handleInputSelected = value => {
    const { selectedMember } = this.state;
    const selectedUser = this.parseUserValueStr(value.key);
    const isHasSameMemberInSelectedMember = () =>
      selectedMember.find(item => item.user === selectedUser.user);
    if (isHasSameMemberInSelectedMember()) return;
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
  renderWhenNoData = () => {
    return null;
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
    this.delFromSelectedMember(item);
  };
  handleToggleMemberInSelectedMember = (item, e) => {
    if (e) e.stopPropagation();
    const { selectedMember } = this.state;
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
    return arr.sort((a, b) => {
      const getName = ele =>
       ele.full_name
      ? ele.full_name
      : ele.nickname
      ? ele.nickname
      : ele.mobile
      ? ele.mobile
      : ele.email;
      const aNameCapital = getPinyin(getName(a), "").toUpperCase()[0]
      const bNameCapital = getPinyin(getName(b), "").toUpperCase()[0]
      return aNameCapital.localeCompare(bNameCapital)
    })
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
      membersListToSelect
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
          <div className={styles.invite__select_list_wrapper}>
            <div className={styles.invite__select_list_item}>
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
          <div className={styles.invite__select_member_wrapper}>
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
                <span
                  className={styles.invite__select_member_all_operator_sync}
                >
                  同步
                </span>
                {false && (
                  <span
                    className={styles.invite__select_member_all_operator_cancel}
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
            {sortedMembersListToSelect.map(item => (
              <div
                key={item.id}
                className={styles.invite__select_member_item}
                onClick={e => this.handleToggleMemberInSelectedMember(item, e)}
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
                <span className={styles.invite__select_member_item_operator}>
                  {this.checkMemberInSelectedMember(item) ? (
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
