export { WeatherDO } from "./WeatherDO";

interface Env {
    WEATHER_DO: DurableObjectNamespace;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        return new Response("Manta Weather API");
    }
}