import {Component, DestroyRef, inject, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ProductService} from "../../../shared/service/product.service";
import {BehaviorSubject, finalize, Observable, throwError} from "rxjs";
import {Product} from "../../../shared/model/product.model";
import {catchError, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-e-edit-product',
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
        NgIf,
        AsyncPipe,
        NgOptimizedImage,
        NgForOf,
        MatProgressSpinner
    ],
    templateUrl: './e-edit-product.component.html',
    styleUrl: './e-edit-product.component.scss'
})
export class EEditProductComponent implements OnInit, OnDestroy {
    public id: string;
    public editForm: FormGroup;
    private destroyRef = inject(DestroyRef);
    public categories$: Observable<string[]>;

    private file: File | null;
    public imageUrl: string | ArrayBuffer | null;

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private productSubject = new BehaviorSubject<Product | null>(null);
    public product$ = this.productSubject.asObservable();

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        @Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.id = <string>this.route.snapshot.paramMap.get('id');
        this.loadProduct();
        this.categories$ = this.productService.getCategories();
    }

    private createForm(product: Product) {
        this.editForm = this.fb.group({
            name: [product.name, Validators.required],
            category: [product.category, Validators.required],
            description: [product.description, Validators.required],
        });
    }

    private loadProduct() {
        this.productService.getProductById(this.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap(product => {
                    this.imageUrl = product.imagePath ? product.imagePath : '/images/courses/course1.jpg';
                    this.createForm(product)
                })
            ).subscribe(product => this.productSubject.next(product));
    }

    ngOnDestroy(): void {
        this.loadingSubject.complete();
        this.productSubject.complete();
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

        const name = form.value.name;
        const category = form.value.category;
        const description = form.value.description;
        this.loadingSubject.next(true);

        this.productService.updateProduct(this.id, {name, category, description}, this.file)
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
            this.loadProduct();
            this.snackbarService.message('Product updated successfully');
        });
    }
}
