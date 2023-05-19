document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('add-task-form');
    const activeTaskList = document.getElementById('active-task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const flaggedTaskList = document.getElementById('flagged-task-list');
    const viewActiveButton = document.getElementById('view-active');
    const viewCompletedButton = document.getElementById('view-completed');
    const viewFlaggedButton = document.getElementById('view-flagged');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let task of tasks) {
        addTaskToDOM(task);
    }

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const date = document.getElementById('task-date').value;
        const note = document.getElementById('task-note').value;
        const fileInput = document.getElementById('task-file');
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.onloadend = function() {
            const base64String = file ? reader.result : null;
            const task = {
                date,
                note,
                fileName: file ? file.name : null,
                fileData: base64String,
                completed: false,
                flagged: false
            };
            tasks.push(task);
            addTaskToDOM(task);
            // Save tasks to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Clear the form
            taskForm.reset();
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            reader.onloadend();
        }
    });

    function addTaskToDOM(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.setAttribute('draggable', 'true'); // make it draggable
        taskDiv.innerHTML = `
            <p>Date: ${task.date}</p>
            <p>Note: ${task.note}</p>
            <p>File: ${task.fileName || 'No file attached'}</p>
            ${task.fileName ? `<a href="${task.fileData}" download="${task.fileName}">Download</a>` : ''}
            <button class="complete-button" data-date="${task.date}">Complete</button>
            <button class="delete-button" data-date="${task.date}">Delete</button>
            <button class="flag-button" data-date="${task.date}">${task.flagged ? 'Unflag' : 'Flag'}</button>
        `;
        taskDiv.addEventListener('dragstart', handleDragStart, false);
        taskDiv.addEventListener('dragover', handleDragOver, false);
        taskDiv.addEventListener('drop', handleDrop, false);
    
        if (task.flagged) {
            flaggedTaskList.appendChild(taskDiv);
        } else if (task.completed) {
            completedTaskList.appendChild(taskDiv);
        } else {
            activeTaskList.appendChild(taskDiv);
        }
    }
    
    let dragSrcEl = null;
    
    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.classList.add('over');
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    
        if (dragSrcEl != this) {
            this.parentNode.removeChild(dragSrcEl);
            const dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin',dropHTML);
            const dropElem = this.previousSibling;
            addDnDHandlers(dropElem);
        }
        this.classList.remove('over');
        return false;
    }
    
    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('drop', handleDrop, false);
    }
    

    function deleteTask(date) {
        const index = tasks.findIndex(task => task.date === date);
        if (index > -1) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function toggleComplete(date) {
        const task = tasks.find(task => task.date === date);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            reloadTasks();
        }
    }

    function toggleFlag(date) {
        const task = tasks.find(task => task.date === date);
        if (task) {
            task.flagged = !task.flagged;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            reloadTasks();
        }
    }

    function reloadTasks() {
        activeTaskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        flaggedTaskList.innerHTML = '';
        for (let task of tasks) {
            addTaskToDOM(task);
        }
    }

    viewActiveButton.addEventListener('click', function() {
        activeTaskList.style.display = 'block';
        completedTaskList.style.display = 'none';
        flaggedTaskList.style.display = 'none';
    });

    viewCompletedButton.addEventListener('click', function() {
        activeTaskList.style.display = 'none';
        completedTaskList.style.display = 'block';
        flaggedTaskList.style.display = 'none';
    });

    viewFlaggedButton.addEventListener('click', function() {
        activeTaskList.style.display = 'none';
        completedTaskList.style.display = 'none';
        flaggedTaskList.style.display = 'block';
    });

    activeTaskList.addEventListener('click', handleTaskButtonClick);
    completedTaskList.addEventListener('click', handleTaskButtonClick);
    flaggedTaskList.addEventListener('click', handleTaskButtonClick);

    function handleTaskButtonClick(e) {
        const date = e.target.getAttribute('data-date');
        if (e.target.classList.contains('complete-button')) {
            toggleComplete(date);
        } else if (e.target.classList.contains('delete-button')) {
            deleteTask(date);
            e.target.parentElement.remove();
        } else if (e.target.classList.contains('flag-button')) {
            toggleFlag(date);
        }
    }
});
