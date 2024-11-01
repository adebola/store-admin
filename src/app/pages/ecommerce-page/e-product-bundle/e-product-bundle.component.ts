import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatTooltip} from "@angular/material/tooltip";
import {CurrencyPipe, NgIf} from "@angular/common";
import {BundleItem} from "../../../shared/model/product.model";
import {SelectionModel} from "@angular/cdk/collections";
import {SnackbarService} from "../../../shared/service/snackbar.service";

@Component({
    selector: 'app-e-product-bundle',
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
        MatProgressSpinner,
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
        CurrencyPipe,
        NgIf,
        MatHeaderCellDef
    ],
    templateUrl: './e-product-bundle.component.html',
    styleUrl: './e-product-bundle.component.scss'
})
export class EProductBundleComponent implements OnInit, OnDestroy {
    datasource: MatTableDataSource<BundleItem>;
    selection = new SelectionModel<BundleItem>(true, []);
    displayedColumns: string[] = ['unit', 'price', 'status', 'action'];

    @Output() addBundleEvent = new EventEmitter<BundleItem>();
    @Output() removeBundleEvent = new EventEmitter<string>();

    public viewBundle = true;
    public bundleForm: FormGroup;

    public bundles: BundleItem[] = [];

    constructor(
        private snackbarService: SnackbarService,
        @Inject(FormBuilder) private fb: FormBuilder
    ) {}

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.datasource = new MatTableDataSource<BundleItem>(this.bundles);
    }

    displayAddBundleForm() {
        this.bundleForm = this.fb.group({
            unit: ['', Validators.required],
            price: ['', Validators.required],
        });

        this.viewBundle = false;
    }

    cancelNew() {
        this.viewBundle = true;
    }

    removeBundle(id: string) {
        this.bundles.splice(this.bundles.findIndex(b => b.id === id), 1);
        this.datasource.connect().next(this.bundles);
        this.removeBundleEvent.emit(id);
    }

    onSubmitBundle() {
        const unit = this.bundleForm.value.unit;
        const price = this.bundleForm.value.price;

        if (!unit || !price) {
            this.snackbarService.message('Please fill in all fields');
            return;
        }

        // Generate a unique id for the bundle
        const bundleId = Math.random().toString(36).substring(8);
        this.bundles.push({id: bundleId, unit, price });
        this.datasource.connect().next(this.bundles);
        this.addBundleEvent.emit({id: bundleId, unit, price});
        this.viewBundle = true;
    }
}
