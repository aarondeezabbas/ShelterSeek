// Initialize the map inside the "map" div
var map = L.map('map').setView([51.505, -0.09], 13);

// Set up the map tiles (using OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("weather-info").innerText = "Geolocation is not supported by this browser.";
    }
}

// Function to display the map based on current location
function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    map.setView([lat, lon], 13);
    L.marker([lat, lon]).addTo(map)
        .bindPopup("You are here.")
        .openPopup();
    getWeather(lat, lon);
}

// Handle errors in geolocation
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("weather-info").innerText = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("weather-info").innerText = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("weather-info").innerText = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("weather-info").innerText = "An unknown error occurred.";
            break;
    }
}

// Fetch weather data from an API (example uses OpenWeatherMap)
function getWeather(lat, lon) {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("weather-info").innerHTML = `
                <b>Weather:</b> ${data.weather[0].description} <br>
                <b>Temperature:</b> ${data.main.temp} °C <br>
                <b>Humidity:</b> ${data.main.humidity}% <br>
                <b>Wind Speed:</b> ${data.wind.speed} m/s
            `;
        })
        .catch(error => {
            document.getElementById("weather-info").innerText = "Unable to fetch weather data.";
        });
}

// Function to handle the search button click
document.getElementById('search-btn').addEventListener('click', () => {
    const locationInput = document.getElementById('location-input').value;
    if (locationInput) {
        // Geocode the input location (for example, using Nominatim API)
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${locationInput}&format=json&limit=1`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    map.setView([lat, lon], 13);
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`Location: ${locationInput}`)
                        .openPopup();
                    getWeather(lat, lon);
                } else {
                    document.getElementById("weather-info").innerText = "Location not found.";
                }
            })
            .catch(error => {
                document.getElementById("weather-info").innerText = "Error fetching location data.";
            });
    } else {
        getLocation();
    }
});

// Automatically get user's location on page load
window.onload = function () {
    getLocation();
};

// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to handle searching
function searchLocation(query) {
    // Use Nominatim API to get coordinates from the city name
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                // Update the map to the searched location
                map.setView([lat, lon], 13);

                // Add marker to the searched location
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`You searched for: ${query}`)
                    .openPopup();
            } else {
                alert("Location not found. Please try again.");
            }
        })
        .catch(error => console.log('Error:', error));
}

// Handle the search button click
document.getElementById('search-btn').addEventListener('click', function () {
    const query = document.getElementById('location-input').value;
    if (query) {
        searchLocation(query);
    } else {
        alert("Please enter a location.");
    }
});
