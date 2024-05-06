import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApexOptions } from 'apexcharts';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { MatTabsModule } from '@angular/material/tabs';
import {
    CommonModule,
    Location,
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
} from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { DashboardService } from './dashboard.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { DashboardFileLogComponent } from './dashboard-file-log/dashboard-file-log.component';
import { NgxGaugeModule } from 'ngx-gauge';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);


export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    stroke: ApexStroke;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string[];
    fill: ApexFill;
    legend: ApexLegend;
};
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        MatTooltipModule,
        MatTabsModule,
        NgIf,
        NgFor,
        MatSnackBarModule,
        CommonModule,
        DashboardFileLogComponent,
        NgxGaugeModule,
    ],
})
export class DashboardComponent {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    @ViewChild(DashboardFileLogComponent)
    dashboardFileLogComponent: DashboardFileLogComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    chartVisitorsVsPageViews: ApexOptions;
    public hoveredData: any = null;
    dateMenuTitle: any = '1 month';
    snackBar: SnackBar;
    totalData: any;
    chartData: any;
    areaChartData: any;
    notificationsData: any;
    notificationsFlag: any = false;
    meterData: any;
    data: any;
    fromDate = moment().format('YYYY-MM-DD');
    toDate = moment().format('YYYY-MM-DD');
    private intervalId: any;
    timeConfiguration: any;
    callFlag: boolean = true;

    selectedOption: string = 'Today' // Selected option within the range (Years/Months)
    years: number[] = [2020, 2021, 2022, 2023, 2024]; // List of years
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // List of months


