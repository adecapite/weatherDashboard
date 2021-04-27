
function startApp()
{
    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");4
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const APIKey = "251145448f9253cdd071ca904b1dd199"
    const historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);

function getWeather(cityName) {
    // Uses the saved city name, combines it with the API to retrieve the information from OpenWeather
            let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
            fetch(queryURL)
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                console.log(response);

                //Gathers information for today's date
                const currentDate = new Date(response.dt*1000);
                console.log(currentDate);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
                //sets the icon for the weather conditions ie. rainy, sunny, cloudy
                let weatherPic = response.weather[0].icon;
                currentPicEl.setAttribute("src",  "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt",response.weather[0].description);
                //Formats how the information will be displayed place the right symbols (percentage sign, MPH for windspeed)
                currentTempEl.innerHTML = "Temperature: " + response.main.temp + " F";
                currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
            //variables for latitude and longitude, then uses that informaiton to get the UV index and then appened to the weather forecasr
                let lat = response.coord.lat;
            let lon = response.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
            .then(function(response){
                let UVIndex = document.createElement("span");
                UVIndex.setAttribute("class","badge badge-danger");
                UVIndex.innerHTML = response.data[0].value;
                currentUVEl.innerHTML = "UV Index: ";
                currentUVEl.append(UVIndex);
            });
    //Uses the saved city infromation to retieve info
            let cityID = response.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            axios.get(forecastQueryURL)
            .then(function(response){
    //  Parse response to display forecast for next 5 days underneath current conditions
                console.log(response);
                const forecastEls = document.querySelectorAll(".forecast");
                for (i=0; i<forecastEls.length; i++) {
                    forecastEls[i].innerHTML = "";
                    const forecastIndex = i*8 + 4;
                    const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    forecastEls[i].append(forecastDateEl);
                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt",response.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
                    forecastEls[i].append(forecastHumidityEl);
                    }
                })
            });  
        }
    //Search button. Start function to retrieve info from OpenWeather, and then stores the searched city into local storage as SearchHistory
        searchEl.addEventListener("click",function() {
            const searchTerm = inputEl.value;
            getWeather(searchTerm);
            searchHistory.push(searchTerm);
            localStorage.setItem("search",JSON.stringify(searchHistory));
            renderSearchHistory();
        })
    //button to clear recent search history
        clearEl.addEventListener("click",function() {
            searchHistory = [];
            renderSearchHistory();
        })
    
        function k2f(K) {
            return Math.floor((K - 273.15) *1.8 +32);
        }
        //Takes the recent cities searched for, takes them from local storage and appends them on a created list.
        function renderSearchHistory() {
            historyEl.innerHTML = "";
            for (let i=0; i<searchHistory.length; i++) {
                const historyItem = document.createElement("input");
                
                historyItem.setAttribute("type","text");
                historyItem.setAttribute("readonly",true);
                historyItem.setAttribute("class", "form-control d-block bg-white");
                historyItem.setAttribute("value", searchHistory[i]);
                historyItem.addEventListener("click",function() {
                    getWeather(historyItem.value);
                })
                historyEl.append(historyItem);
            }
        }
    
        renderSearchHistory();
        if (searchHistory.length > 0) {
            getWeather(searchHistory[searchHistory.length - 1]);
        }
    
    
   
    
    }
    startApp();


