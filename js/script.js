var currentTaskId = -1;
var currentCataId = -1;

initAll();

//初始化数据
function initDataBase() {
    if (!localStorage.cata || !localStorage.task) {
    var cataJson = [
        {
            "id": 0,
            "name": "默认分类"
        }, {
            "id": 1,
            "name": "测试分类1"
        }, {
            "id": 2,
            "name": "测试分类2"
        }, {
            "id": 3,
            "name": "测试分类3"
        }
    ];

    var taskJson = [
        {
            "id": 0,
            "pid": 0,
            "finished": true,
            "name": "测试任务1",
            "date": "2015-07-17",
            "content": "测试任务1内容",
        }, {
            "id": 1,
            "pid": 1,
            "finished": false,
            "name": "测试任务2",
            "date": "2015-07-16",
            "content": "测试任务2内容",
        }, {
            "id": 2,
            "pid": 1,
            "finished": false,
            "name": "测试任务3",
            "date": "2015-07-16",
            "content": "测试任务3内容",
        }, {
            "id": 3,
            "pid": 1,
            "finished": false,
            "name": "测试任务4",
            "date": "2015-07-20",
            "content": "测试任务4内容",
        }
    ];

    localStorage.cata = JSON.stringify(cataJson);
    localStorage.task = JSON.stringify(taskJson);
     }
}

//初始化All
function initAll() {
    initDataBase();
    initCataList();
    initNew();

    document.getElementById('all-cata').addEventListener("click", allClick);
    document.getElementById('addContent').addEventListener("click", function () {
        document.getElementById('cover').style.display = 'block';
    });
    document.getElementById('cancel').addEventListener("click", function () {
        document.getElementById('cover').style.display = 'none';
    });
    document.getElementById('confirm').addEventListener("click", confirmAddCata);
    //console.log(document.getElementById('addContent'));
    document.getElementById('addTask').addEventListener("click", addTaskClick);
    document.getElementById('filter-all').addEventListener("click", clickAll);
    document.getElementById('filter-unfinished').addEventListener("click", clickUnfinished);
    document.getElementById('filter-finished').addEventListener("click", clickFinished);
}

//查找所有分类
function queryCata() {
    return JSON.parse(localStorage.cata);
}

//根据id查找分类
function queryCataById(id) {
    var cata = JSON.parse(localStorage.cata);
    for (var i = 0; i < cata.length; i++) {
        if (cata[i].id == id) {
            return cata[i];
        }
    }
}

//查找所有任务
function queryTask() {
    return JSON.parse(localStorage.task);
}

//查找某日期下的任务
function queryTasksByDate(date, taskArr) {
    var tasks = [];
    // var allTasks = queryAllTasks();
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].date === date) {
            tasks.push(taskArr[i]);
        }
    }
    return tasks;
}

//通过ID查找任务
function queryTaskById(id) {
    var allTasks = queryTask();
    //  console.log(allTasks);
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id == id) {
            return allTasks[i];
        }
    }
}

//通过分类id查询任务
function queryTasksByCataId(id) {
    var result = [];
    var taskArr = queryTask();
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].pid == id) {
            result.push(taskArr[i]);
        }
    }
    //console.log(result);
    return result;
}
//queryTasksByCataId(1);

//根据id更新任务状态
function updateTaskStatusById(id) {
    var taskArr = queryTask();
    //console.log(taskArr);
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].id == id) {
            taskArr[i].finished = true;
            console.log(taskArr[i].finished);
        }
    }
    localStorage.task = JSON.stringify(taskArr);
}

//根据id更新任务
function updateTaskById(id, name, date, content) {
    var taskArr = queryTask();
    //console.log(taskArr);
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].id == id) {
            taskArr[i].name = name;
            taskArr[i].date = date;
            taskArr[i].content = content;
        }
    }
    localStorage.task = JSON.stringify(taskArr);
}

