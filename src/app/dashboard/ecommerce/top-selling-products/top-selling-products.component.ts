import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { TopProductsDatasource } from './top-products.datasource';
import {OrderService} from "../../../shared/service/order.service";
import {AsyncPipe, CurrencyPipe, DecimalPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-top-selling-products',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        AsyncPipe,
        MatProgressSpinner,
        NgIf,
        NgOptimizedImage,
        CurrencyPipe,
        DecimalPipe
    ],
    templateUrl: './top-selling-products.component.html',
    styleUrl: './top-selling-products.component.scss'
})
export class TopSellingProductsComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['product', 'quantity', 'total'];
    dataSource: TopProductsDatasource;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        //this.dataSource.paginator = this.paginator;
    }

    // isToggled
    isToggled = false;

    constructor(
        private orderService: OrderService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    ngOnInit(): void {
        this.dataSource = new TopProductsDatasource(this.orderService);
        this.dataSource.loadProducts();
    }

    logEvent($event: PageEvent) {

    }
}
