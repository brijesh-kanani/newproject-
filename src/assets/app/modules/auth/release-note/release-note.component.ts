import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgFor } from '@angular/common';
import moment from 'moment';

@Component({
    selector: 'app-release-note',
    templateUrl: './release-note.component.html',
    styleUrls: ['./release-note.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatDialogModule, MatToolbarModule, NgFor]
})
export class ReleaseNoteComponent {
    releaseNotes: any = [
        {
            version: 'V1.0.19-ir',
            date: moment('2024-04-25').format('DD-MM-YYYY'),
            features: [
                'Updated dashboard UI with improved design and functionality.'
            ],
        },
        {
            version: 'V0.0.11',
            date: moment('2024-03-12').format('DD-MM-YYYY'),
            features: [
                'Add receiving mapping with multiple mapping and filters'
            ],
        },
        {
            version: 'V0.0.10',
            date: moment('2024-03-01').format('DD-MM-YYYY'),
            features: [
                'File in progress loader changes when file in progress with line color blue.'
            ],
        },
        {
            version: 'V0.0.8',
            date: moment('2024-02-23').format('DD-MM-YYYY'),
            features: [
                'Dashboard count bug fix.',
                'File log date and time changes and also add file inprogress loader.',
                'Add JSON file for mapping with filter and multiple mapping.'
            ],
        },
        {
            version: 'V0.0.5',
            date: moment('2024-01-08').format('DD-MM-YYYY'),
            features: [
                'Dashboard ui changes.',
                'File log ui change and also add some functionality like download file line log, add status filter, add file log summary in file log view.',
                'Add configurations module for configure a dashboard.',
                'Add conditional and multiple mapping with view,delete and update was in progress'
            ],
        },
        {
            version: 'V0.0.4',
            date: moment('2023-12-15').format('DD-MM-YYYY'),
            features: [
                'Dashboard changes.',
                'Add mapping filter in mapping import file.',
                'Bug fix in file log module and mapping module.'
            ],
        },
        {
            version: 'V0.0.3',
            date: moment('2023-12-07').format('DD-MM-YYYY'),
            features: [
                'Dashboard API integrated.',
                'Fixed account list mapping configuration bug.',
                'Added a file log module to display all file logs.'
            ],
        },
        {
            version: 'V0.0.2',
            date: moment('2023-12-05').format('DD-MM-YYYY'),
            features: [
                'Add dashboard ui.',
                'FTP configuration with folder.',
                'List out imported file and view file log with account wise.',
            ],
        },
        {
            version: 'V0.0.1',
            date: moment('2023-12-01').format('DD-MM-YYYY'),
            features: [
                'Create login module role wise.',
                'Display all account list role wise.',
                'Account list show a account profile, ftp configuration, mapping configuration and file log.',
                'File log in progress.'
            ],
        },
    ];

    constructor(public matDialogRef: MatDialogRef<ReleaseNoteComponent>, @Inject(MAT_DIALOG_DATA) private data: any,) { }

    ngOnInit(): void {
        // this.releaseNotes[0].version = this.data.version
    }

}