//初始化(显示)载入分类列表
function initCataList() {
    var cataData = queryCata();
    var cataList = document.getElementById('cataList');
    //var cataList = $('#cataList');
    var tempStr = '<p class="ul-text" id="cata-list-style">分类列表</p>';

    for (var i = 0; i < cataData.length; i++) {
        var listStr = "";
        listStr = '<li class="lis" cata-id=' + cataData[i].id + '><span><i class="fa fa-folder-open"></i> ' + cataData[i].name + '</span><i class="fa fa-trash-o"></i></li>';
        /*
        var newLi = document.createElement('li');
        addClass(newLi, 'lis');
        var newLiName = cataData[1].name;
        var textnode = document.createTextNode(newLiName);
        newLi.appendChild(textnode);
        cataList.appendChild(newLi);*/

        tempStr += listStr;
    }
    cataList.innerHTML = tempStr;
    //$('#cataList').innerHTML += tempStr;
    var lisArray = document.querySelectorAll('.lis');
    for (var i = 0, len = lisArray.length; i < len; i++) {
        lisArray[i].addEventListener("click", listClick);
    }
    var delArray = document.querySelectorAll('.fa-trash-o');
    for (var i = 0, len = delArray.length; i < len; i++) {
        delArray[i].addEventListener("click", clickDeleteCata);
    }

}

//初始化新建窗口
function initNew() {
    document.getElementById('new-cata-name').value = "";
}

//创建[日期-任务集]数据
function createDateData(taskArr) {
    var dateArr = [];
    var newDateTasks = [];

    for (var i = 0, len = taskArr.length; i < len; i++) {
        if (dateArr.indexOf(taskArr[i].date) == -1) {
            dateArr.push(taskArr[i].date);
        }
    }
    dateArr = dateArr.sort();

    //创建 日期-任务集 对象
    for (var j = 0, len = dateArr.length; j < len; j++) {
        var temp = {};
        temp.date = dateArr[j];
        temp.tasks = queryTasksByDate(dateArr[j], taskArr);
        newDateTasks.push(temp);
    }

    //console.log(newDateTasks);
    return newDateTasks;

}

//添加任务 
function addTask(taskObj) {
    var taskArr = queryTask();
    //console.log(taskObj);
    taskObj.id = taskArr[taskArr.length - 1].id + 1;
    taskArr.push(taskObj);

    localStorage.task = JSON.stringify(taskArr);

    return taskObj.id; //返回id
}

//显示任务列表
function displayTask(taskArr) {
    var result = "";
    if (taskArr.length === 0) {
        return result;
    }

    var dateArray = createDateData(taskArr);
    //console.log(dateArray);
    for (var i = 0; i < dateArray.length; i++) {
        //console.log("counti");
        var dateHtml = '<ul class="date"><p class="date-text">' + dateArray[i].date + '</p>';
        for (var j = 0; j < dateArray[i].tasks.length; j++) {
            //console.log("count");
            var taskStr = "";
            if (dateArray[i].tasks[j].finished) { //已完成的任务
                taskStr += '<li class="task-done task-name" task-id="' + dateArray[i].tasks[j].id + '"><i class="fa fa-check"></i>' + dateArray[i].tasks[j].name + '</li>';
            } else { //未完成的任务
                taskStr += '<li class="task-name" task-id="' + dateArray[i].tasks[j].id + '">' + dateArray[i].tasks[j].name + '</li>';
            }
            dateHtml += taskStr;
        }
        dateHtml += '</ul>';
        result += dateHtml;
    }
    //console.log(result);
    return result;
}

//清除目录active效果
function clearCataActive() {
    var allCata = document.getElementById('all-cata'); // [所有任务]标签
    removeClass(allCata, "active");
    var allList = document.querySelectorAll('.lis'); //其他标签
    for (var i = 0; i < allList.length; i++) {
        removeClass(allList[i], "active");
    }
}

//清除任务active效果
function clearTaskActive() {
    var allList = document.querySelectorAll('.task-name');
    for (var i = 0; i < allList.length; i++) {
        removeClass(allList[i], "active");
    }
}

//清除filter按钮的active效果
function clearFilterActive() {
    var allList = document.querySelectorAll('.filter');
    for (var i = 0; i < allList.length; i++) {
        removeClass(allList[i], "active");
    }
}