    /**
     * Constructor
     */
    constructor(
        private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {
        this.snackBar = new SnackBar(_snackBar);
    }
    /**
     * On init
     *
     */
    ngOnInit(): void {

        this.getTimeLimite();
        this.data = {
            series: [
                {
                    name: '',
                    totalfilecount: [],
                    warningCount: [],
                    errorCount: [],
                },
            ],
        };
        // Get the data
        // this.getCardData();
        // this.getChartData();
        this.getAreaChartData()
        this.createChartGauge()
        this.getMeterData()
        this.getNotificationsData()
    }

    createChartGauge(): void {
        Highcharts.chart('filerevivedchart', {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%',
            },
            title: {
                text: '',
            },
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '70%'],
                size: '90%',
            },
            yAxis: {
                min: 0,
                max: 200,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor:
                    Highcharts.defaultOptions.chart.backgroundColor ||
                    '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 13,
                    style: {
                        fontSize: '14px',
                    },
                },
                lineWidth: 0,
                plotBands: [
                    {
                        from: 0,
                        to: 25,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 25,
                        to: 50,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 50,
                        to: 75,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 75,
                        to: 100,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 100,
                        to: 125,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 125,
                        to: 150,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 150,
                        to: 175,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                    {
                        from: 175,
                        to: 200,
                        color: '#79a5ed', // blue
                        thickness: 20,
                    },
                ],
            },
            series: [
                {
                    type: 'gauge',
                    name: 'Daily Imported Files',
                    data: [
                        this.meterData?.dashboardMeterData?.total
                            ? this.meterData?.dashboardMeterData?.total
                            : 0,
                    ],
                    tooltip: {
                        valueSuffix: ' per/day',
                    },
                    dataLabels: {
                        // format: '{y} km/h',
                        borderWidth: 0,
                        color:
                            (Highcharts.defaultOptions.title &&
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color) ||
                            '#333333',
                        style: {
                            fontSize: '20px',
                        },
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%',
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6,
                    },
                },
            ],
        });
        Highcharts.chart('fileprocessedchart', {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%',
            },
            title: {
                text: '',
            },
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '70%'],
                size: '90%',
            },
            yAxis: {
                min: 0,
                max: 200,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor:
                    Highcharts.defaultOptions.chart.backgroundColor ||
                    '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 13,
                    style: {
                        fontSize: '14px',
                    },
                },
                lineWidth: 0,
                plotBands: [
                    {
                        from: 0,
                        to: 25,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 25,
                        to: 50,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 50,
                        to: 75,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 75,
                        to: 100,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 100,
                        to: 125,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 125,
                        to: 150,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 150,
                        to: 175,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                    {
                        from: 175,
                        to: 200,
                        color: '#4fd681', // green
                        thickness: 20,
                    },
                ],
            },
            series: [
                {
                    type: 'gauge',
                    name: 'Daily Files Processed',
                    data: [
                        this.meterData?.dashboardMeterData?.success
                            ? this.meterData?.dashboardMeterData?.success
                            : 0,
                    ],
                    tooltip: {
                        valueSuffix: ' per/day',
                    },
                    dataLabels: {
                        // format: '{y} km/h',
                        borderWidth: 0,
                        color:
                            (Highcharts.defaultOptions.title &&
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color) ||
                            '#333333',
                        style: {
                            fontSize: '20px',
                        },
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%',
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6,
                    },
                },
            ],
        });
        Highcharts.chart('filerevivedchart1', {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%',
            },
            title: {
                text: '',
            },
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '70%'],
                size: '90%',
            },
            yAxis: {
                min: 0,
                max: 200,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor:
                    Highcharts.defaultOptions.chart.backgroundColor ||
                    '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 13,
                    style: {
                        fontSize: '14px',
                    },
                },
                lineWidth: 0,
                plotBands: [
                    {
                        from: 0,
                        to: 25,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 25,
                        to: 50,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 50,
                        to: 75,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 75,
                        to: 100,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 100,
                        to: 125,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 125,
                        to: 150,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 150,
                        to: 175,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                    {
                        from: 175,
                        to: 200,
                        color: '#ebe55e', // yellow
                        thickness: 20,
                    },
                ],
            },
            series: [
                {
                    type: 'gauge',
                    name: 'Daily Warning Files',
                    data: [
                        this.meterData?.dashboardMeterData?.warning
                            ? this.meterData?.dashboardMeterData?.warning
                            : 0,
                    ],
                    tooltip: {
                        valueSuffix: ' per/day',
                    },
                    dataLabels: {
                        // format: '{y} km/h',
                        borderWidth: 0,
                        color:
                            (Highcharts.defaultOptions.title &&
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color) ||
                            '#333333',
                        style: {
                            fontSize: '20px',
                        },
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%',
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6,
                    },
                },
            ],
        });
        Highcharts.chart('fileprocessedchart1', {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%',
            },
            title: {
                text: '',
            },
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '70%'],
                size: '90%',
            },
            yAxis: {
                min: 0,
                max: 200,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor:
                    Highcharts.defaultOptions.chart.backgroundColor ||
                    '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 13,
                    style: {
                        fontSize: '14px',
                    },
                },
                lineWidth: 0,
                plotBands: [
                    {
                        from: 0,
                        to: 25,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 25,
                        to: 50,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 50,
                        to: 75,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 75,
                        to: 100,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 100,
                        to: 125,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 125,
                        to: 150,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 150,
                        to: 175,
                        color: '#e87979', // Red
                        thickness: 20,
                    },
                    {
                        from: 175,
                        to: 200,
                        color: '#e87979', // Red
                        thickness: 20,
                    }
                ],
            },
            series: [
                {
                    type: 'gauge',
                    name: 'Daily Error Files',
                    data: [
                        this.meterData?.dashboardMeterData?.error
                            ? this.meterData?.dashboardMeterData?.error
                            : 0,
                    ],
                    tooltip: {
                        valueSuffix: ' per/day',
                    },
                    dataLabels: {
                        // format: '{y} km/h',
                        borderWidth: 0,
                        color:
                            (Highcharts.defaultOptions.title &&
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color) ||
                            '#333333',
                        style: {
                            fontSize: '20px',
                        },
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%',
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6,
                    },
                },
            ],
        });
    }

    getTimeLimite() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.IdUser) {
            this.dashboardService
                .getTimeByUser(user.IdUser)
                .then((res: any) => {
                    if (res.configuration) {
                        this.timeConfiguration = res.configuration.time;
                        this.getTimeWiseCardData();
                    } else {
                        let body: any = {
                            time: 10,
                            IdUser: user.IdUser,
                        };
                        this.dashboardService
                            .setTimeByUser(body)
                            .then((data: any) => {
                                if (data) {
                                    this.getTimeLimite();
                                }
                            })
                            .catch((err) => {
                                console.log('err while set default time', err);
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            this.snackBar.error('User id not found');
            this.router.navigate(['/sign-in']);
        }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    ngAfterViewInit(): void {
        if (this.dashboardFileLogComponent) {
            this.dashboardFileLogComponent.getDashboardFileLog();
        }
        clearInterval(this.intervalId)
    }
    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Visitors vs Page Views
        this.chartVisitorsVsPageViews = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
            },
            colors: ['#22c55e', '#eab308', '#ef4444'],
            dataLabels: {
                enabled: false,
            },
            fill: {
                colors: ['#22c55e', '#eab308', '#ef4444'],
                opacity: 0.1,
            },
            grid: {
                borderColor: '#f1f1f1',
            },
            legend: {
                show: false,
            },
            series: [
                {
                    name: 'Imported File',
                    data: this.data.series[0].totalfilecount,
                },
                {
                    name: 'Imported warning',
                    data: this.data.series[0].warningCount,
                },
                {
                    name: 'Imported error',
                    data: this.data.series[0].errorCount,
                },
            ],
            stroke: {
                curve: 'smooth',
                width: 4,
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    show: false,
                },
                tickAmount: 3,
                tooltip: {
                    enabled: false,
                },
            },
        };
    }

    getTimeWiseCardData() {
        if (this.timeConfiguration) {
            this.dashboardService.countDown.next(this.timeConfiguration);
            this.intervalId = setInterval(() => {
                // this.getCardData();
                // this.getChartData();
                this.getMeterData();
                this.getAreaChartData();
                this.getNotificationsData()
            }, this.timeConfiguration * 1000);
        }
    }


    menuItemClicked(item: string, value: any) {
        this.selectedOption = value
        if (item == 'year') {
            this.fromDate = moment(value, 'YYYY').startOf('year').format('YYYY-MM-DD');
            // Create a Moment object for the last day of the selected month
            this.toDate = moment(value, 'YYYY').endOf('year').format('YYYY-MM-DD');

        } else if (item == 'thisWeek') {
            this.fromDate = moment().clone().startOf('week').format('YYYY-MM-DD');
            // Calculate the end date of the current week (Saturday)
            this.toDate = moment().clone().endOf('week').format('YYYY-MM-DD');

        } else if (item == 'month') {
            this.fromDate = moment(value, 'MMMM').startOf('month').format('YYYY-MM-DD');
            // Create a Moment object for the last day of the selected month
            this.toDate = moment(value, 'MMMM').endOf('month').format('YYYY-MM-DD');
        } else {
            this.fromDate = moment().format('YYYY-MM-DD');
            this.toDate = moment().format('YYYY-MM-DD');
        }
        this.getAreaChartData();
    }



    getCardData() {
        // if (this.dashboardFileLogComponent) {
        //     this.dashboardFileLogComponent.getDashboardFileLog(
        //         this.fromDate,
        //         this.toDate
        //     );
        // }
        this.dashboardService
            .getCardData()
            .then((response: any) => {
                if (response) {
                    if ((this.totalData && this.totalData.chartData) && (this.totalData.chartData.Processed != response.chartData.Processed || this.totalData.chartData.Received != response.chartData.Received)) {
                        this.callFlag = true
                    }
                    this.totalData = response;

                    if (this.callFlag == true) {
                        this.createChartGauge();
                        this.callFlag = false
                    }
                }
            })
            .catch((e) => {
                console.log(e, 'error while get card count')
                // this.snackBar.error(e.errorMessage);
            });
    }

    getChartData() {
        if (this.dashboardFileLogComponent) {
            this.dashboardFileLogComponent.getDashboardFileLog();
        }
        this.dashboardService
            .getChartData(this.fromDate, this.toDate)
            .then((response: any) => {
                this.chartData = response.chartData;
                let totalfilecount = [];
                let warningCount = [];
                let errorCount = [];
                if (response?.chartData.length > 0) {
                    response?.chartData.map((item: any) => {
                        totalfilecount.push({
                            x: item.dataDate.slice(0, 10),
                            y: item.totalfilecount,
                        });
                    });
                }
                if (response?.chartData.length > 0) {
                    response?.chartData.map((item: any) => {
                        warningCount.push({
                            x: item.dataDate.slice(0, 10),
                            y: item.warningCount,
                        });
                    });
                }
                if (response?.chartData.length > 0) {
                    response?.chartData.map((item: any) => {
                        errorCount.push({
                            x: item.dataDate.slice(0, 10),
                            y: item.errorCount,
                        });
                    });
                }
                this.data.series[0].name = 'chart data';
                this.data.series[0].totalfilecount = totalfilecount;
                this.data.series[0].warningCount = warningCount;
                this.data.series[0].errorCount = errorCount;
                this._prepareChartData();
            })
            .catch((e) => {
                this.snackBar.error(e.errorMessage);
            });
    }

    prepareAreaChart() {
        this.chartOptions = {
            series: [
                {
                    name: "Total Orders",
                    group: "actual",
                    type: "area",
                    data: this.areaChartData ? this.areaChartData : [0, 0, 0, 0]
                },
                // {
                //     name: "Line Connectors",
                //     type: "line",
                //     data: [48000, 50000, 40000, 65000]   // Example data for line connectors
                // }

            ],
            chart: {
                type: 'area',
                height: 350,
                stacked: true,
            },
            stroke: {
                width: 1,
                colors: ["#000"] // Adjust color as needed
            },
            dataLabels: {
                formatter: (val) => {
                    return Number(val);
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '20%'
                },
            },
            xaxis: {
                categories: [['\uf044', 'Order Created'], ['\uf47a', 'Order Pick'], ['\uf4cf', 'Order Ready'], ['\uf48b', 'Order Shipped']], // Use category text only here
                labels: {
                    style: {
                        fontSize: '18px',
                        fontFamily: 'FontAwesome', // Use Font Awesome font family
                    },
                    offsetY: 5,
                    offsetX: 2,
                },
                tooltip: {
                    enabled: false, // Enable tooltips
                }
            },
            fill: {
                opacity: 1
            },
            colors: ["#80c7fd", "#000"], // Adjust colors as needed
            yaxis: {
                // labels: {
                //     formatter: (val:any) => {
                //         console.log(val,'val')
                //         return val > 0 ? val : 0;
                //     }
                // },
                tooltip: {
                    enabled: false, // Enable tooltips
                }
            },
            legend: {
                position: "top",
                horizontalAlign: "left"
            },
        };
    }

    async getMeterData() {
        if (this.dashboardFileLogComponent) {
            this.dashboardFileLogComponent.getDashboardFileLog();
        }
        await this.dashboardService.getDashboardMeterCount().then((response: any) => {
            this.meterData = response
        }).catch((err) => {
            console.log(err);
        });
        this.createChartGauge();
    }

    async getAreaChartData() {
        await this.dashboardService.getAreaChartData(this.fromDate, this.toDate).then((response: any) => {
            this.areaChartData = response.areaChartData;
        }).catch((err) => {
            console.log(err);
        });
        this.prepareAreaChart();
    }

    getNotificationsData() {
        this.dashboardService.getNotificationsData().then((response: any) => {
            this.notificationsData = response;
        }).catch((err) => {
            this.notificationsFlag = true
            console.log(err);
        });
    }
}
