// Get references to buttons and elements
const locationBtn = document.getElementById('location-btn');
const shareLocationBtn = document.getElementById('share-location-btn');
const locationInfo = document.getElementById('location-info');
const submitFeedback = document.getElementById('submit-feedback');
const feedbackInput = document.getElementById('feedback-input');
const mapElement = document.getElementById('map');
const doctorsBtn = document.getElementById('doctors-btn');
const firstAidBtn = document.getElementById('first-aid-btn');
const firstAidModal = document.getElementById('first-aid-modal');
const closeModal = document.getElementById('close-modal');
const firstAidInfo = document.getElementById('first-aid-info');
const sosBtn = document.getElementById('sos-btn');
const sosModal = document.getElementById('sos-modal');
const closeSosModal = document.getElementById('close-sos-modal');
const sosMessagesList = document.getElementById('sos-messages-list');

// Initialize map
const map = L.map(mapElement).setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let latitude, longitude;

// Predefined list of doctors with location (latitude, longitude)
const predefinedDoctors = [
    { name: "Dr. Aravind Kumar", specialization: "Cardiologist", location: { lat: 12.9716, lng: 77.5946 } },
    { name: "Dr. Lakshmi Priya", specialization: "Dermatologist", location: { lat: 13.0827, lng: 80.2707 } },
    { name: "Dr. Ramanathan", specialization: "Pediatrician", location: { lat: 19.0760, lng: 72.8777 } },
    { name: "Dr. Meena Devi", specialization: "Orthopedic Surgeon", location: { lat: 28.7041, lng: 77.1025 } },
    { name: "Dr. Karthik Nair", specialization: "Neurologist", location: { lat: 17.3850, lng: 78.4867 } },
    { name: "Dr. Kavitha Suresh", specialization: "General Practitioner", location: { lat: 22.5726, lng: 88.3639 } },
    { name: "Dr. Venkatesh R", specialization: "Psychiatrist", location: { lat: 12.2958, lng: 76.6394 } }
];

// First Aid Tips Array
const firstAidTips = [
    "If someone is bleeding heavily, apply pressure with a clean cloth to stop the bleeding.",
    "For burns, cool the affected area with cold, running water for at least 10 minutes.",
    "If someone is choking, perform the Heimlich maneuver if trained to do so.",
    "For minor cuts and scrapes, clean the wound and apply an antiseptic and bandage.",
    "In case of sprains, rest and elevate the injured area, and apply a cold pack to reduce swelling.",
    "If someone is having a heart attack, call emergency services immediately and assist them in taking any prescribed heart medication if available."
];

// Function to get user location
locationBtn.addEventListener('click', getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
    } else {
        locationInfo.textContent = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    locationInfo.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    
    map.setView([latitude, longitude], 13);

    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationInfo.textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationInfo.textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            locationInfo.textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            locationInfo.textContent = "An unknown error occurred.";
            break;
    }
}

// Function to share the location via SMS
shareLocationBtn.addEventListener('click', function () {
    if (latitude && longitude) {
        const message = `I need help! Here is my location: Latitude: ${latitude}, Longitude: ${longitude}`;
        const phoneNumber = '9989402587'; // Replace with the desired SMS number
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        window.open(smsUrl, '_blank');
    } else {
        alert('Please get your location first.');
    }
});

// Function to submit feedback
submitFeedback.addEventListener('click', function () {
    const feedback = feedbackInput.value.trim();
    if (feedback) {
        alert("Thank you for your feedback!");
        feedbackInput.value = '';
    } else {
        alert("Please enter your feedback before submitting.");
    }
});

// Function to search for doctors (display all predefined doctors)
doctorsBtn.addEventListener('click', function () {
    displayDoctors(predefinedDoctors);
});

// Function to display doctors on the map
function displayDoctors(doctors) {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (doctors.length > 0) {
        doctors.forEach(doctor => {
            L.marker([doctor.location.lat, doctor.location.lng])
                .addTo(map)
                .bindPopup(`${doctor.name} - ${doctor.specialization}`)
                .openPopup();
        });
    } else {
        alert('No doctors found.');
    }
}

// Open First Aid Modal and Display Tips
firstAidBtn.addEventListener('click', function () {
    firstAidModal.style.display = "block";
    firstAidModal.setAttribute('aria-hidden', 'false');
    firstAidInfo.innerHTML = '';

    firstAidTips.forEach((tip, index) => {
        const tipElement = document.createElement('p');
        tipElement.textContent = `${index + 1}. ${tip}`;
        firstAidInfo.appendChild(tipElement);
    });
});

// Close First Aid Modal
closeModal.addEventListener('click', function () {
    firstAidModal.style.display = "none";
    firstAidModal.setAttribute('aria-hidden', 'true');
});

// Open SOS Modal
sosBtn.addEventListener('click', function () {
    sosModal.style.display = "block";
    sosModal.setAttribute('aria-hidden', 'false');
    sosMessagesList.innerHTML = '';

    const messages = [
        "Help! I'm in danger!",
        "I need medical assistance!",
        "Please send help immediately!",
        "I've had an accident!",
        "Emergency! Call 911!"
    ];
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        li.tabIndex = 0;
        li.addEventListener('click', () => sendSosMessage(msg));
        li.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                sendSosMessage(msg);
            }
        });
        sosMessagesList.appendChild(li);
    });
});

// Function to send SOS message via SMS
function sendSosMessage(message) {
    const emergencyPhoneNumber = '9989402587'; // Replace with actual emergency contact number
    const smsUrl = `sms:${emergencyPhoneNumber}?body=${encodeURIComponent(message)}%0AMy location: Latitude: ${latitude}, Longitude: ${longitude}`;
    window.open(smsUrl, '_blank');

    sosModal.style.display = "none";
    sosModal.setAttribute('aria-hidden', 'true');
}

// Close SOS Modal
closeSosModal.addEventListener('click', function () {
    sosModal.style.display = "none";
    sosModal.setAttribute('aria-hidden', 'true');
});

// Close modals with the Escape key
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (firstAidModal.style.display === "block") {
            firstAidModal.style.display = "none";
            firstAidModal.setAttribute('aria-hidden', 'true');
            firstAidBtn.focus();
        }
        if (sosModal.style.display === "block") {
            sosModal.style.display = "none";
            sosModal.setAttribute('aria-hidden', 'true');
            sosBtn.focus();
        }
    }
});

// Close modals by clicking outside modal content
window.addEventListener('click', function (event) {
    if (event.target === sosModal) {
        sosModal.style.display = "none";
        sosModal.setAttribute('aria-hidden', 'true');
    }
    if (event.target === firstAidModal) {
        firstAidModal.style.display = "none";
        firstAidModal.setAttribute('aria-hidden', 'true');
    }
});
