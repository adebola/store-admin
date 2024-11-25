import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, finalize, Observable, of, Subscription} from "rxjs";
import {Categories, Category} from "../../../shared/model/category.model";
import {CategoryService} from "../../../shared/service/category.service";

export class CategoryDatasource implements DataSource<Category> {
    private categorySubject = new BehaviorSubject<Category[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private categoryService: CategoryService) {}

    connect(collectionViewer: CollectionViewer): Observable<Category[]> {
        return this.categorySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.categorySubject.complete();
        this.loadingSubject.complete();
    }

    get page() {
        return (this.pageNumber && this.pageNumber > 0) ? this.pageNumber - 1 : 0;
    }

    get length() {
        return (this.totalSize && this.totalSize > 0) ? this.totalSize - 1 : 0;
    }

    loadCategories(pageIndex = 1, pageSize = 20, search = null) {
        this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<Categories>

        if (search) {
            ob$ = this.categoryService.searchCategories(pageIndex, pageSize, search);
        } else {
            ob$ = this.categoryService.getCategories(pageIndex, pageSize);
        }

        this.subscription = ob$.pipe(
                // catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            ).subscribe(page  => {
                this.totalSize = page.count;
                this.pageSize = page.size;
                this.pageNumber = page.current;
                this.categorySubject.next(page.categories);
            });
    }
}
