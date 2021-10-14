const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const listTask = $('.list_tasks')
const addTaskBtn = $('.add_btn')
const nameTask = $('.name_input')
const timeTask = $('.time_input')
const timeUnit = $('.time_unit')
const costTask = $('.cost_input')
const appNotify = $('.app_notify')
const notifyMessage = $('.notify_message')
const notifyIcon = $('.notify_icon')
const createNew = $('.create_new')
const tabContain = $('.tab-contain')
const taskLoveBtn = $('.task_btn-love')
const createbtn = $('.createbtn')
const tabs = $$('.tab-item')
const tabNotify = $('.tab_notify')
const optimal = $('.submit')
const inputMaxTime = $('.input_time-max')
const optimalUnit = $('.optimal-time_unit')
const listTaskOptimal = $('.list_task-optimal')
const optimalOptions = $('.optimal-options')
const retry = $('.retry')
const app = {
    taskList:[],
    taskCompleted:[],
    indexTask: 0,
    renderNotify: function(list) {
        tabNotify.innerHTML = `
            <div class="tab_notify-icon">
                <img src="./imgs/box.png" class="icon-box">
            </div>
            <span>Hiện tại bạn chưa thêm công việc mới nào.</span>`
        this.checkContain(list);
    },
    renderTasks: function(taskList) {
        let index = 0
        optimalOptions.style.display = 'none'
        $('.list_task-optimal').style.display = 'flex'
        let sumCost = 0, sumTime = 0
        var html = taskList.map(function(task) {
            let temp = 'Không'
            if (task.isLove) {
                temp = 'Có'
            } 
            if (task.isChoose) {
                index++     
                sumCost += task.cost
                sumTime += task.time
                return `
                    <tr>
                        <td>${index}</td>
                        <td>${task.name}</td>
                        <td>${task.cost}</td>
                        <td>${task.time}</td>
                        <td>${temp}</td>
                    </tr>
                `
            }
        })
        html.unshift(`
            <tr>
                <th>STT</th>
                <th>Tên Công Việc</th>
                <th>Thu Nhập</th>
                <th>Thời Gian (giờ)</th>
                <th>Ưu tiên</th>
             </tr>`)
        
        // Đổi tổng thời gian thu nhập
        let timeTemp 
        if (sumTime >= 24) {
            timeTemp = sumTime % 24
            sumTime = Math.floor(sumTime/24)
            if (timeTemp != 0) {
                sumTime = sumTime + ' ngày ' + timeTemp + ' giờ'
            }
            else 
                sumTime = sumTime + ' ngày'
        }
        else {
            sumTime = sumTime + ' giờ'   
        }

        html.push (
            ` <tr class="tr_end">
                <td>Tổng</td>
                <td></td>
                <td>${sumCost}</td>
                <td>${sumTime}</td>
                <td></td>
            </tr>`, 
            `<div class="optimal_btn">
                <button class="retry btn" onclick="app.handleRetry()">
                <i class="fas fa-arrow-alt-circle-left"></i>
                    Thực Hiện Lại
                </button>
                <button class="excel btn" onclick="ExportToExcel('xlsx')">
                    <i class="fas fa-file-excel"></i>
                    Xuất Excel
                </button>
            </div>`)
        $('.list_task-optimal table').innerHTML = html.join('')
    },
    handleRetry: function() {
        $('.optimal-options').style.display = 'flex'
        $('.optimal_btn').style.display = 'none'
        $('.list_task-optimal').style.display = 'none'

    },
    checkInvalidTask: function(task) {
        if (!task.name|| !task.cost || !task.time 
            || typeof task.cost != 'number' || typeof task.time != 'number') {
                return false         
        }
        return true
    },
    checkListEmpty: function(list) {
        if (list.length == 0)
            return true
        return false
    },
    checkContain: function(list) {
        if (this.checkListEmpty(list)) {
            tabContain.classList.add('no_task')
        }
        else {
            tabContain.classList.remove('no_task')
        }
    },
    varlidator: function(task) {
        // Xử lý và trả và các lỗi
        if (this.checkInvalidTask(task)) {
            return 'Thêm công việc thành công'
        }
        else {
            if (!nameTask.value.trim() || !timeTask.value || !costTask.value) {
                return 'Vui lòng nhập thông tin đầy đủ'
            }
            else if (Number.parseFloat(costTask.value).toString()  == 'NaN' 
                && Number.parseFloat(timeTask.value).toString()  == 'NaN') { 
                return 'Thời gian và thu nhập phải là số'
            }
            else if (Number.parseFloat(costTask.value).toString()  == 'NaN') {
                return 'Thu nhập phải là số'
            }
            else if (Number.parseFloat(timeTask.value).toString()  == 'NaN') {
                return 'Thời gian phải là số'
            }
            else {
                return 'Thời gian và thu nhập phải lớn hơn 0'
            }
        }
    },
    setPropertyCss: function(task) {
        //Đặt các giá trị css
        if (this.checkInvalidTask(task)) {
            appNotify.style.display = 'flex'
            appNotify.style.backgroundColor = 'rgb(44, 230, 34, 0.85)'
            appNotify.style.boxShadow = '2px 1px 3px 0px rgb(74, 225, 66, 0.85)'
            notifyIcon.innerHTML = '<i class="fas fa-check-circle"></i>'    
            notifyMessage.innerText = this.varlidator(task)   
        } else {
            appNotify.style.display = 'flex'
            appNotify.style.backgroundColor = 'rgb(255, 60, 60, 0.85)'
            appNotify.style.boxShadow = '2px 1px 3px 0px #f05858d9'
            notifyIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>'  
            notifyMessage.innerText = this.varlidator(task)   
        }        
        appNotify.style.animation = 'appear-hide ease 3.5s'
        appNotify.style.animationFillMode = 'both'
        setTimeout(() => {
            appNotify.style.animation = 'none'
            appNotify.style.display = 'none'
        }, 3500);
    },
    handleLoveBtn: function(id) {
        const taskLove = $(`.task-${id} .task_btn-love`)
        app.taskList.forEach(function(task, index) {
            if (task.id == id) {
                task.isLove = !task.isLove
                taskLove.classList.toggle('loved')
            }
        })
    },
    handleDeleteBtn: function(id) {
        const taskDelete = $(`.task-${id}`)
        // Xóa khỏi list
        app.taskList.forEach(function(task, index) {
            if (task.id == id) {
                app.taskList.splice(index, 1);
            }
        })
        // Kiểm tra hiện thông báo không có công việc
        if (this.taskList.length == 0) {
            tabContain.classList.add('no_task')
            $('.create_new').style.display = 'none'
        }    

        // Thêm hiệu ứng animation
        taskDelete.style.animation = 'delete-all-task ease-out 0.3s'
        setTimeout(() => {
            taskDelete.remove();
        }, 300) 
    },
    addTaskSucceeded : function(task) {
        const html = `
        <div class="task task-${this.indexTask} task-completed">
            <div class="task_name">${task.name}</div>
            <div class="task_bottom">
                <div class="task_information">
                    <div class="task_cost">
                        <i class="fas fa-dollar-sign"></i>
                        ${task.cost}
                    </div>
                    <div class="task_time">
                        <i class="far fa-clock"></i>
                            ${task.time}
                        <span>${task.unit}</span>
                    </div>
                </div>
            </div>
        </div>`
        this.indexTask++
        $('.list_tasks.succeeded').insertAdjacentHTML("beforeend", html)
    },
    handleSucceeded: function(id) {
        const taskCompleted = $(`.task-${id}`)
        // Xóa khỏi list công việc và Thêm vào list task hoàn thành
        app.taskList.forEach(function(task, index) {
            if (task.id == id) {
                // Xóa khỏi danh sách công việc
                app.taskList.splice(index, 1)
                
                 // Thêm vào list task hoàn thành
                app.taskCompleted.push(task)
                app.addTaskSucceeded(task) 
            }
        })
        // Kiểm tra hiện thông báo không có công việc
        if (this.taskList.length == 0) {
            tabContain.classList.add('no_task')
            $('.create_new').style.display = 'none';
        }    

        // Thêm hiệu ứng animation
        taskCompleted.style.animation = 'delete-all-task ease-out 0.3s'
        setTimeout(() => {
            taskCompleted.remove();
        }, 300)   

    },
    updateEdit: function(task, oldTime, oldCost, index) {
        const editName = task.querySelector('.edit_name')
        const editCost = task.querySelector('.edit_cost')
        const editTime = task.querySelector('.edit_time')

        // Nếu cập nhật không hợp lệ thì đặt lại giá trị cũ
        let newCost = Number.parseFloat(editCost.value)
        let newTime = Number.parseFloat(editTime.value)
        if (newTime.toString() == 'NaN')
            newTime = oldTime
        if (newCost.toString() == 'NaN') 
            newCost = oldCost 

        // Cập nhật lại list
        app.taskList[index].name = editName.value
        app.taskList[index].cost = newCost
        app.taskList[index].time = newTime

        // Cập nhật giao diện
        task.querySelector('.task_name').innerHTML = `${app.taskList[index].name}`
        task.querySelector('.task_cost').innerHTML = 
                                    `<i class="fas fa-dollar-sign"></i> ${app.taskList[index].cost}`
        task.querySelector('.task_time').innerHTML = `<i class="far fa-clock"></i>
                                        ${app.taskList[index].time}
                                        <span>${app.taskList[index].unit}</span>`
    },     
    eventEnter: function(id) {
        // Gọi ở add Task //
        const task = $(`.task-${id}`)
        const edit = $(`.edit-${id}`)
        
        edit.style.display = 'none'

        // Tìm kiếm task có task.id = id
        this.taskList.forEach(function(task, i) {
            if (task.id == id) {
                index = i
            }
        })
        
        const oldCost = this.taskList[index].cost
        const oldTime = this.taskList[index].time

        // Cập nhật list và giao diện
        this.updateEdit(task, oldTime, oldCost, index)
    },
    eventBlur: function(id) {
        const task = $(`.task-${id}`)
        const edit = $(`.edit-${id}`)

        // Tìm kiếm task có task.id = id
        this.taskList.forEach(function(task, i) {
            if (task.id == id) {
                index = i
            }
        })
        
        const oldCost = this.taskList[index].cost
        const oldTime = this.taskList[index].time

        document.addEventListener('mouseup', function(e) {
            if (!$(`.task-${id}`).contains(e.target)) { 
                if (edit.style.display != 'none') {
                    edit.style.display = 'none'  
                    app.updateEdit(task, oldTime, oldCost, index)
                }
            }
        }) 
    },
    handleEdit: function(id) {
        const edit = $(`.edit-${id}`)
        const task = $(`.task-${id}`)
        let index
        edit.style.display = 'flex'
        const editName = task.querySelector('.edit_name')
        const editCost = task.querySelector('.edit_cost')
        const editTime = task.querySelector('.edit_time')

        // Lấy địa chỉ trong task List
        this.taskList.forEach(function(task, i) {
            if (task.id == id) {
                index = i
            }
        })

        // Lấy dữ liệu ra input
        editName.value = this.taskList[index].name
        editCost.value = this.taskList[index].cost
        editTime.value = this.taskList[index].time

        // Sự kiện blur lưu
        app.eventBlur(id)

    },
    handleChangeTabItem: function(index) {
        if (index == 0) {
            if (this.taskList.length == 0) {
                tabContain.classList.add('no_task')
            } else {
                tabContain.classList.remove('no_task')
            }
            // Thay đổi thông báo danh sách rỗng
            $('.tab_notify-icon').classList.remove('succeeded')
            $('.tab_notify-icon img').outerHTML = '<img src="./imgs/box.png" class="icon-box">'
            $('.tab_notify span').innerText = 'Hiện tại bạn chưa thêm công việc nào.'
            // Ẩn tối ưu
            $('.list_tasks.optimal').style.display = 'none'
            if (this.taskList.length != 0) {
                createNew.style.display = 'inline'
            }
        }
        else if (index == 1) {
            tabContain.classList.remove('no_task')
            createNew.style.display = 'none'
            $('.list_tasks.optimal').style.display = 'flex'
        }
        else if (index == 2) {
            if (this.taskCompleted.length == 0) {
                tabContain.classList.add('no_task')
            } else {
                tabContain.classList.remove('no_task')
            }
            // Thay đổi thông báo danh sách rỗng
            $('.tab_notify-icon').classList.add('succeeded')
            $('.tab_notify-icon img').outerHTML =
                 '<img src="./imgs/check-mark.png" class="icon-check-mark">'
            $('.tab_notify span').innerText = 'Không có công việc nào ở đây.'
            // Ẩn tối ưu
            $('.list_tasks.optimal').style.display = 'none'
            createNew.style.display = 'none'
        }
    },
    addTask: function(task) {
        // Kiểm tra công việc rỗng hay không
        if (this.checkInvalidTask(task)) {
            this.taskList.push(task)
            task.id = this.indexTask
            // Thêm vào DOM
            const html = `
            <div class="task task-${task.id}">
                <div class="edit edit-${task.id}">
                    <input type="text" class="edit_name">
                    <div class="edit_bottom">
                        <input type="text" class="edit_cost">
                        <input type="text" class="edit_time">
                    </div>
                </div>
                <button class="task_btn-love" 
                    onclick="app.handleLoveBtn(${task.id})">
                        <i class="far fa-heart non-love"></i>
                        <i class="fas fa-heart have-love"></i>
                </button>
                <div class="task_name">${task.name}</div>
                <div class="task_bottom">
                    <div class="task_information">
                        <div class="task_cost">
                            <i class="fas fa-dollar-sign"></i>
                            ${task.cost}
                        </div>
                        <div class="task_time">
                            <i class="far fa-clock"></i>
                                ${task.time}
                            <span>${task.unit}</span>
                        </div>
                    </div>
                    <div class="task_option">
                        <button class="btn-option btn-edit"
                            onclick="app.handleEdit(${task.id})">
                                <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-option btn-succeeded" 
                            onclick="app.handleSucceeded(${task.id})">
                                <i class="fas fa-check-circle"></i>
                        </button>
                        <button class="btn-option  btn-delete" 
                            onclick="app.handleDeleteBtn(${task.id})">
                                <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`
            this.indexTask++
            $('.list_tasks.all').insertAdjacentHTML("beforeend", html)

            // Bỏ thông báo list rỗng
            tabContain.classList.remove('no_task')
            // Chuyển sang tab công việc
            $('.list_tasks.active').classList.remove('active')
            $('.tab-item.active-tab-item').classList.remove('active-tab-item')
            tabs[0].classList.add('active-tab-item')
            $$('.list_tasks')[0].classList.add('active')
            createNew.style.display = 'inline'
            // Ẩn tối ưu
            $('.list_tasks.optimal').style.display = 'none'
            // Reset giá trị nhập
            nameTask.value = ''
            timeTask.value = ''
            costTask.value = ''

            // thêm sự kiện ấn enter lưu
            $$(`.edit-${task.id} input`).forEach(function(e) {
                e.addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                        app.eventEnter(task.id)
                    }
                })           
            })      
        }    
    },
    swap: function(i, j, taskList) {
        var temp = taskList[i]
        taskList[i] = taskList[j]
        taskList[j] = temp
    },
    sortList: function(tempList) {
        for (var i = 0; i < tempList.length; i++){
            for(var j = i; j < tempList.length; j++) {
              if (tempList[i].unitCost < tempList[j].unitCost) {
                this.swap(i, j, tempList)
              }
            }
        }
    },
    greenly: function(tempList, timeMax) {
        tempList.forEach(function(task){
            if (task.unit == 'ngày') {
                task.time *= 24
            }
        })
        tempList.forEach(function(task){
            if (task.isLove) {
                let temp = timeMax
                temp -= task.time
                if (temp >= 0) {
                    timeMax -= task.time
                    task.isChoose = true
                }
            }
        })
        tempList.forEach(function(task){
            if (!task.isLove) {
                let temp = timeMax
                temp -= task.time
                if (temp >= 0) {
                    timeMax -= task.time
                    task.isChoose = true
                }
            }
        })
    },
    checkOptimal: function() {
        appNotify.style.display = 'flex'
        appNotify.style.backgroundColor = 'rgb(255, 60, 60, 0.85)'
        appNotify.style.boxShadow = '2px 1px 3px 0px #f05858d9'
        notifyIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>'  
        notifyMessage.innerText = 'Thời gian phải là số' 
        appNotify.style.animation = 'appear-hide ease 3.5s'
        appNotify.style.animationFillMode = 'both'
        setTimeout(() => {
            appNotify.style.animation = 'none'
            appNotify.style.display = 'none'
        }, 3500);         
    },
    handleEvents: function() {
        const _this = this
        // Xử lý nhập dữ liệu dài
        nameTask.oninput = function () {
            if (this.value.length >= 70) {
                this.value = this.value.slice(0,70); 
            }
        }

        timeTask.oninput = function () {
            if (this.value.length >= 5) {
                this.value = this.value.slice(0,5); 
            }
        }

        costTask.oninput = function () {
            if (this.value.length >= 10) {
                this.value = this.value.slice(0,10); 
            }
        }

        // Xử lý thêm công việc
        addTaskBtn.onclick = function() {
            let time = Number.parseInt(timeTask.value)
            let cost = Number.parseInt(costTask.value)
            const task =  {
                name: nameTask.value.trim(),
                cost,
                time,
                unit: timeUnit.value,
                unitCost: cost / time,
                isLove: false,
                isChoose: false,
                isCompleted: false
            }

            // Thêm task 
            _this.addTask(task)

            // Đặt lại các giá trị css
            _this.setPropertyCss(task)
        }

        // Xứ lý tạo mới
        createNew.onclick = function() {
            document.getElementById('id01').style.display='block'
        }
        // Xử lý đồng ý tạo mới
        createbtn.onclick = function() {
            _this.taskList.length = 0
            _this.taskCompleted.length = 0
            // Hiện thông báo hết công việc
            tabContain.classList.add('no_task')
            $('.tab_notify-icon img').outerHTML =
                '<img src="./imgs/box.png" class="icon-box">'
            createNew.style.display = 'none'
            document.getElementById('id01').style.display='none'
            // Xóa html task
            $$('.task').forEach(function(task) {
                task.remove()
            })
        } 

        // Chuyển tab item
        tabs.forEach(function(tab, index){
            tab.onclick = function() {
                // Thay đổi tab active
                $('.list_tasks.active').classList.remove('active')
                $('.tab-item.active-tab-item').classList.remove('active-tab-item')
                tab.classList.add('active-tab-item')
                $$('.list_tasks')[index].classList.add('active')
                $('.optimal_message span').innerText = `${_this.taskList.length}`
                _this.handleChangeTabItem(index)  
            }
        })      
        
        // Xứ lý nút tối ưu
        optimal.onclick = function() {
            let tempList = _this.taskList
            // Đổi đơn vị tgian tối đa
            let timeMax = Number.parseInt(inputMaxTime.value)

            // Đổi đơn vị
            tempList.forEach(function(task) {
                if (task.unit == 'ngày') {
                    task.time *= 24
                    task.unitCost = task.cost / task.time
                    task.unit = "giờ"
                }
            })

            const timeMaxUnit = $('.optimal-time_unit').value
            if ($('.optimal-time_unit').value != 'gio')
                timeMax *= 24
            if (timeMax.toString() == 'NaN') {
                _this.checkOptimal()
            }
            else {
                // reset choose
                tempList.forEach(function(task) {
                    task.isChoose = false
                })
                // sắp xếp giảm dần 
                _this.sortList(tempList)
                // // Giải thuật tham ăn
                _this.greenly(tempList, timeMax)
                _this.renderTasks(tempList)
            }
        }        
    },
    start: function() {
        this.renderNotify(this.taskList)
        this.handleEvents()
    }
}
app.start()
