import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
    ApexChart,
    ApexAxisChartSeries,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexTooltip,
    ApexLegend,
    ApexGrid,
    ApexXAxis,
    NgApexchartsModule
} from "ng-apexcharts";
import {OrderService} from "../../../shared/service/order.service";
import {Subscription} from "rxjs";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    colors: string[];
    tooltip: ApexTooltip;
    legend: ApexLegend;
};

@Component({
    selector: 'app-average-daily-sales',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, NgApexchartsModule],
    templateUrl: './average-daily-sales.component.html',
    styleUrl: './average-daily-sales.component.scss'
})
export class AverageDailySalesComponent implements OnInit,  OnDestroy {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    private subscription: Subscription;

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription = this.orderService.get6MonthOrderAggregate().subscribe(oa => {
            this.chartOptions = {
                series: [
                    {
                        name: "Monthly Orders",
                        data: oa.map(o => o.totalOrders)
                    }
                ],
                chart: {
                    height: 214,
                    type: "bar",
                    toolbar: {
                        show: false
                    }
                },
                colors: [
                    "#00cae3"
                ],
                plotOptions: {
                    bar: {
                        columnWidth: "45%",
                        distributed: true
                    }
                },
                dataLabels: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                grid: {
                    strokeDashArray: 5,
                    borderColor: "#e0e0e0",
                    row: {
                        colors: ["#f4f6fc", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                xaxis: {
                    categories: oa.map(o => o.month),
                    axisBorder: {
                        show: false,
                        color: '#e0e0e0'
                    },
                    axisTicks: {
                        show: false,
                        color: '#e0e0e0'
                    },
                    labels: {
                        show: false,
                        style: {
                            colors: "#919aa3",
                            fontSize: "14px"
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#919aa3",
                            fontSize: "14px"
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function(val) {
                            return val.toString()
                        }
                    }
                }
            };
        });

    }

    constructor(private orderService: OrderService) {}
}
