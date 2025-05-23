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
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, finalize, Observable, throwError} from "rxjs";
import {CategoryService} from "../../../shared/service/category.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {Category} from "../../../shared/model/category.model";

@Component({
    selector: 'app-e-create-category',
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
        NgIf,
        NgOptimizedImage,
    ],
    templateUrl: './e-create-category.component.html',
    styleUrl: './e-create-category.component.scss'
})
export class ECreateCategoryComponent implements OnInit, OnDestroy {
    public id: string;
    public categoryForm: FormGroup;
    private destroyRef = inject(DestroyRef);

    private file: File | null = null;
    public imageUrl: string | ArrayBuffer | null = '/images/products/product-details1.jpg';

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    // isToggled
    isToggled = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private categoryService: CategoryService,
        public themeService: CustomizerSettingsService,
        @Inject(FormBuilder) private fb: FormBuilder
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.id = <string>this.route.snapshot.paramMap.get('id');
        this.createForm();
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

        if (!this.file && !this.id) {
            this.snackbarService.message('Please select an Image for the category');
            return;
        }

        const name = form.value.name;
        const description = form.value.description;

        let ob$: Observable<Category>;

        if (this.id) { // Update
            ob$ = this.categoryService.updateCategory({name: name, description: description}, this.file, this.id);
        } else { // Create
            ob$ = this.categoryService.createCategory({name: name, description: description}, this.file as File);
        }

        this.loadingSubject.next(true);

      ob$
          .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingSubject.next(false)
                }),
                catchError((error: HttpErrorResponse) => {
                    const message = 'Error uploading Image file, make sure it is an image file and not larger than 2MB';
                    this.snackbarService.message(message + ' : ' + error.message);
                    return throwError(() => new Error(message));
                })
            ).subscribe(o => {
            this.snackbarService.message('Category created / updated successfully');
            this.router.navigate(['/ecommerce-page/categories']).then(r => {
            });
        });
    }

    private createForm() {
        if (this.id) {
            this.categoryService.getCategoryById(this.id)
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe(category => {
                    this.imageUrl = category.imageUrl;
                    this.categoryForm = this.fb.group({
                        name: [category.name, Validators.required],
                        description: [category.description, Validators.required],
                    });
                })
        } else {
            this.categoryForm = this.fb.group({
                name: [null, Validators.required],
                description: [null, Validators.required],
            });
        }
    }
}
