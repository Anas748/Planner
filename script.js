//using the DOMContentLoaded event to make sure the HTML is fully parsed before running our script.
document.addEventListener('DOMContentLoaded', function() {
    // all the elements we'll need to interact with and store them in variables.
    const taskForm = document.getElementById('add-task-form');
    const activeTaskList = document.getElementById('active-task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const flaggedTaskList = document.getElementById('flagged-task-list');
    const viewActiveButton = document.getElementById('view-active');
    const viewCompletedButton = document.getElementById('view-completed');
    const viewFlaggedButton = document.getElementById('view-flagged');

    // saved tasks from the user's localStorage. If no tasks are saved, we default to an empty array.
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    //iterate over each task in our list
    for (let task of tasks) {
        addTaskToDOM(task);
    }

    // We're listening for the form submission event, so we can properly add new tasks.
    taskForm.addEventListener('submit', function(e) {
        // We prevent the default form submission behavior.
        e.preventDefault();

        // We grab the values from our form inputs.
        const date = document.getElementById('task-date').value;
        const note = document.getElementById('task-note').value;
        const fileInput = document.getElementById('task-file');
        const file = fileInput.files[0];

        //using the FileReader API to handle the uploaded file.
        const reader = new FileReader();
        reader.onloadend = function() {
            // We create a new task object with the provided values, and a base64 representation of the file if one was provided.
            const base64String = file ? reader.result : null;
            const task = {
                date,
                note,
                fileName: file ? file.name : null,
                fileData: base64String,
                completed: false,
                flagged: false
            };
            //add our new task to the task array.
            tasks.push(task);
            // We then add our task to the DOM.
            addTaskToDOM(task);
            //saveing our new list of tasks back into localStorage.
            localStorage.setItem('tasks', JSON.stringify(tasks));

            //clear out the form for the next input.
            taskForm.reset();
        }
        //starting the process of reading the file if one was provided.
        if (file) {
            reader.readAsDataURL(file);
        } else {
            // If no file was provided, we manually trigger the onloadend event to continue with our process.
            reader.onloadend();
        }
    });



function addTaskToDOM(task) {
    // Create a new 'div' element to hold the task.
    const taskDiv = document.createElement('div');

    // Add the 'task-item' class to the new div.
    taskDiv.classList.add('task-item');

    // Set the div to be draggable. This is used for the drag-and-drop functionality.
    taskDiv.setAttribute('draggable', 'true');

    // Add the task's details to the div. If the task has a file, also add a download link for the file.
    taskDiv.innerHTML = `
        <p>Date: ${task.date}</p>
        <p>Note: ${task.note}</p>
        <p>File: ${task.fileName || 'No file attached'}</p>
        ${task.fileName ? `<a href="${task.fileData}" download="${task.fileName}">Download</a>` : ''}
        <button class="complete-button" data-date="${task.date}">Complete</button>
        <button class="delete-button" data-date="${task.date}">Delete</button>
        <button class="flag-button" data-date="${task.date}">${task.flagged ? 'Unflag' : 'Flag'}</button>
    `;

    // Add event listeners to handle dragging and dropping of the task.
    taskDiv.addEventListener('dragstart', handleDragStart, false);
    taskDiv.addEventListener('dragover', handleDragOver, false);
    taskDiv.addEventListener('drop', handleDrop, false);

    // Add the new task div to the appropriate list.
    if (task.flagged) {
        flaggedTaskList.appendChild(taskDiv);
    } else if (task.completed) {
        completedTaskList.appendChild(taskDiv);
    } else {
        activeTaskList.appendChild(taskDiv);
    }
}

// Create a variable to hold the element being dragged.
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
