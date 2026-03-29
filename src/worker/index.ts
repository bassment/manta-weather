export { WeatherDO } from "./WeatherDO";

interface Env {
    WEATHER_DO: DurableObjectNamespace;
}

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        if (url.pathname === "/api/geocode") {
            const name = url.searchParams.get("name");
            if (!name) {
                return new Response("Missing 'name' query parameter", { status: 400, headers: CORS_HEADERS });
            }

            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en`);
            const data = await res.json();
            return json(data);
        }

        if (url.pathname === '/api/weather') {
            const lat = url.searchParams.get("lat");
            const lon = url.searchParams.get("lon");
            if (!lat || !lon) {
                return new Response("Missing 'lat' or 'lon' query parameter", { status: 400, headers: CORS_HEADERS });
            }

            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current_weather=true`);
            const data = await res.json();
            return json(data);
        }

        return json({ status: "Manta Weather API" });
    }
}

function json(data: unknown, statusCode = 200): Response {
    return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
        },
    });
}