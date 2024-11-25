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
import {DeliveryService} from "../../../shared/service/delivery.service";
import {Delivery} from "../../../shared/model/delivery.model";

@Component({
    selector: 'app-e-delivery-detail',
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
    templateUrl: './e-delivery-detail.component.html',
    styleUrl: './e-delivery-detail.component.scss'
})
export class EDeliveryDetailComponent implements OnInit, OnDestroy {
    public id: string;
    public zoneForm: FormGroup;
    private destroyRef = inject(DestroyRef);


    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    // isToggled
    isToggled = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private deliveryService: DeliveryService,
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

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            this.snackbarService.message('Please fill all the fields');
        }


        const name = form.value.name;
        const description = form.value.description;
        const price = form.value.price;

        let ob$: Observable<any>;

        if (this.id) { // Update
            ob$ = this.deliveryService.updateDeliveryZone(this.id, {name: name, price: price, description: description});
        } else { // Create
            ob$ = this.deliveryService.createDeliveryZone({name: name, price: price, description: description});
        }

        this.loadingSubject.next(true);

      ob$
          .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingSubject.next(false)
                }),
                catchError((error: HttpErrorResponse) => {
                    const message = 'Error creating delivery zone';
                    this.snackbarService.message(message + ' : ' + error.message);
                    return throwError(() => new Error(message));
                })
            ).subscribe(o => {
            this.snackbarService.message('Delivery Zone created / updated successfully');
            this.router.navigate(['/ecommerce-page/deliveries']).then(r => {
            });
        });
    }

    private createForm() {
        if (this.id) {
            this.deliveryService.getDeliveryZoneById(this.id)
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe(d => {
                    this.zoneForm = this.fb.group({
                        name: [d.name, Validators.required],
                        description: [d.description, Validators.required],
                        price: [d.price, Validators.required],
                    });
                })
        } else {
            this.zoneForm = this.fb.group({
                name: [null, Validators.required],
                description: [null, Validators.required],
                price: [null, Validators.required],
            });
        }
    }
}
