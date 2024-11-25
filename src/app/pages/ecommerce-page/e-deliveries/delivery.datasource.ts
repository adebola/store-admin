import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, finalize, Observable, Subscription} from "rxjs";
import {Deliveries, Delivery} from "../../../shared/model/delivery.model";
import {DeliveryService} from "../../../shared/service/delivery.service";

export class DeliveryDatasource implements DataSource<Delivery> {
    private zoneSubject = new BehaviorSubject<Delivery[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private deliveryService: DeliveryService) {}

    connect(collectionViewer: CollectionViewer): Observable<Delivery[]> {
        return this.zoneSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.zoneSubject.complete();
        this.loadingSubject.complete();
    }

    get page() {
        return (this.pageNumber && this.pageNumber > 0) ? this.pageNumber - 1 : 0;
    }

    get length() {
        return (this.totalSize && this.totalSize > 0) ? this.totalSize - 1 : 0;
    }

    loadDeliveries(pageIndex = 1, pageSize = 20, search = null) {
        this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<Deliveries>

        if (search) {
            ob$ = this.deliveryService.searchDeliveryZones(pageIndex, pageSize, search);
        } else {
            ob$ = this.deliveryService.getDeliveryZones(pageIndex, pageSize);
        }

        this.subscription = ob$.pipe(
                // catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            ).subscribe(page  => {
                this.totalSize = page.count;
                this.pageSize = page.size;
                this.pageNumber = page.current;
                this.zoneSubject.next(page.zones);
            });
    }
}
