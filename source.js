// openweather api key
const apikey = "12466639b3c314134dbf957c1305031c";

// getting html elements
const btn = document.querySelector("#btn-search");
const searchInput = document.querySelector(".search-input");
const weatherBox = document.querySelector("#weather");

// getting weather condition by current position
async function getWeatherCurrentPosition(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`,
    );
    if (!response.ok) throw new Error("Location not found!");

    const currentData = await response.json();
    return currentData;
  } catch (err) {
    console.log(err.message);
  }
}

// getting province name
async function getLocationDetails(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apikey}`,
    );

    if (!response.ok) throw new Error(" Province not found");

    const data = await response.json();
    // split kabul from province
    return data[0].state.split(" ")[0];
  } catch (err) {
    console.log(err.message);
  }
}

// getting weather by current location
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const weatherData = await getWeatherCurrentPosition(lat, lon);
    const province = await getLocationDetails(lat, lon);

    const { id, main } = weatherData.weather[0];
    const { temp, feels_like, humidity } = weatherData.main;
    const wind = weatherData.wind.speed;
    const cityName = province;

    showData(id, main, temp, feels_like, humidity, wind, cityName);
  },
  (error) => {
    console.log("Location access denied");
  },
);

// get data by searched Location
btn.addEventListener("click", getWeather);

async function getWeather() {
  const city = searchInput.value.trim();

  if (city == "") {
    weatherBox.innerHTML = `<p class='text-red-600'>Please Enter the city name</p>`;
  } else {
    btn.textContent = "loading...";
    btn.classList.add("bg-gray-200", "text-black");

    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`,
      );

      if (!resp.ok) {
        throw new Error("City not Found");
      }

      const data = await resp.json();

      const { id, main } = data.weather[0];
      const { temp, feels_like, humidity } = data.main;
      const wind = data.wind.speed;
      const cityName = data.name;

      // calling show data function to show data after clicking the search button
      showData(id, main, temp, feels_like, humidity, wind, cityName);
    } catch (err) {
      weatherBox.textContent = err.message;
    } finally {
      btn.textContent = "Search";
      btn.classList.remove("bg-gray-200", "text-black");
    }
  }
}

// show data on page function

function showData(id, main, temp, feels_like, humidity, wind, cityName) {
  let icon;
  console.log(cityName);
  if (id == 800) {
    icon = "https://openweathermap.org/img/wn/01d.png";
  } else if (id >= 200 && id <= 50) {
    icon = 1127;
  } else if (id >= 300 && id <= 350) {
    icon = "https://openweathermap.org/img/wn/11d.png";
  } else if (id >= 500 && id <= 550) {
    icon = "https://openweathermap.org/img/wn/09d.png";
  } else if (id >= 600 && id <= 650) {
    icon = "https://openweathermap.org/img/wn/13d.png";
  } else if (id >= 700 && id <= 750) {
    icon = "https://openweathermap.org/img/wn/50d.png";
  } else if (id >= 801 && id <= 805) {
    icon = "https://openweathermap.org/img/wn/04d.png";
  }
  weatherBox.innerHTML = ` <p class=' text-center text-3xl col-span-2 mb-4'>${cityName}</p>
    <section class='weather'>
      <div class='flex text-4xl '>
        <p>${Math.round(temp)}&deg;</p>
        <img src=${icon}>
      </div>
      <p>Feels Like ${Math.round(feels_like)}&deg;</p>
    </section>
    <section class='details'>
      <p> ${main}</p>
      <p>Humidity: ${humidity}</p>
      <p>wind: ${Math.round(wind)}</p>
    </section>
      
      
      `;
}

