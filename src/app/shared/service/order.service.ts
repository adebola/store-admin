import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {
    MonthlyOrder,
    Order,
    OrderStatistics,
    TopBuyingUsers,
    TopSellingProducts,
    TotalOrderCount,
    TotalOrderRevenue
} from "../model/order.model";

const ORDER_URL = environment.base_url + '/order';
const data_points = [
    0,0,0,0,0,0,0,0,0,0,0,0
]


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(
        private http: HttpClient,
    ) {}

    getOrders(pageNumber: number = 1, pageSize: number = 20): Observable<Order[]> {
        return this.http.get<Order[]>(`${ORDER_URL}/admin`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    getOrderById(id: String): Observable<Order> {
        return this.http.get<{order: Order}>(`${ORDER_URL}/${id}`).pipe(
            map(res => res.order)
        )
    }

    getTotalOrderCount(): Observable<TotalOrderCount> {
        return this.http.get<TotalOrderCount>(`${ORDER_URL}/admin/count`);
    }

    getTotalOrderTodayCount(): Observable<TotalOrderCount> {
        return this.http.get<TotalOrderCount>(`${ORDER_URL}/admin/countday`);
    }

    getTotalOrderMonthCount(): Observable<TotalOrderCount> {
        return this.http.get<TotalOrderCount>(`${ORDER_URL}/admin/countmonth`);
    }

    getTotalRevenue(): Observable<TotalOrderRevenue> {
        return this.http.get<TotalOrderRevenue>(`${ORDER_URL}/admin/revenue`);
    }

    getTotalOrderRevenue(): Observable<TotalOrderRevenue> {
        return this.http.get<TotalOrderRevenue>(`${ORDER_URL}/admin/revenue`);
    }

    getTopSellingProducts(): Observable<TopSellingProducts[]> {
        return this.http.get<{topProducts: TopSellingProducts[]}>(`${ORDER_URL}/admin/topselling`)
            .pipe(
                map(res => res.topProducts)
            );
    }

    getTopBuyers(): Observable<TopBuyingUsers[]> {
        return this.http.get<{topUsers: TopBuyingUsers[]}>(`${ORDER_URL}/admin/topusers`)
            .pipe(
                map(res => res.topUsers)
            );
    }

    search(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${ORDER_URL}/admin/search`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                search: searchString
            }
        });
    }

    get6MonthOrderAggregate(): Observable<MonthlyOrder[]> {
        return this.http.get<{orders: MonthlyOrder[]}>(`${ORDER_URL}/admin/aggregates/last6months`)
            .pipe(
                map(o => o.orders)
            );
    }

    getOrderMonthly(year: string): Observable<number[]> {
        return this.http.get<{ aggregate: OrderStatistics[] }>(`${ORDER_URL}/admin/aggregates/monthly`, {
            params: {
                year: year
            }
        }).pipe (
            tap(ot => {
                ot.aggregate.forEach((value, index) => {
                    data_points[parseInt(value._id)] =  value.total;
                });
            }),
            map(o => data_points)
        );
    }

    getOrderStatuses(): Observable<{_id: string,  count: number}[]> {
        return this.http.get<{aggregate:{_id: string,  count: number}[]}>(`${ORDER_URL}/admin/status`)
            .pipe(
                map(a => a.aggregate)
            );
    }
}
