export const EXCELCONFIG = {
  /**
   * 错误提示信息
   */
  NUMBERERRORMSGS: {
    /**
     * 空状态
     */
    NULL: null,
    /**
     * 空数据
     */
    EMPITY: '数据为空',
    /**
     * 长度错误
     */
    LENGTHERR: '序号长度错误,最后一层示例为: 1.1.1',
    /**
     * 不是序号类型数据
     */
    NOTNUMBER: '此数据不是可解析的序号类型数据',
    /**
     * 层级类型错误
     */
    LEVELERR: '层级类型错误',
    /**
     * 不能为整数
     */
    CANNOTINT: '不能为整数',
    /**
     * 不是整数
     */
    NOTINT: '只能是整数',
    /**
     * 相邻数字不符合
     */
    SIBLINGERR: '相邻数据不匹配',
    /**
     * 相邻整数与小数匹配不对
     */
    NEXTSIBLINGINTANDFLOAT:
      '相邻数字中，下一级不可以出现例如: 1下面直接跟2.1是错误的，1下面只能是1.1，1.2和2',
    /**
     * 相邻上一个数据与当前判定不对
     */
    PREVSIBLINGINTANDFLOAT:
      '相邻数字中，上一个数据序号不能越级，例2.1的上一个数据只能是2，不能是1.1.1.1 或2.1.1的上一级不能是2和2之前的序号',
    /**
     * 类型检测： 相邻数字中，上一个数据序号不能越级
     */
    PREVTYPESIBLINGERR: '相邻类型中'
  },
  /**
   * 类型判定错误提示
   */
  TYPEERRORS: {
    /**
     * 空状态
     */
    NULL: null,
    /**
     * 空数据
     */
    EMPITY: '数据为空',
    /**
     * 不是指定的文字
     */
    NOTREGTEXT: `不是指定的类型 【里程碑】【任务】【子任务】【子里程碑】`,
    /**
     * 第一个数据类型不是指定的类型
     */
    FIRSTTYPENOTREGTEXT: `此数据类型只能是【里程碑】 【任务】`,
    /**
     * 与上一级的类型关系不匹配
     */
    PREVTYPEREGERR: '关联的序号与上一级的类型关系不匹配'
  },
  TIMEERRORS: {
    /**
     * 空状态
     */
    NULL: null,
    /**
     * 空数据
     */
    EMPITY: '数据为空',
    /**
     * 不合法的时间类型数据
     */
    NOTREGTIME: '不合法的时间类型数据',
    /**
     * 开始时间大于了结束时间
     */
    STARTTIMEGTENDTIME: '开始时间不能大于结束时间'
  }
}
