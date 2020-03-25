// 触发growing io的事件
const triggerGio = (data) => {
    console.log('triggerGio0', arguments)
    console.log('triggerGio01', arguments.length)

    if (gio) {
        console.log('triggerGio1', gio)
        gio(data)
    }
    return gio
}

export default triggerGio