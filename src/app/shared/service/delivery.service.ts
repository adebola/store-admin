import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {Deliveries, Delivery} from "../model/delivery.model";

const DELIVERY_URL = environment.base_url + '/zone';

@Injectable({
    providedIn: 'root'
})
export class DeliveryService {
    constructor(private http: HttpClient) {}

    getDeliveryZones(page: number = 1, size: number = 20, sort = 'ascending'): Observable<Deliveries> {
        const params: { size: number; page: number;} =  {size, page};

        return this.http.get<Deliveries>(`${DELIVERY_URL}/admin`, {
            params
        });
    }

    searchDeliveryZones(page: number = 1, size: number = 20, search: string): Observable<Deliveries> {
        const params: { size: number; search: string; page: number;} =  {size, search, page};

        return this.http.get<Deliveries>(`${DELIVERY_URL}/search`, {
            params
        });
    }

    getDeliveryZoneById(id: string): Observable<Delivery> {
        return this.http.get<{zone: Delivery}>(`${DELIVERY_URL}/${id}`).pipe(
            map(d => d.zone)
        );
    }

    createDeliveryZone(zone: {name: string, price: number,  description: string}): Observable<string> {
        return this.http.post<{id: string,  message: string}>(`${DELIVERY_URL}`, zone)
            .pipe(map(res => res.id));
    }

    updateDeliveryZone(id: string,  zone: {name: string, price: number,  description: string}): Observable<any> {
        return this.http.put(`${DELIVERY_URL}/${id}`, zone);
    }

    disableDeliveryZone(id: string): Observable<any> {
        return this.http.put(`${DELIVERY_URL}/disable/${id}`, {});
    }

    enableDeliveryZone(id: string): Observable<any> {
        return this.http.put(`${DELIVERY_URL}/enable/${id}`, {});
    }
}
