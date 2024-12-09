import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, finalize, Observable, of, Subscription} from "rxjs";
import {Product, Products} from "../../../shared/model/product.model";
import {ProductService} from "../../../shared/service/product.service";

export class ProductDatasource implements DataSource<Product> {
    private productSubject = new BehaviorSubject<Product[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private productService: ProductService) {}

    connect(collectionViewer: CollectionViewer): Observable<Product[]> {
        return this.productSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productSubject.complete();
        this.loadingSubject.complete();
    }

    get page() {
        return (this.pageNumber && this.pageNumber > 0) ? this.pageNumber - 1 : 0;
    }

    get length() {
        return (this.totalSize && this.totalSize > 0) ? this.totalSize - 1 : 0;
    }

    loadProducts(pageIndex = 1, pageSize = 20, search = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<Products>;

        if (search) {
            ob$ = this.productService.searchProducts(pageIndex, pageSize, search);
        } else {
            ob$ = this.productService.getProducts(pageIndex, pageSize);
        }

        this.subscription = ob$
            .pipe(
                //catchError(() => of(null)),
                //catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(page  => {
                this.totalSize = page.count;
                this.pageSize = page.size;
                this.pageNumber = page.current;
                this.productSubject.next(page.products);
            });
    }
}
