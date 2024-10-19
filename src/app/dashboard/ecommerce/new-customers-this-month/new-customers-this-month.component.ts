import {Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {UserService} from "../../../shared/service/user.service";
import {BackEndUser} from "../../../authentication/user.model";
import {Observable} from "rxjs";
import {TotalUserCount} from "../../../shared/model/user.model";
import {map} from "rxjs/operators";
import {AsyncPipe, DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-new-customers-this-month',
    standalone: true,
    imports: [MatCardModule, RouterLink, AsyncPipe, NgIf, MatProgressSpinner, NgForOf, NgOptimizedImage, DecimalPipe],
    templateUrl: './new-customers-this-month.component.html',
    styleUrl: './new-customers-this-month.component.scss'
})
export class NewCustomersThisMonthComponent implements OnInit {
    public usersToday$: Observable<BackEndUser[]>;
    public usersMonthly$: Observable<TotalUserCount>;


    // isToggled
    isToggled = false;

    constructor(
        private userService: UserService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.usersToday$ = this.userService.getUsersJoinedToday()
            .pipe(
                map(u => u.result)
            );
        this.usersMonthly$ = this.userService.getUserMonthlyCount();
    }
}
