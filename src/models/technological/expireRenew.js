import { ExpireType } from '../../components/ExpireVip/constans'

const Constans = {
  /** 命名空间
   * @default string 'expirerenew'
   * @param {boolean} expireVisible 是否需要显示的变量
   * @param {string} expireType 显示类型，即将过期和已过期
   * @param {string} tips 过期提示文案
   * @param {string} expiredTime 将会过期的时间或者已经过期的时间
   */
  namespace: 'expirerenew',
  /** 变量 */
  state: {
    /** 是否需要显示 */
    expireVisible: false,
    /** 显示类型，即将过期和已过期 */
    expireType: ExpireType.Expired,
    /** 过期提示 */
    tips: '',
    /** 将会过期的时间或者已经过期的时间 */
    expiredTime: ''
  },
  /** 更新state定义的方法 */
  reducers: {
    /** 更新方法
     * @description 统一更新的方法，传入什么就更新什么，没做特殊处理
     */
    updateDatas: 'updateDatas'
  }
}

/** VIP过期的redux管理 */
export const ExpireModel = Constans

export default {
  namespace: Constans.namespace,
  state: { ...Constans.state },
  effects: {},
  reducers: {
    [Constans.reducers.updateDatas](state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
