import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {BackEndUser} from "../../../authentication/user.model";
import {UserService} from "../../../shared/service/user.service";
import {debounceTime, distinctUntilChanged, fromEvent, Subscription} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {tap} from "rxjs/operators";
import {UserDatasource} from "../user.datasource";

@Component({
    selector: 'app-users-list',
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
        NgOptimizedImage
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'email', 'name', 'phone', 'verified', 'action'];
    datasource: UserDatasource

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private destroyRef = inject(DestroyRef);

    constructor(
        private userService: UserService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    logEvent($event: PageEvent) {
        this.datasource.loadUsers($event.pageIndex + 1, $event.pageSize);
    }

    ngOnInit(): void {
        this.datasource = new UserDatasource(this.userService);
        this.datasource.loadUsers();
    }

    ngAfterViewInit() {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.datasource.loadUsers(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();
    }


    // isToggled
    isToggled = false;
}
