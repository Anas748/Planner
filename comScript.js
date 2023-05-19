const allButton = document.getElementById('all-button');
const upcomingButton = document.getElementById('upcoming-button');
const flaggedButton = document.getElementById('flagged-button');
const home = document.getElementById('return-button');
//----------------------------------------------
// Access the `comp-task` div element
const compTaskDiv = document.getElementById('comp-task');

// Retrieve all completed reminders from local storage
const completedRemindersJSON = localStorage.getItem('completedReminders');
let completedReminders = [];

if (completedRemindersJSON) {
  try {
    // Parse the completed reminders from the JSON string
    completedReminders = JSON.parse(completedRemindersJSON);

    // Generate the HTML for each completed reminder
    const reminderHTML = completedReminders.map(reminder => `
      <div class="completed-task">
        <p><strong>Date:</strong> ${reminder.date}</p>
        <p><strong>Notes:</strong> ${reminder.notes}</p>
        <p><strong>Files:</strong></p>
        <ul>
          ${generateFileList(reminder.files)}
        </ul>
      </div>
    `).join('');

    // Set the HTML content of the `comp-task` div to the generated reminder HTML
    compTaskDiv.innerHTML = reminderHTML;
  } catch (error) {
    // Error occurred while parsing the completed reminders JSON
    console.error('Error occurred while parsing the completed reminders:', error);
  }
} else {
  // No completed reminders found
  console.log('No completed reminders found.');
}

// Function to generate the file list HTML
function generateFileList(files) {
  let fileListHTML = '';
  files.forEach(file => {
    fileListHTML += `<li>${file}</li>`;
  });
  return fileListHTML;
}


//----------------------------------------------
home.addEventListener('click', () => {
    console.log(' its working ');
    window.location.href = 'index.html';

});
allButton.addEventListener('click', () => {
    console.log(' its working ');
    window.location.href = 'all.html';

});

upcomingButton.addEventListener('click', () => {
    window.location.href = 'up.html';
    console.log('Show upcoming reminders');
});

flaggedButton.addEventListener('click', () => {
    window.location.href = 'flag.html';
});