import {Component, Input, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";

@Component({
    selector: 'app-total-orders',
    standalone: true,
    imports: [MatCardModule, RouterLink, NgIf, AsyncPipe, DecimalPipe],
    templateUrl: './total-orders.component.html',
    styleUrl: './total-orders.component.scss'
})
export class TotalOrdersComponent {
    @Input() totalOrders: number;
}
