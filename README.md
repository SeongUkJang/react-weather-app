React로 만든 날씨 앱입니다. 
사용자가 도시 이름을 입력하고, 해당 도시의 날씨 정보를 가져와서 화면에 보여주는 앱입니다. 

`fetchWeatherByCoords`와 `fetchCoordinates` 함수를 통해 OpenWeatherMap API에서 날씨와 좌표 데이터를 받아옵니다.

### 1. **`App.js`**

```jsx
import './App.css'
import WeatherCard from './components/WeatherCard'
import { useState } from 'react'
import {fetchWeatherByCoords} from './api/weather'
import {fetchCoordinates} from './api/geo'

function App() {
  const [city, setCity] = useState('') // 도시명을 저장하는 state
  const [weather, setWeather] = useState(null) // 날씨 정보를 저장하는 state

  // 입력값을 변경하는 함수
  const onChangeInput = (e) => {
    setCity(e.target.value) // 입력값을 city state에 저장
  }

  // Enter 키를 눌렀을 때 검색 함수 호출
  const onKeyupEnter = (e) => {
    if (e.keyCode === 13) {
      handleSearch() // Enter 키가 눌리면 handleSearch 함수 실행
    }
  }

  // 검색 버튼을 클릭했을 때 호출되는 함수
  const handleSearch = async () => {
    if (!city) return // 입력된 도시명이 없으면 아무것도 하지 않음

    try {
      // 입력된 도시명을 바탕으로 좌표(latitude, longitude) 정보를 가져옴
      const { lat, lon, name, country } = await fetchCoordinates(city)

      // 가져온 좌표로 날씨 정보를 가져옴
      const data = await fetchWeatherByCoords(lat, lon)

      // 날씨 정보를 state에 저장
      setWeather(data)
      setCity('') // 도시명 입력란을 초기화

    } catch (error) {
      console.error(error)
      alert('도시를 찾을 수 없어요') // 오류가 발생하면 경고 메시지 표시
    }
  }

  return (
    <div className='app'>
      <h1>🌤️ 날씨앱</h1> {/* 앱 제목 */}
      <div className="input-wrap">
        <input
          value={city}
          onChange={onChangeInput} // input 값이 변경될 때마다 호출
          onKeyUp={onKeyupEnter} // Enter 키를 눌렀을 때 호출
          type="text"
          placeholder='도시명을 입력하세요' // input placeholder
        />
        <button onClick={handleSearch}>검색</button> {/* 검색 버튼 클릭 시 호출 */}
      </div>
      <WeatherCard weather={weather} /> {/* 날씨 정보를 WeatherCard 컴포넌트에 전달 */}
    </div>
  )
}

export default App

```

### 주요 기능 설명:

- **상태 관리 (`useState`)**:
    - `city` 상태는 사용자가 입력한 도시 이름을 저장합니다.
    - `weather` 상태는 도시의 날씨 정보를 저장합니다.
- **이벤트 처리**:
    - `onChangeInput`은 사용자가 입력하는 도시명을 실시간으로 상태에 반영합니다.
    - `onKeyupEnter`는 사용자가 Enter 키를 눌렀을 때 검색을 실행합니다.
- **`handleSearch` 함수**:
    - 사용자가 입력한 도시명이 있을 때, 먼저 `fetchCoordinates` 함수를 사용해 해당 도시의 좌표(위도, 경도)를 받아옵니다.
    - 그 좌표를 이용해 `fetchWeatherByCoords` 함수로 날씨 정보를 요청합니다.
    - 날씨 정보가 오면 `weather` 상태에 저장하고, 입력란을 비웁니다.

### 2. **`WeatherCard.js`**

```jsx
import React from 'react'

const WeatherCard = ({ weather }) => {
    if (!weather) return null // 날씨 정보가 없으면 아무것도 렌더링하지 않음

    // 날씨 정보에서 필요한 데이터를 구조 분해 할당
    const { name, main, weather: weatherInfo } = weather
    const { temp, humidity } = main
    const { description, icon } = weatherInfo[0]

    return (
        <div className='card'>
            <h2>{name}</h2> {/* 도시 이름 */}
            <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="weather-icon" /> {/* 날씨 아이콘 */}
            <p>{description}</p> {/* 날씨 설명 */}
            <p>
                🌡️ {temp}°C {/* 온도 */}
            </p>
            <p>
                💧 {humidity}% {/* 습도 */}
            </p>
        </div>
    )
}

export default WeatherCard

```

