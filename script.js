// Title hover effect
const title = document.getElementById("titleText");
title.addEventListener("mouseenter", () => {
  title.innerText = "OwO >w<";
});
title.addEventListener("mouseleave", () => {
  title.innerText = "Silly Thing :3";
});

//greetings
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function updateGreeting() {
  document.getElementById('welcome').childNodes[0].nodeValue = getGreeting() + " ";
}
setInterval(updateGreeting, 1000);

// Date & Time
function updateTime() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').innerText = `Today is ${now.toLocaleDateString('en-US', options)}`;
  document.getElementById('time').innerText = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Blur overlay logic for display name
window.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('paused');
  document.getElementById('blurOverlay').style.display = 'flex';
  document.getElementById('nameInput').focus();
});

document.getElementById('submitName').onclick = function() {
  const name = document.getElementById('nameInput').value.trim();
  if (name) {
    document.getElementById('githubUser').textContent = name;
    // Update greeting text before the name
    document.getElementById('welcome').childNodes[0].nodeValue = getGreeting() + " ";
    document.getElementById('blurOverlay').style.display = 'none';
    document.body.classList.remove('paused');
  } else {
    alert('Please enter your name!');
  }
};

document.getElementById('nameInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('submitName').click();
});

const footerBox = document.getElementById('footerBox');
const footerBar = document.getElementById('footerBar');

footerBar.onclick = function() {
  footerBox.classList.toggle('footer--collapsed');
};

let lastWeather = {
  tempC: null,
  tempF: null,
  desc: "",
  unit: "C"
};

function fetchWeatherDescription(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.current_weather) {
        const code = data.current_weather.weathercode;
        const tempC = data.current_weather.temperature;
        const tempF = Math.round((tempC * 9/5 + 32) * 10) / 10;
        const desc = getWeatherText(code);
        lastWeather = { tempC, tempF, desc, unit: "C" };
        updateWeatherDisplay();
      } else {
        document.getElementById('weather').innerText = "Weather: N/A";
      }
    })
    .catch(() => {
      document.getElementById('weather').innerText = "Weather: N/A";
    });
}

function updateWeatherDisplay() {
  const weatherDiv = document.getElementById('weather');
  if (lastWeather.unit === "C") {
    weatherDiv.innerText = `Looks like it's ${lastWeather.desc.toLowerCase()} outside, around ${lastWeather.tempC}°C`;
  } else {
    weatherDiv.innerText = `Looks like it's ${lastWeather.desc.toLowerCase()} outside, around ${lastWeather.tempF}°F`;
  }
}

// Add this to enable toggling on click
document.addEventListener('DOMContentLoaded', function() {
  const weatherDiv = document.getElementById('weather');
  weatherDiv.addEventListener('click', function() {
    if (lastWeather.tempC !== null) {
      lastWeather.unit = lastWeather.unit === "C" ? "F" : "C";
      updateWeatherDisplay();
    }
  });
});

function getWeatherText(code) {
  // Open-Meteo weather codes: https://open-meteo.com/en/docs
  if ([0, 1].includes(code)) return "Clear";
  if ([2, 3, 45, 48].includes(code)) return "Cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown weather";
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherDescription(pos.coords.latitude, pos.coords.longitude),
      () => { document.getElementById('weather').innerText = "Weather: N/A"; }
    );
  } else {
    document.getElementById('weather').innerText = "Weather: N/A";
  }
}

window.addEventListener('DOMContentLoaded', getLocationAndWeather);

// Spotify Now Playing
const clientId = '33fd410d12294658aea77898638c05a6'; // Your Spotify Client ID
const redirectUri = window.location.origin + window.location.pathname; // Must match Spotify app settings
const scopes = 'user-read-currently-playing user-read-playback-state';

function getSpotifyTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

function authorizeSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  window.location = authUrl;
}

function fetchSpotifyNowPlaying(token) {
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.status === 204 ? null : res.json())
    .then(data => {
      const spotifyDiv = document.getElementById('spotify');
      if (data && data.item) {
        spotifyDiv.innerText = `Listening to: ${data.item.name} by ${data.item.artists.map(a => a.name).join(', ')}`;
      } else {
        spotifyDiv.innerText = "Not listening to anything on Spotify.";
      }
    })
    .catch(() => {
      document.getElementById('spotify').innerText = "Spotify info unavailable.";
    });
}

// On page load
window.addEventListener('DOMContentLoaded', function() {
  const token = getSpotifyTokenFromUrl();
  const spotifyDiv = document.getElementById('spotify');
  if (!spotifyDiv) return; // If the div doesn't exist, do nothing

  if (!token) {
    // Show a login button if not authorized
    spotifyDiv.innerHTML = '<button id="spotifyLogin">Connect Spotify</button>';
    document.getElementById('spotifyLogin').onclick = authorizeSpotify;
  } else {
    // Fetch and show now playing
    fetchSpotifyNowPlaying(token);
    // Optionally refresh every 30 seconds
    setInterval(() => fetchSpotifyNowPlaying(token), 30000);
  }
});