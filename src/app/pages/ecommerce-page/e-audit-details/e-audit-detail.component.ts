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
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Observable} from "rxjs";
import {AuditService} from "../../../shared/service/audit.service";
import {Audit} from "../../../shared/model/audit.model";

@Component({
    selector: 'app-e-audit-detail',
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
        DatePipe,
    ],
    templateUrl: './e-audit-detail.component.html',
    styleUrl: './e-audit-detail.component.scss'
})
export class EAuditDetailComponent implements OnInit {
    public id: string;
    public audit$: Observable<Audit>;

    // isToggled
    isToggled = false;

    constructor(
        private route: ActivatedRoute,
        private auditService: AuditService,
        public themeService: CustomizerSettingsService,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        const id =  <string>this.route.snapshot.paramMap.get('id');
        this.audit$ = this.auditService.getAuditById(id);
    }
}
