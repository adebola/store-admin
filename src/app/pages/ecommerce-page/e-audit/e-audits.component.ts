import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {tap} from "rxjs/operators";
import {AuditDatasource} from "./audit.datasource";
import {AuditService} from "../../../shared/service/audit.service";

@Component({
    selector: 'app-e-audit',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
        DatePipe,
    ],
    templateUrl: './e-audits.component.html',
    styleUrl: './e-audits.component.scss'
})
export class EAuditComponent implements OnInit, AfterViewInit{
    displayedColumns: string[] = ['event', 'user', 'date', 'action'];
    dataSource: AuditDatasource;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private subscription: Subscription;

    constructor(
        private auditService: AuditService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.dataSource = new AuditDatasource(this.auditService);
        this.dataSource.loadAudits();
    }

    ngAfterViewInit() {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.dataSource.loadAudits(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    // isToggled
    isToggled = false;


    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }


    logEvent($event: PageEvent) {
        this.dataSource.loadAudits($event.pageIndex + 1, $event.pageSize);
    }
}
