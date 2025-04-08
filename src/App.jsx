import './App.css'
import WeatherCard from './components/WeatherCard'
import { useState } from 'react'
import {fetchWeatherByCoords} from './api/weather'
import {fetchCoordinates} from './api/geo'

function App() {

  const [city, setCity]=useState('')
  const [weather, setWeather]=useState(null)


  const onChangeInput=(e)=>{
    setCity(e.target.value)
  }

  const onKeyupEnter =(e)=>{
    if(e.keyCode===13){
      handleSearch()
    }
  }

  const handleSearch=async()=>{

    if(!city) return

    try{
      const {lat, lon, name, country} =await fetchCoordinates(city)
      const data = await fetchWeatherByCoords(lat,lon)

      setWeather(data)
      setCity('')

    }catch(error){
      setCity('')
      console.error(error)
      alert('도시를 찾을 수 없어요')
    }

  }


  // const lat =37.5665
  // const lon= 126.9780

  // fetchWeatherByCoords(lat, lon).then(data=>{
  //   // console.log(data)
  // })


  // fetchCoordinates('seoul').then(data=>{
  //   console.log(data)
  // })

  return (
    <div className='app'>

      <h1>🌤️ 날씨앱</h1>
      <div className="input-wrap">
        <input
        value={city} 
        onChange={onChangeInput}
        onKeyUp={onKeyupEnter}
        type="text" 
        placeholder='도시명을 입력하세요' />
        <button onClick={handleSearch}>검색</button>
      </div>
      <WeatherCard weather={weather} />

    </div>
  )
}

export default App
