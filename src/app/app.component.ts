import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgChartsModule } from 'ng2-charts';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet,NgxSpinnerModule,NgChartsModule],
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
