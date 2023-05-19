const home = document.getElementById('return-button');
const completedButton = document.getElementById('completed-button');
const upcomingButton = document.getElementById('upcoming-button');
const flaggedButton = document.getElementById('flagged-button');

// Retrieve saved reminders from local storage
const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];

// Reference to the result container
const resultContainer = document.getElementById('result-all');

// Function to display the reminders
function displayReminders(reminders) {
  // Clear the existing content
  resultContainer.innerHTML = '';

  // Generate the HTML for each reminder

  reminders.forEach((reminder, index) => {
    const reminderElement = document.createElement('div');
    reminderElement.classList.add('reminder-item');
    reminderElement.innerHTML = `
      <p><strong>Date:</strong> ${reminder.date}</p>
      <p><strong>Notes:</strong> ${reminder.notes}</p>
      <p><strong>Files:</strong>${reminder.files}</p>
      <ul>
        ${generateFileList(reminder.files)}
      </ul>
      <button class="delete-button" data-index="${index}">Delete</button>
      <button class="complete-button" data-index="${index}">Complete</button>
    `;

    // Add event listeners to delete and complete buttons
    const deleteButton = reminderElement.querySelector('.delete-button');
    const completeButton = reminderElement.querySelector('.complete-button');
    deleteButton.addEventListener('click', handleDeleteReminder);
    completeButton.addEventListener('click', handleTransferReminder);

    resultContainer.appendChild(reminderElement);
  });
}

// Function to handle deleting a reminder
function handleDeleteReminder(event) {
  const index = event.target.dataset.index;
  if (index !== undefined) {
    // Remove the reminder from savedReminders
    savedReminders.splice(index, 1);
    // Update the local storage with the updated reminders
    localStorage.setItem('reminders', JSON.stringify(savedReminders));
    // Re-display the reminders
    displayReminders(savedReminders);
  }
}

// Function to handle transferring a reminder to com.html
function handleTransferReminder(event) {
  const index = event.target.dataset.index;
  if (index !== undefined) {
    const reminderToTransfer = savedReminders[index];

    // Transfer the reminder to com.html by storing it in localStorage
    localStorage.setItem('transferredReminder', JSON.stringify(reminderToTransfer));

    
    // Update the local storage with the updated reminders
    localStorage.setItem('reminders', JSON.stringify(savedReminders));

    // Re-display the reminders
    displayReminders(savedReminders);
  }
}

// Function to generate the HTML for the list of files
function generateFileList(files) {
  let fileListHTML = '';
  files.forEach(file => {
    fileListHTML += `<li>${file}</li>`;
  });
  return fileListHTML;
}


function filterReminders(searchQuery) {
  return savedReminders.filter(reminder => {
    const lowercaseNotes = reminder.notes.toLowerCase();
    const formattedDate = new Date(reminder.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toLowerCase();
    return lowercaseNotes.includes(searchQuery) || formattedDate.includes(searchQuery);
  });
}


// Add event listener to the search form
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearch);

// Function to handle the search
function handleSearch(event) {
  event.preventDefault(); // Prevent form submission
  const searchInput = document.getElementById('search-input');
  const searchQuery = searchInput.value.trim().toLowerCase();

  // Filter the reminders based on the search query
  const searchResults = filterReminders(searchQuery);

  // Display the search results with matching notes at the top
  const matchingReminders = searchResults.filter(reminder => reminder.notes.toLowerCase().includes(searchQuery));
  const nonMatchingReminders = searchResults.filter(reminder => !reminder.notes.toLowerCase().includes(searchQuery));
  const sortedReminders = matchingReminders.concat(nonMatchingReminders);

  displayReminders(sortedReminders);
}



// Display all reminders initially
displayReminders(savedReminders);



//---------------buttons--------------------

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
home.addEventListener('click', () => {
  console.log(' its working ');
  window.location.href = 'index.html';

});