import {AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {BackEndUser} from "../../../authentication/user.model";
import { Observable } from "rxjs";
import {UserService} from "../../../shared/service/user.service";
import {OrderService} from "../../../shared/service/order.service";
import {OrderDatasource} from "../../../dashboard/ecommerce/recent-orders/order.datasource";

@Component({
    selector: 'app-user-details',
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
        AsyncPipe,
        NgOptimizedImage,
        DatePipe,
        DecimalPipe,
        CurrencyPipe
    ],
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
    private id: string;
    protected datasource: OrderDatasource;
    protected user$: Observable<BackEndUser>;
    protected displayedColumns: string[] = ['price', 'date', 'status'];
    protected status$: Observable<{ _id: string, count: number, total: number }[]>;

    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private orderService: OrderService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.id = <string>this.route.snapshot.paramMap.get('id');
        this.user$ = this.userService.getUserById(this.id);
        this.status$ = this.orderService.getOrderStatusesByUserId(this.id);

        this.datasource = new OrderDatasource(this.orderService);
        this.datasource.loadUserOrders(this.id);
    }

    logEvent($event: PageEvent) {
        this.datasource.loadUserOrders(this.id, $event.pageIndex + 1, $event.pageSize);
    }

    // isToggled
    isToggled = false;
}
