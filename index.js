const usertab = document.querySelector("#data-userWeather")
const serchtab = document.querySelector("#data-searchWeather")
const userContainer = document.querySelector(".Weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const serchForm = document.querySelector('[data-searchForm]')
const loadingContainer = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")
const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

let currentTab = usertab;
const API_KEY = "555eeae4dc39a6e0b2671e7d47f32b30";
currentTab.classList.add("currentTab");
getFromSessionStorage();

// SWITCHING TAB

function switchTab(clickedTab) {
    
    if (currentTab != clickedTab) {
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");
        notFound.classList.remove("active");

        if (!serchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            
            serchForm.classList.add("active")

        } else {
            serchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")
            
            getFromSessionStorage();
        }
    }
}

usertab.addEventListener('click', () => {
    switchTab(usertab);
})

serchtab.addEventListener('click', () => {
    switchTab(serchtab);
})

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates")
    if (!localCoordinates) {
        grantAccessContainer.classList.add('active')
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWetherInfo(coordinates)
    }
}

async function fetchUserWetherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove('active')
    loadingContainer.classList.add('active')

    // API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }

        loadingContainer.classList.remove('active')
        userInfoContainer.classList.add('active')

        renderWetherInfo(data);
    }
    catch (err) {
        loadingContainer.classList.remove('active');
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchSearchWeatherInfo);
    }
}

function renderWetherInfo(weatherInfo) {
    const cityName = document.querySelector('[data-cityName]')
    const countryFlag = document.querySelector('[data-countryIcon]')
    const weatherIcon = document.querySelector('[data-weatherIcon]')
    const temp = document.querySelector('[data-temp]')
    const weatherDesc = document.querySelector('[data-weatherDesc]')
    const windspeed = document.querySelector('[data-windspeed]')
    const humidity = document.querySelector('[data-humidity]')
    const cloudiness = document.querySelector('[data-cloudiness]')
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`
    humidity.innerText = `${weatherInfo?.main?.humidity}%`
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`

}
const grantAccessBtn = document.querySelector('#grantAccess')

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates))
    fetchUserWetherInfo(userCoordinates)

}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        grantAccessBtn.style.display = 'none';
    }
}
grantAccessBtn.addEventListener('click', getLocation);


const searchInput = document.querySelector('[data-searchInput]');

serchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    } else
       
    fetchSearchWeatherInfo(cityName);
    searchInput.value = "";

})
async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingContainer.classList.remove("active")
        notFound.classList.remove("active");
        userInfoContainer.classList.add("active")
        renderWetherInfo(data)
    }
    catch (err) {
        loadingContainer.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";

    }
}









