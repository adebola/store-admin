import {Component, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {OrderService} from "../../../shared/service/order.service";
import {Observable} from "rxjs";
import {TopBuyingUsers, TopSellingProducts} from "../../../shared/model/order.model";
import {AsyncPipe, CurrencyPipe, DecimalPipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-top-buyers',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        AsyncPipe,
        MatProgressSpinner,
        NgIf,
        NgForOf,
        NgOptimizedImage,
        SlicePipe,
        DecimalPipe,
        CurrencyPipe
    ],
    templateUrl: './top-buyers.component.html',
    styleUrl: './top-buyers.component.scss'
})
export class TopBuyersComponent implements OnInit{
    public top$: Observable<TopBuyingUsers[]>;

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

    ngOnInit(): void {
        this.top$  = this.orderService.getTopBuyers();
    }

    xyz(cardHeaderMenu: MatMenu) {
        console.log(cardHeaderMenu);
    }

    menuChange(cardHeaderMenu: MatMenu) {
        console.log('MenuChange', cardHeaderMenu);
    }
}