//将任务显示在右边
function displayTaskContent(taskId) {
    var task = queryTaskById(taskId);
    //console.log("display task: " + task);

    if (task === undefined) {
        document.getElementById('task-top').innerHTML = '';
        document.getElementById('task-time').innerHTML = '';
        document.getElementById('task-text').innerHTML = '';
        document.getElementById('button-area').innerHTML = "";
    } else {
        if (task.finished) {
            document.getElementById('task-top').innerHTML = '<h2 id="title">' + task.name + '</h2>';
        } else {
            document.getElementById('task-top').innerHTML = '<h2 id="title">' + task.name + '</h2>' + '<a id="mark-finished"><i class="fa fa-check-square-o"></i></a> <a id="edit"><i class="fa fa-pencil-square-o"></i></a>';
            document.getElementById('mark-finished').addEventListener("click", clickMark);
            document.getElementById('edit').addEventListener("click", clickEdit);
        }

        document.getElementById('task-time').innerHTML = '<p id="date">' + task.date + '</p>';
        document.getElementById('task-text').innerHTML = task.content;
        document.getElementById('button-area').innerHTML = "";
    }
}

//删除分类
function deleteCataById(id) {
    var CataArr = queryCata();
    var result = [];
    for (var i = 0; i < CataArr.length; i++) {
        if (CataArr[i].id == id) {
            result = CataArr.slice(0, i).concat(CataArr.slice(i + 1));

            //删除分类下的任务
            var taskArr = queryTasksByCataId(CataArr[i].id);
            //if(taskArr.length !== 0){}
            console.log('要删除的任务列表长度:' + CataArr[i].length);
            if (taskArr.length !== 0) {
                for (var j = 0; j < taskArr.length; j++) {
                    console.log('deleteTaskid: ' + taskArr[j].id);
                    deleteTaskById(taskArr[j].id);
                }
            }
            currentCataId = -1;
        }
    }
    localStorage.cata = JSON.stringify(result);
}

//删除任务
function deleteTaskById(id) {
    var taskArr = queryTask();
    var result = [];
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].id == id) {
            result = taskArr.slice(0, i).concat(taskArr.slice(i + 1));
            console.log("删除任务成功！");
        }
    }
    localStorage.task = JSON.stringify(result);
}

//添加分类
function addCata(cataName) {
    var cataJson = JSON.parse(localStorage.cata);
    var newCata = {};
    newCata.id = cataJson[cataJson.length - 1].id + 1;
    newCata.name = cataName;
    cataJson.push(newCata);
    localStorage.cata = JSON.stringify(cataJson);
}

//点击确定增加分类
function confirmAddCata() {
    var newCataName = document.getElementById('new-cata-name').value;
    //console.log(newCataName);
    if (newCataName === "") {
        alert("请输入分类名！");
    } else {
        //增加分类函数
        //console.log(newCataName);
        addCata(newCataName);
        initCataList(); //初始化分类
        document.getElementById('cover').style.display = 'none';
    }
    //初始化对话框
    initNew();
}

//点击分类
function listClick() {
    var cataId = this.getAttribute('cata-id');

    //高亮list
    clearCataActive();
    //console.log(this);
    addClass(this, "active");

    //默认筛选[所有]
    clearFilterActive();
    var filterAll = document.getElementById('filter-all');
    addClass(filterAll, "active");

    currentCataId = cataId;
    var taskData = queryTasksByCataId(cataId);
    //console.log(taskData);

    if (taskData.length === 0) {
        document.getElementById('task-list').innerHTML = "";
        displayTaskContent(-1);
    } else {
        //显示任务列表
        document.getElementById('task-list').innerHTML = displayTask(taskData);

        //默认显示目录下第一个任务
        var firstTaskId = taskData[0].id;
        var firstTask = document.querySelectorAll('.task-name')[0];
        console.log("firstId: " + firstTaskId);
        displayTaskContent(firstTaskId);

        console.log(firstTask);
        addClass(firstTask, "active");

        //添加任务li的点击事件
        var lisArray = document.querySelectorAll('.task-name');
        for (var i = 0, len = lisArray.length; i < len; i++) {
            lisArray[i].addEventListener("click", taskClick);
        }
    }
}

//点击任务
function taskClick() {
    var taskId = this.getAttribute('task-id');

    //高亮任务
    clearTaskActive();
    addClass(this, "active");

    currentTaskId = taskId;
    console.log('currentTaskId: ' + currentTaskId);
    //console.log(task);
    displayTaskContent(taskId);
}

//点击新增任务
function addTaskClick() {
    //console.log("add clicked!");
    document.getElementById('task-top').innerHTML = '<input type="text" id="input-title" placeholder="请输入标题">';
    document.getElementById('task-time').innerHTML = '<input type="date" id="input-date">';
    document.getElementById('task-text').innerHTML = '<textarea id="textarea-content" placeholder="请输入任务内容"></textarea>';
    document.getElementById('button-area').innerHTML = '<span id="info"></span><button id="save" class="btn">保存</button><button id="cancel-save" class="btn">放弃</button>';
    //$(".button-area").style.display = "block";
    clickSaveOrCancel();
}

