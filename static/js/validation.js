document.getElementById('reservationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission for validation

  // Clear previous error messages
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';

  // Get form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  // Validation
  if (name === '') {
    errorMessage.textContent = 'Name is required.';
    return;
  }

  if (!/^[a-zA-Z ]+$/.test(name)) {
    errorMessage.textContent = 'Name can only contain letters and spaces.';
    return;
  }

  if (email === '') {
    errorMessage.textContent = 'Email is required.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMessage.textContent = 'Please provide a valid email address.';
    return;
  }

  if (date === '') {
    errorMessage.textContent = 'Reservation date is required.';
    return;
  }

  const currentDate = new Date();
  const selectedDate = new Date(date);
  const threeMonthsAhead = new Date();
  threeMonthsAhead.setMonth(currentDate.getMonth() + 3);

  if (selectedDate < currentDate) {
    errorMessage.textContent = 'Reservation date cannot be in the past.';
    return;
  }

  if (selectedDate > threeMonthsAhead) {
    errorMessage.textContent = 'Reservation date cannot be more than 3 months into the future.';
    return;
  }

  if (time === '') {
    errorMessage.textContent = 'Reservation time is required.';
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (hours < 15 || hours > 22 || (hours === 22 && minutes > 0)) {
    errorMessage.textContent = 'Reservation time must be between 3 PM and 10 PM.';
    return;
  }

  // All validations passed
  alert('Reservation submitted successfully!');
  document.getElementById('reservationForm').reset();
});
