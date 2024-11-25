import {CurrencyPipe, NgIf, NgOptimizedImage} from '@angular/common';
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
import {DeliveryDatasource} from "./delivery.datasource";
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {tap} from "rxjs/operators";
import {DeliveryService} from "../../../shared/service/delivery.service";

@Component({
    selector: 'app-e-deliveries',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        NgIf,
        MatCheckboxModule,
        MatTooltipModule,
        CurrencyPipe,
    ],
    templateUrl: './e-deliveries.component.html',
    styleUrl: './e-deliveries.component.scss'
})
export class EDeliveriesComponent implements OnInit, AfterViewInit{
    displayedColumns: string[] = ['name', 'price', 'status', 'action'];
    dataSource: DeliveryDatasource;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private subscription: Subscription;

    constructor(
        private deliveryService: DeliveryService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }


    ngOnInit(): void {
        this.dataSource = new DeliveryDatasource(this.deliveryService);
        this.dataSource.loadDeliveries();
    }

    ngAfterViewInit() {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.dataSource.loadDeliveries(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    // isToggled
    isToggled = false;


    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    disableDeliveryZone(id: string) {
        this.deliveryService.disableDeliveryZone(id).subscribe(() => {
            this.dataSource.loadDeliveries();
        });
    }

    enableDeliveryZone(id: string) {
        this.deliveryService.enableDeliveryZone(id).subscribe(() => {
            this.dataSource.loadDeliveries();
        });
    }

    logEvent($event: PageEvent) {
        this.dataSource.loadDeliveries($event.pageIndex + 1, $event.pageSize);
    }
}
