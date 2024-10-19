import {Component, Input, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";
import {OrderService} from "../../../shared/service/order.service";
import {Observable} from "rxjs";
import {TotalOrderCount} from "../../../shared/model/order.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-sales-overview',
    standalone: true,
    imports: [MatCardModule, RouterLink, DecimalPipe, NgIf, AsyncPipe, MatProgressSpinner],
    templateUrl: './sales-overview.component.html',
    styleUrl: './sales-overview.component.scss'
})
export class SalesOverviewComponent implements OnInit {
    public tocday$: Observable<TotalOrderCount>;
    public tocmonth$: Observable<TotalOrderCount>;
    @Input() totalSales: number = 0; // Input property to bind total sales value
    @Input() progress: number = 74;

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.tocday$ = this.orderService.getTotalOrderTodayCount();
        this.tocmonth$ = this.orderService.getTotalOrderMonthCount();
    } // Input property to bind progress value
}
