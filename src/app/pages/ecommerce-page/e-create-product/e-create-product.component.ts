import {Component, DestroyRef, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {Router, RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, finalize, Observable, throwError} from "rxjs";
import {ProductService} from "../../../shared/service/product.service";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Bundle, BundleItem} from "../../../shared/model/product.model";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatTooltip} from "@angular/material/tooltip";
import {EProductBundleComponent} from "../e-product-bundle/e-product-bundle.component";

@Component({
    selector: 'app-e-create-product',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FileUploadModule,
        AsyncPipe,
        MatProgressSpinner,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        CurrencyPipe,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatTable,
        MatTooltip,
        EProductBundleComponent
    ],
    templateUrl: './e-create-product.component.html',
    styleUrl: './e-create-product.component.scss'
})
export class ECreateProductComponent implements OnInit, OnDestroy {
    public createForms: FormGroup;
    private destroyRef = inject(DestroyRef);
    public categories$: Observable<string[]>;

    private file: File | null = null;
    public imageUrl: string | ArrayBuffer | null = '/images/products/product-details1.jpg';
    private bundles: BundleItem[] = [];

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    constructor(
        private router: Router,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        @Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.categories$ = this.productService.getCategories();
        this.createForm();
    }

    private createForm() {
        this.createForms = this.fb.group({
            name: [null, Validators.required],
            category: [null, Validators.required],
            description: [null, Validators.required],
        });
    }

    ngOnDestroy(): void {
        this.loadingSubject.complete();
    }

    onFileChange($event: Event) {
        const fileInput = $event.target as HTMLInputElement;

        if (fileInput.files && fileInput.files[0]) {
            this.file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                this.imageUrl = reader.result;
            };

            reader.readAsDataURL(this.file);
        }
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            this.snackbarService.message('Please fill all the fields');
        }

        if (this.bundles.length === 0) {
            this.snackbarService.message('Please add at least one or more bundles');
            return;
        }

        if (!this.file) {
            this.snackbarService.message('Please select an Image for the product');
            return;
        }

        const name = form.value.name;
        const category = form.value.category;
        const description = form.value.description;

        this.loadingSubject.next(true);

        this.productService.createProduct({
            name: name,
            category: category,
            description: description,
            bundles: this.bundles.map(b => {
                return {
                    unit: b.unit,
                    price: b.price,
                    enabled: true
                }
            })
        }, this.file)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingSubject.next(false)
                }),
                catchError((error: HttpErrorResponse) => {
                    const message = 'Error uploading file make sure it is an image file and not larger than 2MB';
                    this.snackbarService.message(message + ' : ' + error.message);
                    return throwError(() => new Error(message));
                })
            ).subscribe(o => {
            this.snackbarService.message('Product created successfully');
            this.router.navigate(['/ecommerce-page']).then(r => {});
            console.log(o);
        });
    }

    addBundle($event: BundleItem) {
        this.bundles.push($event);
    }

    removeBundle($event: string) {
        this.bundles = this.bundles.filter(b => b.id !== $event);
    }
}
