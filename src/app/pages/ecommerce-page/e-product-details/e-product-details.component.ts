import {AsyncPipe, CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, DestroyRef, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {StarRatingComponent} from './star-rating/star-rating.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Bundle, Product} from "../../../shared/model/product.model";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {ProductService} from "../../../shared/service/product.service";
import {tap} from "rxjs/operators";
import {ReviewService} from "../../../shared/service/review.service";
import {Reviews} from "../../../shared/model/review.model";
import {MatOption, MatSelect} from "@angular/material/select";
import {ProductOrderStatistics} from "../../../shared/model/order.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTooltip} from "@angular/material/tooltip";
import {SnackbarService} from "../../../shared/service/snackbar.service";

@Component({
    selector: 'app-e-product-details',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        CarouselModule,
        NgFor,
        NgClass,
        FormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        StarRatingComponent,
        MatProgressBarModule,
        NgIf,
        AsyncPipe,
        NgOptimizedImage,
        CurrencyPipe,
        MatSelect,
        MatOption,
        MatProgressSpinner,
        DecimalPipe,
        MatTable,
        MatCell,
        MatCellDef,
        MatCheckbox,
        MatColumnDef,
        MatRow,
        MatRowDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatTooltip,
        MatHeaderRow,
        MatHeaderRowDef,
        ReactiveFormsModule
    ],
    templateUrl: './e-product-details.component.html',
    styleUrl: './e-product-details.component.scss'
})
export class EProductDetailsComponent implements OnInit, OnDestroy {
    private id: string;
    public product$: Observable<Product>;
    public productStatistics$: Observable<ProductOrderStatistics>;
    public bundle_price = 0;
    datasource: MatTableDataSource<Bundle>;
    selection = new SelectionModel<Bundle>(true, []);
    displayedColumns: string[] = ['unit', 'price', 'status', 'action'];

    private reviewSubject: BehaviorSubject<Reviews | null> = new BehaviorSubject<Reviews | null>(null)
    public reviews$ = this.reviewSubject.asObservable();
    private destroyRef = inject(DestroyRef);

    private subscription: Subscription;
    private suspendSubscription: Subscription;
    private restoreSubscription: Subscription;
    private submitSubscription: Subscription;
    private removeSubscription: Subscription;

    public viewBundle = true;

    public bundleForm: FormGroup;
    protected currentBundleId: string | null;

    // isToggled
    isToggled = false;

    constructor(
        private route: ActivatedRoute,
        private reviewService: ReviewService,
        private snackbarService: SnackbarService,
        private productService: ProductService,
        @Inject(FormBuilder) private fb: FormBuilder,
        public themeService: CustomizerSettingsService,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.id = <string>this.route.snapshot.paramMap.get('id');
        this.productStatistics$ = this.productService.getProductOrderStatistics(this.id);

        this.reviewService.getReviewsByProductId(this.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(r => this.reviewSubject.next(r));

        this.product$ = this.productService.getProductById(this.id)
            .pipe(tap(product => {
                    this.bundle_price = product.bundles[0].price;
                    this.datasource = new MatTableDataSource<Bundle>(product.bundles);
                })
            );
    }

    ngOnDestroy(): void {
        this.reviewSubject.complete();
        if (this.subscription) this.subscription.unsubscribe();
        if (this.suspendSubscription) this.suspendSubscription.unsubscribe();
        if (this.restoreSubscription) this.restoreSubscription.unsubscribe();
        if (this.submitSubscription) this.submitSubscription.unsubscribe();
        if (this.removeSubscription) this.removeSubscription.unsubscribe();
    }

    reloadBundles() {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = this.productService.getProductById(this.id)
            .subscribe(p => {
                this.datasource = new MatTableDataSource<Bundle>(p.bundles);
            });
    }

    suspendBundle(id: string) {
        if (this.suspendSubscription) this.suspendSubscription.unsubscribe();
        this.suspendSubscription = this.productService.suspendProductBundle(id, this.id)
            .subscribe(o => {
                this.reloadBundles();
            })
    }

    restoreBundle(id: string) {
        if (this.restoreSubscription) this.restoreSubscription.unsubscribe();
        this.restoreSubscription = this.productService.restoreProductBundle(id, this.id)
            .subscribe(o => {
                this.reloadBundles();
            })
    }

    addBundle() {
        this.bundleForm = this.fb.group({
            unit: ['', Validators.required],
            price: ['', Validators.required],
        });

        this.viewBundle = false;
    }

    editBundle(id: string) {
        const bundle = this.datasource.data.find(b => b._id === id);

        if (bundle) {
            this.bundleForm = this.fb.group({
                unit: [bundle.unit, Validators.required],
                price: [bundle.price, Validators.required],
            });
            this.currentBundleId = id;
            this.viewBundle = false;
        }
    }

    onSubmitBundle() {
        const unit = this.bundleForm.value.unit;
        const price = this.bundleForm.value.price;

        if (!unit || !price) {
            this.snackbarService.message('Please fill in all fields');
            return;
        }

        if (this.submitSubscription) this.submitSubscription.unsubscribe();
        let ob$: Observable<any>;

        if (this.currentBundleId) {
            ob$ = this.productService.updateBundle({_id: this.currentBundleId, unit, price}, this.id);
        } else {
            ob$ = this.productService.createBundle({unit, price}, this.id);
        }

        this.submitSubscription = ob$.subscribe(o => {
            this.reloadBundles();
            this.viewBundle = true;
            this.currentBundleId = null;
            this.snackbarService.message('Bundle saved Successfully');
        });
    }

    cancelNew() {
        this.currentBundleId = null;
        this.viewBundle = true;
    }

    removeBundle(id: string) {
        if (this.removeSubscription) this.removeSubscription.unsubscribe();
        this.removeSubscription = this.productService.removeBundle(id, this.id)
            .subscribe(o => {
                this.reloadBundles();
                this.snackbarService.message('Bundle removed Successfully');
            });

    }
}
