import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, finalize, Observable, Subscription} from "rxjs";
import {Audit} from "../../../shared/model/audit.model";
import {AuditService} from "../../../shared/service/audit.service";

export class AuditDatasource implements DataSource<Audit> {
    private auditSubject = new BehaviorSubject<Audit[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private subscription: Subscription;

    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private auditService: AuditService) {}

    connect(collectionViewer: CollectionViewer): Observable<Audit[]> {
        return this.auditSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.auditSubject.complete();
        this.loadingSubject.complete();
    }

    get page() {
        return (this.pageNumber && this.pageNumber > 0) ? this.pageNumber - 1 : 0;
    }

    get length() {
        return (this.totalSize && this.totalSize > 0) ? this.totalSize - 1 : 0;
    }

    loadAudits(pageIndex = 1, pageSize = 20, search = null) {
        this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let ob$: Observable<any>;

        if (search) {
            ob$ = this.auditService.searchAudits(pageIndex, pageSize, search);
        } else {
            ob$ = this.auditService.getAudits(pageIndex, pageSize);
        }

        this.subscription = ob$.pipe(
            // catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page  => {
            this.totalSize = page.count;
            this.pageSize = page.size;
            this.pageNumber = page.current;
            this.auditSubject.next(page.audits);
        });
    }
}
