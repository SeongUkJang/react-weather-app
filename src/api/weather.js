import axios from "axios";

const API_KEY ='611ccf0667789927a3720beb1acfcdf2'


export const fetchWeatherByCoords =async(lat, lon)=>{

    const res =await axios.get(`https://api.openweathermap.org/data/2.5/weather`,{
        params:{
            lat,
            lon,
            units:'metric',
            lang:'kr',
            appid:API_KEY
        }
    })

    return res.data
}