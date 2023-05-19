const home = document.getElementById('return-button');
const allButton = document.getElementById('all-button');
const completedButton = document.getElementById('completed-button');
const upcomingButton = document.getElementById('upcoming-button');
// ----------------------------------------
const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
const flagTaskContainer = document.querySelector('.flag-task');

flagTaskContainer.innerHTML = '';

const flaggedReminders = savedReminders.filter(reminder => reminder.flagged);

flaggedReminders.forEach((reminder, index) => {
  const reminderElement = document.createElement('div');
  reminderElement.classList.add('reminder-item');
  reminderElement.innerHTML = `
      <p><strong>Date:</strong> ${reminder.date}</p>
      <p><strong>Notes:</strong> ${reminder.notes}</p>
    `;

  reminderElement.addEventListener('click', () => {
    showReminderDetails(reminder);
  });

  flagTaskContainer.appendChild(reminderElement);
});

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

upcomingButton.addEventListener('click', () => {
  window.location.href = 'up.html';
  console.log('Show upcoming reminders');
});