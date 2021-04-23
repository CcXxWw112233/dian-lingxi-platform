/** 将一维数据转换成背包算法中的二维数据
 * 可以用于将数据组成多个格子的二维数据，数据自上而下自适应填充
 * @param {{span:number}} props 传入的参数
 * @param {number} span 从开始到结束的时间跨度
 * @param {number} spanStep 每个跨度的单个宽度
 * @param {{id: string| number, width: number, startIndex: number}[]} data 传入需要调整的数据 必须要的参数有 id, width, startIndex
 * @returns {[[{id: string | number, _left: number, _end: number}]]}
 * @example const arr = MatrixArray({})
 */
export default props => {
  const { span, spanStep, data: PropsData } = props
  /** 时间跨度 */
  const Mdays = span
  /** 一个格子的长度 */
  const step = spanStep
  /** 主数据，二维数据 */
  let daysArray = [new Array(Mdays).fill(0)]
  /** 数据 */
  const data = PropsData
  //   [
  //   { id: 1, name: 111, width: 60, sort: 1, startIndex: 1 },
  //   { id: 2, name: 222, width: 60, sort: 4, startIndex: 2 },
  //   { id: 3, name: 333, width: 60, sort: 3, startIndex: 3 },
  //   { id: 4, name: 444, width: 60, sort: 5, startIndex: 8 },
  //   { id: 5, name: 555, width: 60, sort: 6, startIndex: 5 },
  //   { id: 6, name: 666, width: 60, sort: 7, startIndex: 6 },
  //   { id: 7, name: 777, width: 60, sort: 9, startIndex: 7 },
  //   { id: 8, name: 888, width: 40, sort: 8, startIndex: 1 },
  //   { id: 9, name: 999, width: 60, sort: 2, startIndex: 12 }
  // ]

  /**
   * 填充数据到矩阵
   * @param {{id: string| number, width: number, startIndex: number}} val 需要放入的数据
   * @returns {[[{}]]}
   */
  const fillDaysArray = val => {
    let arr = daysArray
    /** 占据了多少格子 */
    const numbers = Math.floor(val.width / step)
    /** 从哪个格子开始的 */
    const start = val.startIndex
    /** 长度和占用格子的下标 */
    const numberIndexs = (() => {
      let list = []
      for (let i = start; i < start + numbers; i++) {
        list.push(i)
      }
      return list
    })()
    /** 结束的格子 */
    const end = numberIndexs[numberIndexs.length - 1]
    /** 这个循环中，是否存在其他数据导致无法放进去的 */
    let isHasData = false
    /** 此条数据是否已经保存了 */
    let saveData = false
    arr = daysArray.map(days => {
      /** 说明数据已经放好了,不需要再进循环了 */
      if (saveData) return days
      /** 重新进入循环，会重置是否有数据判断 */
      isHasData = false
      for (let i = start; i < end; i++) {
        const day = days[i]
        /** 此列表中存在一个数据，无法放置在此处 */
        if (day !== 0) {
          isHasData = true
          break
        }
      }
      /** 说明这条数组不存在冲突的数据，可以直接放进去 */
      if (!isHasData) {
        saveData = true
        days = days.map((item, index) => {
          if (numberIndexs.includes(index)) {
            return { ...val, _left: start, _end: end }
          }
          return item
        })
      }
      return days
    })
    // console.log(isHasData)
    /** 所有循环中都有数据，新开一个数组，同等长度 */
    if (isHasData) {
      let newArr = new Array(Mdays).fill(0)
      newArr = newArr.map((item, index) => {
        if (numberIndexs.includes(index)) {
          return { ...val, _left: start, _end: end }
        }
        return item
      })
      arr.push(newArr)
    }
    return arr
  }

  /** 进行整合和调用 */
  data.forEach(item => {
    daysArray = fillDaysArray(item)
  })
  return daysArray
}
