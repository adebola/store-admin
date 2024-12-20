import {AsyncPipe, CurrencyPipe, DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {OrderDatasource} from "./order.datasource";
import {OrderService} from "../../../shared/service/order.service";
import {tap} from "rxjs/operators";

@Component({
    selector: 'app-recent-orders',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        NgIf,
        MatTooltipModule,
        AsyncPipe,
        CurrencyPipe,
        DatePipe,
        NgOptimizedImage
    ],
    templateUrl: './recent-orders.component.html',
    styleUrl: './recent-orders.component.scss'
})
export class RecentOrdersComponent implements OnInit, AfterViewInit {

    isToggled = false;
    subscription: Subscription;
    displayedColumns: string[] = ['Id', 'price', 'date', 'status'];
    dataSource: OrderDatasource;

    @Input() standalone = true;

    constructor(public themeService: CustomizerSettingsService, private orderService: OrderService) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    @ViewChild('input') input: ElementRef;
    @ViewChild('paginator') paginator: MatPaginator;

    logEvent($event: PageEvent) {
        this.dataSource.loadOrders($event.pageIndex + 1, $event.pageSize);
    }

    ngOnInit(): void {
        this.dataSource = new OrderDatasource(this.orderService);
        this.dataSource.loadOrders();
    }

    ngAfterViewInit(): void {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.dataSource.loadOrders(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }
}
