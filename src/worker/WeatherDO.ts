export class WeatherDO implements DurableObject {
    private state: DurableObjectState;

    constructor(state: DurableObjectState) {
        this.state = state;
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/recent" && request.method === "GET") {
            const cities = await this.state.storage.get<string>("recent_cities");
            return new Response(cities || "[]", {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (url.pathname === "/recent" && request.method === "POST") {
            const city = await request.json() as { id: number; [key: string]: unknown};
            const existing = await this.state.storage.get<string>("recent_cities");
            const cities = existing ? JSON.parse(existing) : [];

            // Remive duplicates
            const filtered = cities.filter((c: { id: number; name: string; country: string }) =>
                !(c.name === city.name && c.country === city.country)
            );
            //Add to front and max 5
            filtered.unshift(city);
            const trimmed = filtered.slice(0, 5);

            await this.state.storage.put("recent_cities", JSON.stringify(trimmed));
            return new Response(JSON.stringify(trimmed), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response('NOT FOUND', { status: 404 });
    }
}