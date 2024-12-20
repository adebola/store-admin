import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexLegend,
    NgApexchartsModule,
    ApexDataLabels,
    ApexTooltip
} from "ng-apexcharts";
import {OrderService} from "../../../shared/service/order.service";
import {Subscription} from "rxjs";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    responsive: ApexResponsive[];
    labels: any;
    tooltip: ApexTooltip;
    colors: string[];
};

@Component({
    selector: 'app-order-summary',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        NgApexchartsModule,
        NgForOf,
        DecimalPipe,
        NgIf
    ],
    templateUrl: './order-summary.component.html',
    styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    public labels: string[] = [];
    public seriesPercent: number[] = [];

    constructor(private orderService: OrderService) {}

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription = this.orderService.getOrderStatuses().subscribe(o => {
            this.labels = o.map(s => s._id);
            const series = o.map(s => s.count);
            const sum = series.reduce((a, b) => a + b, 0);
            this.seriesPercent = series.map(s => (s / sum) * 100);

            this.chartOptions = {
                series: this.seriesPercent,
                chart: {
                    height: 467,
                    type: "donut"
                },
                labels: this.labels,
                legend: {
                    offsetY: 0,
                    fontSize: "14px",
                    position: "bottom",
                    horizontalAlign: "center",
                    labels: {
                        colors: "#919aa3",
                    },
                    itemMargin: {
                        horizontal: 12,
                        vertical: 12
                    }
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        fontSize: '14px'
                    },
                    dropShadow: {
                        enabled: false
                    }
                },
                colors: [
                    "#00cae3", "#0e7aee", "#796df6"
                ],
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + "%";
                        }
                    }
                }
            };
        });
    }
}
