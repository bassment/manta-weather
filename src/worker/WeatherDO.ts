export class WeatherDO implements DurableObject {
    private state: DurableObjectState;

    constructor(state: DurableObjectState) {
        this.state = state;
    }

    async fetch(request: Request): Promise<Response> {
        return new Response('WeatherDO response');
    }
}