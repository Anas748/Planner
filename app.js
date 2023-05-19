/* -------------------------- CALENDER -------------------*/
const date = new Date();
const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  updateYear();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  
  for (let i = 1; i <= lastDay; i++) {
    if (i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
      days += `<div class="selectable-date today" data-date="${new Date(date.getFullYear(), date.getMonth(), i).toISOString()}">${i}</div>`;
    } else {
      days += `<div class="selectable-date" data-date="${new Date(date.getFullYear(), date.getMonth(), i).toISOString()}">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  monthDays.innerHTML = days; // Moved this line outside the loop
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add click event listeners to selectable dates
  const selectableDates = document.querySelectorAll(".selectable-date");
  selectableDates.forEach(date => {
    date.addEventListener("click", () => {
      const selectedDate = new Date(date.getAttribute("data-date"));
      const formattedDate = formatDate(selectedDate);
      document.querySelector("#date-input").value = formattedDate;
    });
  });
};
// select all the dates in the calendar
const calendarDates = document.querySelectorAll(".days div");
// Get the date input element
const dateInput = document.getElementById("date-input");
// show the selected date next to "Date:" label
const dateLabel = document.querySelector("#date-label");
// add change event listener to the date input element
dateInput.addEventListener("change", () => {
  const selectedDate = new Date(dateInput.value);
  dateLabel.innerHTML = `Date: ${selectedDate.toLocaleDateString()}`;
  dateInput.value = selectedDate.toLocaleDateString();
});
const updateYear = () => {
  document.querySelector(".date p").innerHTML = date.getFullYear();
};
document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
renderCalendar();
/* -------------------------- CALENDER -------------------*/





const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const notesInput = document.querySelector('input[name="Notes"]');
const saveButton = document.getElementById('save');
const allButton = document.getElementById('all-button');
const completedButton = document.getElementById('completed-button');
const upcomingButton = document.getElementById('upcoming-button');
const flaggedButton = document.getElementById('flagged-button');
const home = document.getElementById('return-button');

let reminder = {
  date: '',
  notes: '',
  files: []
};

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone on drag over
dropZone.addEventListener('dragover', highlight, false);
dropZone.addEventListener('dragleave', unhighlight, false);

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dropZone.classList.add('highlight');
}

function unhighlight() {
  dropZone.classList.remove('highlight');
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(file => {
    saveFileLocally(file);
    reminder.files.push(file);
  });
}

function saveFileLocally(file) {
  const reader = new FileReader();
  console.log(reader)
  
  reader.onload = function () {
    reader.name = file.name
   console.log(reader.name)
    const fileData = reader.result;
    const fileName = file.name;
    // Handle the file data here (e.g., save it to a database or local storage)
    const savedFileNames = JSON.parse(localStorage.getItem('fileNames')) || [];
    savedFileNames.push(fileName);
    localStorage.setItem('fileNames', JSON.stringify(savedFileNames));

    const savedFiles = JSON.parse(localStorage.getItem('files')) || [];
    savedFiles.push(fileData);
    localStorage.setItem('files', JSON.stringify(savedFiles));
    console.log(JSON.stringify(savedFiles))
    console.log('File saved locally:', file.name);
  };
  reader.readAsDataURL(file);
}

// Open file dialog on click
dropZone.addEventListener('click', () => {
  fileInput.click();
});

// Handle selected files
fileInput.addEventListener('change', () => {
  const files = fileInput.files;

  handleFiles(files);
});

// Handle Save button click
saveButton.onclick = function(){
  const dateInput = document.getElementById('date-input');
  const notesInput = document.getElementById('notes-input');
  const fileInput = document.getElementById('file-input');
  const flagCheckbox = document.getElementById('flag-checkbox');
  // Get the selected date, notes, and files
 
  const selectedDate = dateInput.value;
  const notes = notesInput.value;
  const files = fileInput.files;

  // Create an object to represent the reminder
  const reminder = {
    
    date: selectedDate,
    notes: notes,
    files: [...files],
    flagged: flagCheckbox.checked
  };
  // Save the reminder to your desired storage mechanism
  // For example, if you want to store it in local storage:
  const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
  savedReminders.push(reminder);
  localStorage.setItem('reminders', JSON.stringify(savedReminders));

  // Clear the form inputs
  dateInput.value = '';
  notesInput.value = '';
  fileInput.value = '';
  flagCheckbox.checked = false;
}


completedButton.addEventListener('click', () => {
  // Logic to display completed reminders
  window.location.href = 'com.html';
});

upcomingButton.addEventListener('click', () => {
  // Logic to display upcoming reminders
  window.location.href = 'up.html';
  console.log('Show upcoming reminders');
});

flaggedButton.addEventListener('click', () => {
  window.location.href = 'flag.html';
});


allButton.addEventListener('click', () => {
  console.log(' its working ');
  window.location.href = 'all.html';
  
});


function showReminderDetails(reminder) {
  const detailsContainer = document.createElement('div');
  detailsContainer.innerHTML = `
    <p><strong>Date:</strong> ${reminder.date}</p>
    <p><strong>Notes:</strong> ${reminder.notes}</p>
  `;

  // Append the file details
  if (reminder.files.length > 0) {
    const filesContainer = document.createElement('div');
    filesContainer.innerHTML = '<strong>Files:</strong>';
    reminder.files.forEach((file, index) => {
      const fileElement = document.createElement('p');
      fileElement.textContent = `File ${index + 1}: ${file.name}`;
      filesContainer.appendChild(fileElement);
    });
    detailsContainer.appendChild(filesContainer);
  }

  // Display the details (e.g., in a modal, on the same page, etc.)
  console.log('Reminder Details:', detailsContainer.innerHTML);

  // Add the details to the "result-all" container
  const resultContainer = document.querySelector('.result-all');
  resultContainer.innerHTML = '';
  resultContainer.appendChild(detailsContainer);
}
//complete tasks

function displayCompletedReminders() {
    
  // Retrieve the saved reminders from your desired storage mechanism
  // For example, if you stored them in local storage:
  const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];

  const compTaskContainer = document.querySelector('.comp-task');

  // Clear the existing content
  compTaskContainer.innerHTML = '';

  // Get the current date
  const currentDate = new Date();

  // Filter the saved reminders for completed and past reminders
  const completedReminders = savedReminders.filter(reminder => {
    const reminderDate = new Date(reminder.date);
    return reminderDate <= currentDate;
  });

  // Generate the HTML for each completed reminder
  completedReminders.forEach((reminder, index) => {
    const reminderElement = document.createElement('div');
    reminderElement.classList.add('reminder-item');
    reminderElement.innerHTML = `
      <p><strong>Date:</strong> ${reminder.date}</p>
      <p><strong>Notes:</strong> ${reminder.notes}</p>
    `;
    
    // Add a click event listener to show the details of the reminder
    reminderElement.addEventListener('click', () => {
      showReminderDetails(reminder);
    });

    compTaskContainer.appendChild(reminderElement);

  });
 
}




  




