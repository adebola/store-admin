import {Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {OrderService} from "../../../shared/service/order.service";
import {Observable} from "rxjs";
import {TotalOrderRevenue} from "../../../shared/model/order.model";
import {AsyncPipe, CurrencyPipe, NgIf} from "@angular/common";

@Component({
    selector: 'app-total-revenue',
    standalone: true,
    imports: [MatCardModule, RouterLink, NgIf, AsyncPipe, CurrencyPipe],
    templateUrl: './total-revenue.component.html',
    styleUrl: './total-revenue.component.scss'
})
export class TotalRevenueComponent implements OnInit{
    public trev$: Observable<TotalOrderRevenue>;

    constructor(
        private orderService: OrderService
    ) {}

    ngOnInit(): void {
        this.trev$ = this.orderService.getTotalOrderRevenue();
    }
}
