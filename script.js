//using the DOMContentLoaded event to make sure the HTML is fully parsed before running our script.
document.addEventListener('DOMContentLoaded', function () {
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
    taskForm.addEventListener('submit', function (e) {
        // We prevent the default form submission behavior.
        e.preventDefault();

        // We grab the values from our form inputs.
        const date = document.getElementById('task-date').value;
        const note = document.getElementById('task-note').value;
        const fileInput = document.getElementById('task-file');
        const file = fileInput.files[0];

        //using the FileReader API to handle the uploaded file.
        const reader = new FileReader();
        reader.onloadend = function () {
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

    // Function to handle the start of a drag event.
    function handleDragStart(e) {
        // Store the element being dragged.
        dragSrcEl = this;

        // Allow the drag.
        e.dataTransfer.effectAllowed = 'move';

        // Set the data to be dragged.
        e.dataTransfer.setData('text/html', this.outerHTML);
    }

    // Function to handle the event when an element is being dragged over another.
    function handleDragOver(e) {
        // Prevent the default browser handling of the event.
        if (e.preventDefault) {
            e.preventDefault();
        }

        // Add the 'over' class to the element being dragged over.
        this.classList.add('over');

        // Indicate that the dragged item can be moved here.
        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    // Function to handle the drop of an element.
    function handleDrop(e) {
        // Stop the browser from redirecting.
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        // Check if the source element is not the same as the target.
        if (dragSrcEl != this) {
            // Remove the source from its original spot.
            this.parentNode.removeChild(dragSrcEl);

            // Get the HTML data of the element that was dragged.
            const dropHTML = e.dataTransfer.getData('text/html');

            // Insert the dragged element's HTML before the current element.
            this.insertAdjacentHTML('beforebegin', dropHTML);

            // Get the new element that was just added.
            const dropElem = this.previousSibling;

            // Add the drag and drop handlers to the new element.
            addDnDHandlers(dropElem);
        }

        // Remove the 'over' class from the element.
        this.classList.remove('over');

        return false;
    }

    // Function to add drag and drop event handlers to an element.
    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('drop', handleDrop, false);
    }

    // Function to delete a task.
    function deleteTask(date) {
        // Find the index of the task with the given date.
        const index = tasks.findIndex(task => task.date === date);

        // If a task was found, remove it from the array.
        if (index > -1) {
            tasks.splice(index, 1);

            // Update the tasks in localStorage.
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // Function to toggle the completion status of a task.
    function toggleComplete(date) {
        // Find the task with the given date.
        const task = tasks.find(task => task.date === date);

        // If a task was found, toggle its 'completed' status.
        if (task) {
            task.completed = !task.completed;

            // Update the tasks in localStorage.
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Reload the tasks in the DOM.
            reloadTasks();
        }
    }

    // Function to toggle the flag status of a task.
    function toggleFlag(date) {
        // Find the task with the given date.
        const task = tasks.find(task => task.date === date);

        // If a task was found, toggle its 'flagged' status.
        if (task) {
            task.flagged = !task.flagged;

            //Update the tasks in localStorage.
            localStorage.setItem('tasks', JSON.stringify(tasks));

            //Reload the tasks in the DOM.
            reloadTasks();
        }
    }

    //Function to reload the tasks in the DOM.
    function reloadTasks() {
        //Clear the tasks from the DOM.
        activeTaskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        flaggedTaskList.innerHTML = '';

        // Add each task in the array to the DOM.
        for (let task of tasks) {
            addTaskToDOM(task);
        }
    }

    // Event listeners to switch between viewing active, completed, and flagged tasks.
    viewActiveButton.addEventListener('click', function () {
        activeTaskList.style.display = 'block';
        completedTaskList.style.display = 'none';
        flaggedTaskList.style.display = 'none';
    });

    viewCompletedButton.addEventListener('click', function () {
        activeTaskList.style.display = 'none';
        completedTaskList.style.display = 'block';
        flaggedTaskList.style.display = 'none';
    });

    viewFlaggedButton.addEventListener('click', function () {
        activeTaskList.style.display = 'none';
        completedTaskList.style.display = 'none';
        flaggedTaskList.style.display = 'block';
    });

    // Add event listeners to handle task button clicks.
    activeTaskList.addEventListener('click', handleTaskButtonClick);
    completedTaskList.addEventListener('click', handleTaskButtonClick);
    flaggedTaskList.addEventListener('click', handleTaskButtonClick);

    // Function to handle clicks on task buttons.
    function handleTaskButtonClick(e) {
        // date from the clicked button.
        const date = e.target.getAttribute('data-date');

        // which button is clicked and perform the appropriate action.
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
