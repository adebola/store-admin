import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {TopSellingProducts} from "../../../shared/model/order.model";
import {BehaviorSubject, finalize, Observable, of, Subscription} from "rxjs";
import {OrderService} from "../../../shared/service/order.service";
import {catchError} from "rxjs/operators";

export class TopProductsDatasource implements DataSource<TopSellingProducts> {
    private topSubject = new BehaviorSubject<TopSellingProducts[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private products: TopSellingProducts[];

    private subscription: Subscription;

    constructor(private orderService: OrderService) {}

    connect(collectionViewer: CollectionViewer): Observable<TopSellingProducts[]> {
        return this.topSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.topSubject.complete();
        this.loadingSubject.complete();
    }

    loadProducts() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.loadingSubject.next(true);
        this.orderService.getTopSellingProducts()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(products => {
            this.products = products;
            this.topSubject.next(products);
            this.loadingSubject.next(false);
        });
    }
}