//点击保存
function clickSave() {
    var title = document.getElementById('input-title');
    var content = document.getElementById('textarea-content');
    var date = document.getElementById('input-date');
    var info = document.getElementById('info');
    if (title.value === "") {
        info.innerHTML = "标题不能为空";
    } else if (date.value === "") {
        info.innerHTML = "日期不能为空";
    } else if (content.value === "") {
        info.innerHTML = "内容不能为空";
    } else if (currentCataId == -1) {
        info.innerHTML = "请先选择目录";
    } else {
        var taskObj = {};
        taskObj.finished = false;
        taskObj.name = title.value;
        taskObj.content = content.value;
        taskObj.date = date.value;
        //console.log(currentCataId);
        taskObj.pid = currentCataId;

        var taskId = addTask(taskObj); //保存新任务的id
        //更新分类中数量 tbd

        //更新任务列表
        var taskData = queryTasksByCataId(currentCataId);
        //console.log(taskData);
        document.getElementById('task-list').innerHTML = displayTask(taskData);

        //添加任务li的点击事件
        var lisArray = document.querySelectorAll('.task-name');
        for (var i = 0, len = lisArray.length; i < len; i++) {
            lisArray[i].addEventListener("click", taskClick);
        }

        //更新详细内容区
        console.log(taskId);
        currentTaskId = taskId;
        displayTaskContent(taskId);
    }
}

//点击保存修改
function clickSaveEdit() {
    var title = document.getElementById('input-title');
    var content = document.getElementById('textarea-content');
    var date = document.getElementById('input-date');
    var info = document.getElementById('info');
    if (title.value === "") {
        info.innerHTML = "标题不能为空";
    } else if (date.value === "") {
        info.innerHTML = "日期不能为空";
    } else if (content.value === "") {
        info.innerHTML = "内容不能为空";
    } else if (currentCataId == -1) {
        info.innerHTML = "请先选择目录";
    } else {
        /*var taskObj = {};
        taskObj.finished = false;
        taskObj.name = title.value;
        taskObj.content = content.value;
        taskObj.date = date.value;
        //console.log(currentCataId);
        taskObj.pid = currentCataId;*/

        console.log("curID: " + currentTaskId);

        updateTaskById(currentTaskId, title.value, date.value, content.value) //保存新任务的id

        //更新任务列表
        var taskData = queryTasksByCataId(currentCataId);
        //console.log(taskData);
        document.getElementById('task-list').innerHTML = displayTask(taskData);

        //添加任务li的点击事件
        var lisArray = document.querySelectorAll('.task-name');
        for (var i = 0, len = lisArray.length; i < len; i++) {
            lisArray[i].addEventListener("click", taskClick);
        }

        //更新详细内容区
        //console.log(taskId);
        displayTaskContent(currentTaskId);
    }
}

//保存或取消事件
function clickSaveOrCancel() {
    console.log(document.getElementById('save'));
    if (document.getElementById('save') !== null) {
        document.getElementById('save').addEventListener("click", clickSave);
    } else {
        document.getElementById('save-edit').addEventListener("click", clickSaveEdit);
    }

    document.getElementById('cancel-save').addEventListener("click", clickSaveCancel);
}

//点击取消保存
function clickSaveCancel() {
    if (currentTaskId !== -1) {
        displayTaskContent(currentTaskId);
    } else {
        //最好改为显示默认任务
        document.getElementById('task-top').innerHTML = '';
        document.getElementById('task-time').innerHTML = '';
        document.getElementById('task-text').innerHTML = '';
        document.getElementById('button-area').innerHTML = "";
    }
}

//点击已完成
function clickMark() {
    var c = confirm("确定标记已完成吗？");
    if (c) {
        var taskId = currentTaskId;
        //更新task数据
        updateTaskStatusById(taskId);

        //更新任务列表
        var taskData = queryTasksByCataId(currentCataId);
        //console.log(taskData);
        document.getElementById('task-list').innerHTML = displayTask(taskData);

        //添加任务li的点击事件
        var lisArray = document.querySelectorAll('.task-name');
        for (var i = 0, len = lisArray.length; i < len; i++) {
            lisArray[i].addEventListener("click", taskClick);
        }

        //更新右边
        displayTaskContent(taskId);

    }

}

