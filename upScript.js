const allButton = document.getElementById('all-button');
const completedButton = document.getElementById('completed-button');
const flaggedButton = document.getElementById('flagged-button');
const home = document.getElementById('return-button');
//-----------------------------------------------------
const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
const upTaskContainer = document.querySelector('.up-task');

// Clear the existing content
upTaskContainer.innerHTML = '';

// Get the current date
const currentDate = new Date();

// Function to check if a reminder's date has passed
function isDatePassed(date) {
  const reminderDate = new Date(date);
  return reminderDate < currentDate; // Check if reminder date is less than the current date
}

// Filter the saved reminders for upcoming reminders
const upcomingReminders = savedReminders.filter(reminder => {
  const reminderDate = new Date(reminder.date);
  return reminderDate >= currentDate;
});

// Generate the HTML for each upcoming reminder
upcomingReminders.forEach(reminder => {
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

  upTaskContainer.appendChild(reminderElement);
});

// Remove reminders from the upcoming list when their date has passed
const reminderItems = upTaskContainer.querySelectorAll('.reminder-item');
reminderItems.forEach(reminderItem => {
  const reminderDate = reminderItem.querySelector('p:first-child').textContent.replace('Date:', '').trim();
  if (isDatePassed(reminderDate)) {
    reminderItem.remove(); // Remove the reminder item from the DOM
  }
});



//----------------------------------------------
home.addEventListener('click', () => {
  console.log(' its working ');
  window.location.href = 'index.html';

});
allButton.addEventListener('click', () => {
  console.log(' its working ');
  window.location.href = 'all.html';
  
});
completedButton.addEventListener('click', () => {
  window.location.href = 'com.html';
});
flaggedButton.addEventListener('click', () => {
  window.location.href = 'flag.html';
});