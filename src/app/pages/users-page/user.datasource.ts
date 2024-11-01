import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, finalize, Observable, of, Subscription} from "rxjs";
import {BackEndUser, BackEndUserPage} from "../../authentication/user.model";
import {UserService} from "../../shared/service/user.service";
import {catchError} from "rxjs/operators";

export class UserDatasource implements DataSource<BackEndUser> {
    private userSubject = new BehaviorSubject<BackEndUser[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;
    public currentSize: number;

    constructor(private userService: UserService) {}

    connect(collectionViewer: CollectionViewer): Observable<BackEndUser[]> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    get page() {
        return (this.pageNumber && this.pageNumber > 0) ? this.pageNumber - 1 : 0;
    }

    get length() {
        return (this.totalSize && this.totalSize > 0) ? this.totalSize - 1 : 0;
    }

    loadUsers(pageIndex = 1, pageSize = 20, searchString: string | null = null) {
        // this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.userService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.userService.getUsers(pageIndex, pageSize);
        }

        this.subscription = obs$
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(p  => {
                console.log(p);
                this.totalSize = p.count;
                this.pageSize = p.size;
                this.pageNumber = p.current;
                this.currentSize = p.current_size;
                this.userSubject.next(p.users);
            });
    }
}
