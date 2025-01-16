export const addLocalEvent = (title) => {
    if (!title) return {status: false, message: "事件名不能为空", data: null}
    // 获取已有的事件列表
    const events = getLocalEvents() || [];
    const exist = events.find(item => item.title === title)
    if (exist) {
        return {status: false, message: "事件已存在", data: null}
    }
    const newEvent = {title, toDo: [], inProgress: [], completed: []};
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    return {status: true, message: "添加成功！", data: events}

};

export const getLocalEvents = () => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
};

export const removeLocalEvent = (title: string) => {
    let events = getLocalEvents();
    if (events) {
        events = events.filter(event => event.title !== title);
        localStorage.setItem('events', JSON.stringify(events));
        return {status: true, message: "删除成功", data: events}
    }
};

export const updateLocalEvent = (newEvent) => {
    // 获取已有的事件列表
    const events = getLocalEvents();
    // 查找需要更新的事件
    const index = events.findIndex(event => event.title === newEvent.title);
    if (index === -1) {
        return {status: false, message: "未找到指定的事件", data: null};
    }
    // 更新数组中的事件对象
    events[index] = newEvent;

    // 保存更新后的事件列表到 localStorage
    localStorage.setItem('events', JSON.stringify(events));

    return {status: true, message: "更新成功", data: events};
};
