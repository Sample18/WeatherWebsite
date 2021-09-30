const temp = document.querySelector('.temp');
const sity = document.querySelector('.sity');
const date = document.querySelector('.date');
const weather_img = document.querySelector('.weather_image');
const weather_description = document.querySelector('.weather_description');
const cloudy = document.querySelector('.cloudy');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const rain = document.querySelector('.rain');
const search_btn = document.querySelector('.search_btn');
const search_inp = document.querySelector('.search_inp');
const sity_location = document.querySelector('.sity_location')
const locations = document.querySelectorAll('.location')
const main = document.querySelector('.main_bg')

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const imagesObj = {
  "Clear" : "images/clear.jpg",
  "Sunny" : "images/sunny.jpg",
  "Partly cloudy" : "images/partly_cloudy.jpg",
  "Cloudy" : "images/cloudy.jpg",
  "Overcast" : "Clear",
  "Mist" : "Clear",
  "Patchy rain possible" : "Clear",
  "Patchy snow possible" : "Clear",
  "Patchy sleet possible" : "Clear",
  "Patchy freezing drizzle possible" : "Clear",
  "Thundery outbreaks possible" : "Clear",
  "Blowing snow" : "Clear",
  "Blizzard" : "Clear",
  "Fog" : "Clear",
  "Patchy light drizzle" : "Clear",
  "Light drizzle" : "Clear",
  "Freezing drizzle" : "Clear",
  "Heavy freezing drizzle" : "Clear",
  "Patchy light rain" : "Clear",
  "Light rain" : "Clear",
  "Moderate rain" : "Clear",
  "Moderate rain at times" : "Clear",
  "Heavy rain at times" : "Clear",
  "Heavy rain" : "Clear",
  "Light freezing rain" : "Clear",
  "Moderate or heavy freezing rain" : "Clear",
  "Light sleet" : "Clear",
  "Moderate or heavy sleet" : "Clear",
  "Patchy light snow" : "Clear",
  "Light snow" : "Clear",
  "Patchy moderate snow" : "Clear",
  "Moderate snow" : "Clear",
  "Patchy heavy snow" : "Clear",
  "Heavy snow" : "Clear",
  "Ice pellets" : "Clear",
  "Light rain shower" : "Clear",
  "Moderate or heavy rain shower" : "Clear",
  "Torrential rain shower" : "Clear",
  "Light sleet showers" : "Clear",
  "Moderate or heavy sleet showers" : "Clear",
  "Moderate or heavy snow showers" : "Clear",
  "Light showers of ice pellets" : "Clear",
  "Moderate or heavy showers of ice pellets" : "Clear",
  "Patchy light rain with thunder" : "Clear",
  "Moderate or heavy rain with thunder" : "Clear",
  "Patchy light snow with thunder" : "Clear",
  "Moderate or heavy snow with thunder" : "Clear"
  }


window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(weatherApi, geoError);
  }
  else weatherRequest();

  localStorageToHTML()
})

search_inp.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    const url = `http://api.weatherapi.com/v1/current.json?key=fa7cfb3255884931a3f171335212608&q=${search_inp.value}&aqi=no`;
    weatherSearchRequest(url);
    toLocalStorage(search_inp.value)
    localStorageToHTML()
  }
});

search_btn.addEventListener('click', () => {
  const url = `http://api.weatherapi.com/v1/current.json?key=fa7cfb3255884931a3f171335212608&q=${search_inp.value}&aqi=no`;
  weatherSearchRequest(url);
  toLocalStorage(search_inp.value)
  localStorageToHTML()
})

sity_location.addEventListener('click', event => {
  if (event.target.classList.contains('location')) {
    console.log(event.target.innerHTML)
    const url = `http://api.weatherapi.com/v1/current.json?key=fa7cfb3255884931a3f171335212608&q=${event.target.innerHTML}&aqi=no`;
    weatherSearchRequest(url);
    toLocalStorage(event.target.innerHTML)
    localStorageToHTML()
  }
})

function weatherApi(position) {
  const lat = position.coords.latitude.toFixed(4);
  const lon = position.coords.longitude.toFixed(4);
  weatherRequest(lat, lon);
}

function geoError() {
  console.log('error geo');
  weatherRequest();
}

function weatherRequest (lat='51.52', lon='-0.11') {
  fetch(`https://api.weatherapi.com/v1/current.json?key=fa7cfb3255884931a3f171335212608&q=${lat},${lon}&aqi=no`)
    .then((response) => {
      const result = response.json();
      return result;
    })
    .then((data) => {
      dataToHTML(data);
    })
    .catch(() => {console.log('error fetch')})
}

function weatherSearchRequest(url) {
  fetch(url)
    .then((response) => {
      const result = response.json();
      return result;
  })
    .then((data) => {
      dataToHTML(data);
  })
    .catch(() => {console.log('error fetch')})
}

function dataToHTML (data) {
  temp.innerHTML = `${data.current.temp_c}&#176;`;
  sity.textContent = data.location.name;
  let user_date = new Date();
  date.innerHTML = `${user_date.getHours()}:${user_date.getMinutes()} - ${days[user_date.getDay()]}, ${user_date.getDate()} ${month[user_date.getMonth()]} ${user_date.getFullYear()}`;
  weather_img.src = data.current.condition.icon;
  weather_description.innerHTML = data.current.condition.text;
  cloudy.textContent = data.current.cloud;
  humidity.textContent = data.current.humidity;
  wind.textContent = data.current.wind_kph;
  rain.textContent = data.current.precip_mm;
  main.style.backgroundImage = `url("../${imagesObj[`${data.current.condition.text}`]}")`
}

function toLocalStorage(inputValue) {
  if (localStorage.getItem('myKey')) {
    const returnObj = JSON.parse(localStorage.getItem('myKey'))
    returnObj.sity.unshift(inputValue)
    if (returnObj.sity[0] === returnObj.sity[1]) {
      returnObj.sity.splice(1, 1)
    }
    if (returnObj.sity.length > 4) {
      returnObj.sity.pop()
    }
    const serialObj = JSON.stringify(returnObj)
    localStorage.setItem('myKey', serialObj)
  }
  else {
    let obj = {
      'sity': []
    }
    obj.sity.unshift(inputValue)
    const serialObj = JSON.stringify(obj)
    localStorage.setItem('myKey', serialObj)
  }
}

function localStorageToHTML() {
  if (sity_location.childNodes.length) {
    sity_location.textContent = ''
  }
  const returnObj = JSON.parse(localStorage.getItem('myKey'))
  for (let i = 0; i < returnObj.sity.length; i++) {
    const li = document.createElement('li')
    li.classList.add('location')
    li.innerHTML = `${returnObj.sity[i]}`
    sity_location.append(li)
  }
}

// function imagesToHTML(data) {
//   const value = data.current.condition.text
//   main.style.backgroundImage = `url("../${imagesObj[`${value}`]}")`
// }





// function getImage() {
//   fetch('C:\projects\WeatherWebsite\scripts\images.json', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then(response => {
//       const result = response.json();
//       return result
//     })
//     .then(data => {
//       console.log(data)
//     })
//     .catch(() => {console.log('error fetch')})
// }

// getImage()