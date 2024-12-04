document.addEventListener('DOMContentLoaded', function () {
    const reservationForm = document.getElementById('reservation-form');

    reservationForm.addEventListener('submit', function (event) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;

        const errors = [];

        // Validate name (only letters and spaces)
        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(name)) {
            errors.push("Name should only contain letters and spaces.");
        }

        // Validate email
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            errors.push("Please enter a valid email address.");
        }

        // Validate date
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ensure time is ignored in date comparison
        const maxDate = new Date();
        maxDate.setMonth(today.getMonth() + 3); // Three months into the future

        if (isNaN(selectedDate.getTime())) {
            errors.push("Please select a valid date.");
        } else if (selectedDate < today) {
            errors.push("Date cannot be in the past.");
        } else if (selectedDate > maxDate) {
            errors.push("Date cannot be more than three months from today.");
        }

        // Validate time (3:00 PM to 10:00 PM)
        const timePattern = /^([0-9]{2}):([0-9]{2})$/;
        const [hours, minutes] = timePattern.test(time)
            ? time.split(":").map((t) => parseInt(t, 10))
            : [-1, -1];

        if (hours < 15 || hours > 22 || (hours === 22 && minutes > 0)) {
            errors.push("Time must be between 3:00 PM and 10:00 PM.");
        }

        // Validate guests
        if (isNaN(guests) || guests <= 0) {
            errors.push("Please enter a valid number of guests.");
        }

        // If there are errors, prevent form submission and show them
        if (errors.length > 0) {
            event.preventDefault();
            alert(errors.join("\n"));
        }
    });
});
