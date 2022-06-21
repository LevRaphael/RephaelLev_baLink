const API_KEY = '6b60169c0fabcc76f28dc05382c0ca61';
const BASE_URL_WEATHER = 'https://api.openweathermap.org/data/2.5/onecall';
const BASE_URL_GEOLOCALISATION = 'https://api.openweathermap.org/geo/1.0/direct';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let element;
 
getGeolocalisation();

function getGeolocalisation(){
    let city = document.querySelector('#cities-select').value;
    document.getElementById("city").innerHTML = city;    
    fetch(`${BASE_URL_GEOLOCALISATION}?q=${city}&APPID=${API_KEY}`)  
        .then(function(resp) {
            return resp.json() 
        })
        .then(function(data) {
            displayNameCity(data[0].local_names);
            getWeatherForecast(data[0].lat, data[0].lon);
        })
        .catch(function() {
            alert('ERREUR');
        });
}

function localTimeInformation(data) {
    console.log('current data', data);
    let localTime = new Date().toLocaleTimeString('en-US', { timeZone: `${data.timezone}`, hour: '2-digit', minute:'2-digit'});
    let localsunrise = new Date(data.current.sunrise*1000).toLocaleTimeString('en-US', { timeZone: `${data.timezone}`, hour: '2-digit', minute:'2-digit'});
    let localSunset = new Date(data.current.sunset*1000).toLocaleTimeString('en-US', { timeZone: `${data.timezone}`, hour: '2-digit', minute:'2-digit'});
    let html = '';
    let htmlSegment = `<div class="time">Time: ${localTime}</div>
                        <div class="sunrise">Sunrise: ${localsunrise}</div>
                        <div class="sunset">Sunset: ${localSunset}</div>`;
    html += htmlSegment;
    let container = document.querySelector('.local-time-information');
    container.innerHTML = html;
}

function displayNameCity(localName) {
    let language =  document.querySelector('#languages-select').value;
    if(language ==='he'){
        document.getElementById("city").innerHTML = localName.he;    
    }
    else {
        document.getElementById("city").innerHTML = localName.en;    
    }
}

function getWeatherForecast(latitude, longitude) {
    let language =  document.querySelector('#languages-select').value;
    fetch(`${BASE_URL_WEATHER}?lat=${latitude}&lon=${longitude}&units=metric&lang=${language}&APPID=${API_KEY}`)  
        .then(function(resp) {
            return resp.json() 
        })
        .then(function(data) {
            localTimeInformation(data)
            drawWeather(data);
        })
        .catch(function() {
            alert('ERREUR');
        });
}

function drawWeatherOneDay(index) {
    document.getElementById('btnBack').style.display = "block" ;
    element =Array.from(document.getElementsByClassName('weather')).forEach((button, idx) => {
        button.style.display = 'none';
        if (index === idx) {
            button.style.display = 'block';
        }
    });
}

function backHP() {
    document.getElementById('btnBack').style.display = "none" ;
    Array.from(document.getElementsByClassName('weather')).forEach(weather_item => {
        weather_item.style.display = 'block';
    });
}

function formatDate(date, index) {
    if (index === 0 ) {
        return 'Today'
    }
    if(index === 1) {
        return "Tomorrow"
    }
    let time = new Date(date*1000);
    let day = time.getDay();
    let dayName = days[day];
    let dateDay =  time.getDate();
    let month = time.getMonth();
    let monthName = months[month];
    return `${dayName} ${dateDay} ${monthName}`
}

function drawWeather(data) {
    let html = '';
    data.daily.forEach((WeatherData, index) => {
    if(index < 5) {
        let dateFormat = formatDate(WeatherData.dt, index)
        let htmlSegment = `<div class="weather" onclick="drawWeatherOneDay(${index})">
                                <div class="weather-item">
                                    <div id="date">
                                         ${dateFormat}
                                    </div>
                                </div>
                                <div class="weather-item">
                                    <div id="icon">
                                        <img id="wicon" src="http://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@2x.png" alt="Weather icon">
                                    </div>
                                </div>
                                <div class="weather-item">
                                    <div id="description">
                                        ${WeatherData.weather[0].description}
                                    </div>
                                </div>
                                <div class="weather-item">
                                    <div id="max_temp">
                                        Max 
                                        ${WeatherData.temp.max} C
                                    </div>
                                </div>
                                <div class="weather-item">
                                    <div id="min_temp">
                                        Min 
                                        ${WeatherData.temp.min} C
                                    </div>
                                </div>
                                <div class="weather-item">
                                <div id="visibility">
                                    <div class="title-item">Visibility</div>
                                    ${(data.current.visibility) / 1000} km
                                </div>
                            </div>
                                <div class="weather-item">
                                    <div id="humidity">
                                        <div class="title-item">Humidity</div>
                                        ${WeatherData.humidity} %
                                    </div>
                                </div>
                                <div class="weather-item">
                                        <div id="Pressure">
                                        <div class="title-item">Pressure</div>
                                        ${WeatherData.pressure}mb
                                    </div>
                                </div>
                        </div>`;
        html += htmlSegment;
    }
    });
    
    let container = document.querySelector('.container-weather');
    container.innerHTML = html;

}
