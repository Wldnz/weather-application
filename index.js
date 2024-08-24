
const weather_week = 7;

let isWithHours = false;

const formWeather =  `<form>
        <h2>Weather Application</h2>
        <div class="header">
            <div class="menu"></div>
            <input type="search" class="search-weather" placeholder="Search Your Location">
            <div class="refresh"></div>
        </div>        
    </form>`;

const footer = `<footer>
        <p>Thank You For Using Weather Application</p>
    </footer>`;

const form = document.querySelector('form');
    form.addEventListener('submit',(e) => {
        e.preventDefault();
       const searchValue = e.target[0].value;

        if(!searchValue || searchValue.length <= 3){
            return
        }
        getResponseWeatherApp({location : searchValue, isOtherDay : false});

    })


const getResponseWeatherApp = (object) =>{
    console.log(object)
    // return
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${object.location}?unitGroup=metric&key=FVPCQLYWXFUNP4WE5F3TGDHCV&contentType=json`
    )

    .then(response => response.json())
    .then(resp => {

        console.log(resp);
        if(object.isOtherDay){
            const weatherDay = resp.days[object.indexDay]
            const data = otherDayWeather(weatherDay,resp.days,object.location)
            document.body.innerHTML = `${formWeather}${data}${footer}`;
            console.log(data)
        }else{
            let data = currentWeather(resp.currentConditions,resp.days,resp.resolvedAddress,resp.description)
            document.body.innerHTML = `${formWeather}${data}${footer}`;
        }
    })
}    

const otherInformation = ({precip,humidity,windspeed}) => {
    return `
    <div class="other-information">
        <div class="item">
            <img src="./img/precipitation.png">
            <p>${precip? precip : 0}%</p>
            <p>Precipitation</p>
        </div>
        
        <div class="item">
            <img src="./img/water.png">
            <p>${humidity}%</p>
            <p>Humidity</p>
        </div>
        
        <div class="item">
            <img src="./img/angin.png">
            <p>${windspeed}Km/h</p>
            <p>Wind Speed</p>
        </div>
    </div>
    `
}

const weatherWeekInformation = (days,location) =>{

    return days.filter((value,index) => index <= weather_week)
    .map((dayy,index) => {
        return `
                <div class="item" data-location="${location.split(',')[0]}" data-index="${index}" onclick=
                "
                const location = this.dataset.location;
                const day = this.dataset.index
                getResponseWeatherApp(
                 {
                    location,
                    isOtherDay : true,
                    indexDay : day
                 }
                )
                "
                >
                    <p>${dayy.datetime}</p>
                    <img src="./img/mendung-terang.png">
                    <p>${dayy.temp}</p>
                </div>`
    }).join('')
}

function otherDayWeather(currentData,days,location){
    return ` <div class="today-weather">
        <h2>${location}</h2>
        <p>${currentData.conditions}</p>
        <img src="./img/mendung-terang.png" alt="">
        <h2>${currentData.temp}</h2>
        <p class="description">${currentData.description}</p>
        <p class="date">${currentData.datetime}</p>
    </div>
    
    ${otherInformation(currentData)}

    <div class="weather-week">
        <p>Weeks</p>
         <div class="wrapper">
            ${weatherWeekInformation(days,location)}
        </div>
    </div>
    `
}


function currentWeather(currentData,days,location,description){
    return `  <div class="today-weather">
        <h2>${location}</h2>
        <p>${currentData.conditions}</p>
        <img src="./img/mendung-terang.png" alt="">
        <h2>${currentData.temp}</h2>
        <p class="description">${description}</p>
        <p class="date">${days[0].datetime}|${currentData.datetime}</p>
    </div>
    
   ${otherInformation(currentData)}

    <div class="weather-week">
        <p>Weeks</p>
         <div class="wrapper">
            ${weatherWeekInformation(days,location)}
        </div>
    </div>
    `
}
