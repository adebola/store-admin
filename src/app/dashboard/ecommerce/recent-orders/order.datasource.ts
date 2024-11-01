import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Order} from "../../../shared/model/order.model";
import {BehaviorSubject, finalize, Observable, of, Subscription} from "rxjs";
import {OrderService} from "../../../shared/service/order.service";
import {catchError} from "rxjs/operators";

export class OrderDatasource implements DataSource<Order> {
    private orderSubject = new BehaviorSubject<Order[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private orders: Order[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private orderService: OrderService) {}

    get page() {
        if (this.orders) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {
        if (this.orders) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Order[]> {
        return this.orderSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.orderSubject.complete();
        this.loadingSubject.complete();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadUserOrders(id: string,  pageIndex = 1, pageSize = 20, searchString: string | null = null) {
        //this.loadingSubject.next(true);

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.orderService.searchUser(id, pageIndex, pageSize, searchString);
        } else {
            obs$ = this.orderService.getUserOrders(id,  pageIndex, pageSize);
        }

        this.subscribeToOrders(obs$);
    }

    loadOrders(pageIndex = 1, pageSize = 20, searchString: string | null = null) {
        //this.loadingSubject.next(true);

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.orderService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.orderService.getOrders(pageIndex, pageSize);
        }

        this.subscribeToOrders(obs$);
    }

    private subscribeToOrders(o$: Observable<any>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = o$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.count;
            this.pages = page.pages;
            this.pageSize = page.size;
            this.pageNumber = page.current;
            this.orders = page.orders;
            this.orderSubject.next(page.orders);
        });
    }
}
