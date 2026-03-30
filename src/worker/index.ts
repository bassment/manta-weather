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

        if (url.pathname === "/api/recent") {
            const id = env.WEATHER_DO.idFromName("global");
            const stub = env.WEATHER_DO.get(id);
            const doRequest = new Request('https://do/recent', {
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            const doResponse = await stub.fetch(doRequest);
            const data = await doResponse.text();
            return new Response(data, {
                headers: {
                    "Content-Type": "application/json",
                    ...CORS_HEADERS,
                },
            });
        }

        if (url.pathname === '/api/reverse-geocode') {
            const lat = url.searchParams.get('lat');
            const lon = url.searchParams.get('lon');
            if (!lat || !lon) return json({ error: 'Missing lat/lon' }, 400);

            const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'User-Agent': 'MantaWeather/1.0' } }
            );
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