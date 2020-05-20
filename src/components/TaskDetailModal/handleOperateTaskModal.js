// 这个文件用来装载任务相关的方法

import { timeSort } from "../../utils/util"

/**
 * - 情况一
 * 1.查找该任务弹窗是否有子任务
 * 2.有多个子任务并且有时间的情况下,需从中找到该时间最大的一个
 * 3.然后设置给父任务
 * 
 * -情况二
 * 1.当子任务修改时间后, 需修改父任务时间
 * 2.但是需要比较 该时间与最大设置的那个子任务时间 , 
 * 如果超过最大 则 修改父任务时间为当前时间, 否则不需要修改
 * 
 * - 情况三
 * 1.只要子任务有时间, 父任务时间不可修改
 * @param {Array} data 当前的数据
 * @returns {String} due_time 返回当前最大的时间
 */
export const  filterOwnSubTaskMaxDueTime = (data = []) => {
  // if (!data) return ''
  // let newData = JSON.parse(JSON.stringify(data || []))
  // let timerArray = timeSort(newData,'due_time')
  // let currentSubDueTime = (timerArray[timerArray.length - 1] || []).due_time
  // return currentSubDueTime
}