import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private url = 'https://api.ambeedata.com/weather/latest/by-lat-lng?lat=12.9889055&lng=77.574044'


  constructor(private httpClient: HttpClient) {
  }

  getForecast() {
    const head = new HttpHeaders()
      .set('Content-Type', 'aplication/json')
      .set('x-api-key', '3e083fa85b28f09f28f26c6eee033ae0475861de3756758256bda9639d45041a')

    return this.httpClient.get(this.url, {'headers': head})
  }
}
