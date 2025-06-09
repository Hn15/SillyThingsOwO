// Title hover effect
const title = document.getElementById("titleText");
title.addEventListener("mouseenter", () => {
  title.innerText = "OwO >w<";
});
title.addEventListener("mouseleave", () => {
  title.innerText = "Silly Thing :3";
});

function showPopupNotice(message) {
  const popup = document.getElementById('popupNotice');
  popup.textContent = message;
  popup.classList.add('show');
  setTimeout(() => {
    popup.classList.remove('show');
  }, 2200);
}

// Greetings
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
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('paused');
  document.getElementById('blurOverlay').style.display = 'flex';
  document.getElementById('nameInput').focus();
});

document.getElementById('submitName').onclick = () => {
  const name = document.getElementById('nameInput').value.trim();
  if (name) {
    document.getElementById('githubUser').textContent = name;
    document.getElementById('welcome').childNodes[0].nodeValue = getGreeting() + " ";
    document.getElementById('blurOverlay').style.display = 'none';
    document.body.classList.remove('paused');
  } else {
    alert('Please enter your name!');
  }
};

document.getElementById('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('submitName').click();
});

// Footer toggle logic
const footerBox = document.getElementById('footerBox');
const footerBar = document.getElementById('footerBar');

footerBar.onclick = () => {
  footerBox.classList.toggle('footer--collapsed');
};

// Weather logic
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
        const tempF = Math.round((tempC * 9 / 5 + 32) * 10) / 10;
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

document.addEventListener('DOMContentLoaded', () => {
  const weatherDiv = document.getElementById('weather');
  weatherDiv.addEventListener('click', () => {
    if (lastWeather.tempC !== null) {
      lastWeather.unit = lastWeather.unit === "C" ? "F" : "C";
      updateWeatherDisplay();
    }
  });
});

function getWeatherText(code) {
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

// Hide dev-box on page load
window.addEventListener('DOMContentLoaded', () => {
  const devBox = document.querySelector('.dev-box');
  devBox.style.display = 'none';
});

// Toggle dev-box visibility on Credits button click
document.getElementById('credits').addEventListener('click', () => {
  const devBox = document.querySelector('.dev-box');
  devBox.style.display = devBox.style.display === 'none' ? 'block' : 'none';
});

// Make dev-header draggable
const devBox = document.querySelector('.dev-box');
const devHeader = document.getElementById('devHeader');
let isDragging = false;
let offsetX, offsetY;

// Center the box initially
function centerBox() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const boxWidth = devBox.offsetWidth;
  const boxHeight = devBox.offsetHeight;

  devBox.style.left = `${(viewportWidth - boxWidth) / 2}px`;
  devBox.style.top = `${(viewportHeight - boxHeight) / 2}px`;
}

// Call centerBox on page load
window.onload = centerBox;

devHeader.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - devBox.offsetLeft;
  offsetY = e.clientY - devBox.offsetTop;
  devHeader.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Constrain within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const boxWidth = devBox.offsetWidth;
    const boxHeight = devBox.offsetHeight;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + boxWidth > viewportWidth) newLeft = viewportWidth - boxWidth;
    if (newTop + boxHeight > viewportHeight) newTop = viewportHeight - boxHeight;

    devBox.style.left = `${newLeft}px`;
    devBox.style.top = `${newTop}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  devHeader.style.cursor = 'grab';
});

// Close dev-box on close button click
document.getElementById('closeDevBox').addEventListener('click', () => {
  devBox.style.display = 'none';
});

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
});

let locationGranted = false;
let nameEntered = false;

function tryEnterMainPage() {
  if (locationGranted && nameEntered) {
    // Your code to enter the main page here
    document.getElementById('githubUser').textContent = document.getElementById('nameInput').value.trim();
    document.getElementById('welcome').childNodes[0].nodeValue = getGreeting() + " ";
    document.getElementById('blurOverlay').style.display = 'none';
    document.body.classList.remove('paused');
  }
}

// When location prompt is answered (granted or denied)
navigator.geolocation.getCurrentPosition(
  (pos) => {
    locationGranted = true;
    tryEnterMainPage();
  },
  (err) => {
    locationGranted = true; // Also allow if denied
    tryEnterMainPage();
  }
);

// When user submits name
document.getElementById('submitName').onclick = () => {
  const name = document.getElementById('nameInput').value.trim();
  if (name) {
    nameEntered = true;
    tryEnterMainPage();
  } else {
    alert('Please enter your name!');
  }
};

document.getElementById('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('submitName').click();
});