import {Component, OnDestroy, OnInit} from '@angular/core';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { TotalRevenueComponent } from './total-revenue/total-revenue.component';
import { TotalCustomersComponent } from './total-customers/total-customers.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { TotalOrdersComponent } from './total-orders/total-orders.component';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { TopBuyersComponent } from './top-buyers/top-buyers.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { RevenueComponent } from './revenue/revenue.component';
import { AverageDailySalesComponent } from './average-daily-sales/average-daily-sales.component';
import { NewCustomersThisMonthComponent } from './new-customers-this-month/new-customers-this-month.component';
import { RouterLink } from '@angular/router';
import {OrderService} from "../../shared/service/order.service";
import {Observable, Subscription} from "rxjs";
import {TotalOrderCount} from "../../shared/model/order.model";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-ecommerce',
    standalone: true,
    imports: [
        TotalSalesComponent,
        TotalRevenueComponent,
        TotalOrdersComponent,
        TotalCustomersComponent,
        SalesOverviewComponent,
        TopSellingProductsComponent,
        RecentOrdersComponent,
        TopBuyersComponent,
        OrderSummaryComponent,
        RevenueComponent,
        AverageDailySalesComponent,
        NewCustomersThisMonthComponent,
        RouterLink,
        AsyncPipe,
        NgIf,
        MatProgressSpinner
    ],
    templateUrl: './ecommerce.component.html',
    styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent implements OnInit {
    public toc$: Observable<TotalOrderCount>;

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.toc$ = this.orderService.getTotalOrderCount();
    }
}
