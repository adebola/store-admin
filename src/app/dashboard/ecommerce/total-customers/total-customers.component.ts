import {Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs";
import {TotalUserCount} from "../../../shared/model/user.model";
import {UserService} from "../../../shared/service/user.service";
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-total-customers',
    standalone: true,
    imports: [MatCardModule, RouterLink, NgIf, AsyncPipe, MatProgressSpinner, DecimalPipe],
    templateUrl: './total-customers.component.html',
    styleUrl: './total-customers.component.scss'
})
export class TotalCustomersComponent implements OnInit {
    public tuser$: Observable<TotalUserCount>;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.tuser$ = this.userService.getUserCount();
    }
}
