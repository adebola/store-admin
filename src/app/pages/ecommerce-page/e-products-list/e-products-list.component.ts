import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
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
import {ProductDatasource} from "./product.datasource";
import {ProductService} from "../../../shared/service/product.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
    selector: 'app-e-products-list',
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
        NgOptimizedImage,
        AsyncPipe,
        MatProgressSpinner
    ],
    templateUrl: './e-products-list.component.html',
    styleUrl: './e-products-list.component.scss'
})
export class EProductsListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['product', 'category', 'action'];
    dataSource: ProductDatasource;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private subscription: Subscription;

    constructor(
        private productService: ProductService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    logEvent($event: PageEvent) {
        this.dataSource.loadProducts($event.pageIndex + 1, $event.pageSize);
    }

    ngOnInit(): void {
        this.dataSource = new ProductDatasource(this.productService);
        this.dataSource.loadProducts();
    }

    ngAfterViewInit() {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    //this.dataSource.loadProducts(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    // isToggled
    isToggled = false;
}
