export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export interface CurrentWeather {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
}

export interface WeatherResponse {
    current_weather: CurrentWeather;
    latitude: number;
    longitude: number;
}

export interface RecentCity {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    temperature: number;
    weathercode: number;
    is_day: number;
}
