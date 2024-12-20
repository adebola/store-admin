import {NgIf, NgOptimizedImage} from '@angular/common';
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
import {CategoryDatasource} from "./category.datasource";
import {CategoryService} from "../../../shared/service/category.service";
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
    selector: 'app-e-categories',
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
        NgOptimizedImage
    ],
    templateUrl: './e-categories.component.html',
    styleUrl: './e-categories.component.scss'
})
export class ECategoriesComponent implements OnInit, AfterViewInit{
    displayedColumns: string[] = ['image', 'name', 'status', 'action'];
    dataSource: CategoryDatasource;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private subscription: Subscription;

    constructor(
        private categoryService: CategoryService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }


    ngOnInit(): void {
        this.dataSource = new CategoryDatasource(this.categoryService);
        this.dataSource.loadCategories();
    }

    ngAfterViewInit() {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.dataSource.loadCategories(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }

    // isToggled
    isToggled = false;


    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    deleteCategory(id: string) {
        this.categoryService.deleteCategory(id).subscribe(() => {
            this.dataSource.loadCategories();
        });
    }

    logEvent($event: PageEvent) {
        this.dataSource.loadCategories($event.pageIndex + 1, $event.pageSize);
    }
}
