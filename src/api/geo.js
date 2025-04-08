import axios from "axios";

const API_KEY ='611ccf0667789927a3720beb1acfcdf2'


export const fetchCoordinates = async (city) => {
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
            q: city,
            limit: 1,
            appid: API_KEY,
        }
    });

    if (!res.data || res.data.length === 0) {
        throw new Error('도시를 찾을 수 없습니다.');
    }

    const result = res.data[0];
    const { lat, lon, name, country, local_names } = result;

    const normalizedInput = city.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();
    const localName = local_names?.ko?.trim().toLowerCase();

    // 입력값이 name 또는 local_names.ko 둘 중 하나라도 포함되면 OK
    if (
        !normalizedName.includes(normalizedInput) &&
        (!localName || !localName.includes(normalizedInput))
    ) {
        throw new Error('정확한 도시명을 입력해주세요.');
    }

    return { lat, lon, name, country };
};