//点击删除分类
function clickDeleteCata() {
    //阻止事件冒泡?

    var c = confirm("确认删除分类？");
    if (c) {
        var cataToBeDeleted = this.parentNode;
        //console.log(cataToBeDeleted);
        var cataId = cataToBeDeleted.getAttribute('cata-id');
        //console.log(cataId);
        deleteCataById(cataId);

        //更新分类列表
        initCataList();
        //更新任务列表
        document.getElementById('task-list').innerHTML = "";
        //更新任务内容部分
        displayTaskContent(-1);
    }
}

//点击修改按钮
function clickEdit() {
    console.log("Edit clicked!");

    var task = queryTaskById(currentTaskId);
    document.getElementById('task-top').innerHTML = '<input type="text" id="input-title" placeholder="请输入标题">';
    document.getElementById('input-title').value = task.name;
    document.getElementById('task-time').innerHTML = '<input type="date" id="input-date">';
    document.getElementById('input-date').value = task.date;
    document.getElementById('task-text').innerHTML = '<textarea id="textarea-content" placeholder="请输入任务内容"></textarea>';
    document.getElementById('textarea-content').value = task.content;
    document.getElementById('button-area').innerHTML = '<span id="info"></span><button id="save-edit" class="btn">保存修改</button><button id="cancel-save" class="btn">放弃</button>';
    //$(".button-area").style.display = "block";
    clickSaveOrCancel();
}

//点击分类下的[所有]按钮
function clickAll() {

    var allCata = document.getElementById('all-cata');
    if (hasClass(allCata, "active")) {
        var taskArr = queryTask();
        document.getElementById('task-list').innerHTML = displayTask(taskArr);
    } else {
        var currCata = document.querySelectorAll('.lis')[currentCataId];
        if (currCata !== undefined) {
            console.log(currCata);
            listClick.call(currCata);
        }
    }
    clearFilterActive();
    addClass(this, "active");


}

//点击分类下的[未完成]按钮
function clickUnfinished() {
    console.log("clicked Unfinished");

    //var currCata = document.querySelectorAll('.lis')[currentCataId];
    var tempTaskArr = [];
    var taskArr = [];
    var allCata = document.getElementById('all-cata');

    if (hasClass(allCata, "active")) {
        taskArr = queryTask();
    } else {
        taskArr = queryTasksByCataId(currentCataId);
    }
    //删除完成项目
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].finished === false) {
            tempTaskArr.push(taskArr[i]);
        }
    }
    //console.log(tempTaskArr);
    document.getElementById('task-list').innerHTML = displayTask(tempTaskArr);


    clearFilterActive();
    addClass(this, "active");
}
//点击分类下的[已完成]按钮
function clickFinished() {
    console.log("clicked Finished");
    //var currCata = document.querySelectorAll('.lis')[currentCataId];
    var tempTaskArr = [];
    var taskArr = [];
    var allCata = document.getElementById('all-cata');

    if (hasClass(allCata, "active")) {
        taskArr = queryTask();
    } else {
        taskArr = queryTasksByCataId(currentCataId);
    }

    //删除完成项目
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].finished === true) {
            tempTaskArr.push(taskArr[i]);
        }
    }
    //console.log(tempTaskArr);
    document.getElementById('task-list').innerHTML = displayTask(tempTaskArr);
    clearFilterActive();
    addClass(this, "active");
}

//点击[所有任务]
function allClick() {
    //默认筛选[所有]
    clearFilterActive();
    var filterAll = document.getElementById('filter-all');
    addClass(filterAll, "active");

    clearCataActive();
    addClass(this, "active");

    var taskData = queryTask();
    //console.log(taskData);
    document.getElementById('task-list').innerHTML = displayTask(taskData);

    //添加任务li的点击事件
    var lisArray = document.querySelectorAll('.task-name');
    for (var i = 0, len = lisArray.length; i < len; i++) {
        lisArray[i].addEventListener("click", taskClick);
    }
}
//document.querySelector('#task-list').innerHTML = displayTask(queryTask());
//console.log(queryTask());
//displayTask(queryTask());
//console.log($('#cataList'));