### 주요 기능 설명:

- `WeatherCard` 컴포넌트는 부모 컴포넌트인 `App`에서 전달한 `weather` 데이터를 받아와서 화면에 표시합니다.
- `weather` 객체는 OpenWeatherMap API로부터 받아온 날씨 정보입니다.
- 날씨 정보에서 `temp` (온도), `humidity` (습도), `description` (날씨 설명), `icon` (날씨 아이콘)을 추출해 화면에 표시합니다.

### 3. **날씨 API와 좌표 API (`weather.js`와 `geo.js`)**

### **`weather.js`**:

```jsx
import axios from "axios";

const API_KEY = '611ccf0667789927a3720beb1acfcdf2' // OpenWeatherMap API 키

export const fetchWeatherByCoords = async (lat, lon) => {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
            lat, // 위도
            lon, // 경도
            units: 'metric', // 온도를 섭씨로 받음
            lang: 'kr', // 한글로 날씨 정보를 받음
            appid: API_KEY // API 키
        }
    })
    return res.data // 날씨 데이터를 반환
}

```

### **`geo.js`**:

```jsx
import axios from "axios";

const API_KEY = '611ccf0667789927a3720beb1acfcdf2';

export const fetchCoordinates = async (city) => {
    // OpenWeatherMap의 Geo API를 통해 도시명으로 좌표를 찾는다.
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
            q: city, // 도시명
            limit: 1, // 최대 1개의 결과만 반환
            appid: API_KEY, // API 키
        }
    });

    // API에서 데이터를 받지 못했거나 결과가 없으면 에러 처리
    if (!res.data || res.data.length === 0) {
        throw new Error('도시를 찾을 수 없습니다.');
    }

    const result = res.data[0];
    const { lat, lon, name, country, local_names } = result;

    // 사용자 입력값과 응답된 도시명을 소문자로 변환하여 비교
    const normalizedInput = city.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();
    const localName = local_names?.ko?.trim().toLowerCase(); // 한국어 도시명이 있을 경우 처리

    // 입력값이 API 응답의 name 또는 local_names.ko에 포함되지 않으면 에러 처리
    if (
        !normalizedName.includes(normalizedInput) &&
        (!localName || !localName.includes(normalizedInput))
    ) {
        throw new Error('정확한 도시명을 입력해주세요.');
    }

    // 정확한 결과를 반환
    return { lat, lon, name, country };
};

```

### 설명:

- **`fetchWeatherByCoords`**: 위도(`lat`)와 경도(`lon`)를 기반으로 날씨 데이터를 가져오는 함수입니다.
- **`fetchCoordinates`**: 도시 이름(`city`)을 기반으로 해당 도시의 위도와 경도를 가져오는 함수입니다.

### 4. **스타일링 (`App.css`)**

```css
body {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #89f7fe, #66a6ff); /* 하늘색 그라데이션 배경 */
}

.app {
  background-color: #fff; /* 흰색 배경 */
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px #00000042; /* 그림자 */
  text-align: center;
  max-width: 400px; /* 최대 너비 400px */
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem; /* 제목 아래 여백 */
}

.input-wrap {
  display: flex;
  gap: 10px; /* 입력창과 버튼 사이에 10px 간격 */
}

input {
  flex: 1; /* 입력창이 남은 공간을 차지하도록 */
  padding: 0.5rem;
  border-radius: .5rem;
  border: 1px solid #ccc;
}

button {
  padding: 1rem 2.5rem;
  cursor: pointer;
  border-radius: .5rem;
  border: none;
  background-color: #0077ff;
  color: #fff;
}

button:hover {
  background-color: #005fcc; /* 버튼을 hover 했을 때 색상 변경 */
}

```
