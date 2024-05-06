import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersServiceService } from 'app/modules/users/users-service.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardService } from 'app/modules/dashboard/dashboard.service';
@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    styleUrls: ['./classy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        NotificationsComponent,
        UserComponent,
        NgIf,
        MatIconModule,
        MatButtonModule,
        LanguagesComponent,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        RouterOutlet,
        QuickChatComponent,
        MatMenuModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSnackBarModule,
        RouterLink,
    ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    fixedSidebar: boolean = false;
    headerName: any = '';
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    snackBar: SnackBar;
    toolTip: any;
    toolTipFlag: boolean = false;
    dialogRef: any;
    countDown: any = 0;
    intervalId: any

    /**
     * Constructor
     */
    constructor(
        private route: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        public userService: UsersServiceService,
        public dialog: MatDialog,
        public matsnackBar: MatSnackBar,
        public dashboardService: DashboardService,
    ) {
        this.snackBar = new SnackBar(matsnackBar);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.setHeaderTitle();

        // for count down 
        this.dashboardService.countDown.subscribe((count: any) => {
            if (this.intervalId) {
                clearInterval(this.intervalId)
            }
            this.countDown = count
            this.intervalId = setInterval(() => {
                if (this.countDown > 1) {
                    this.countDown = this.countDown - 1
                } else {
                    this.countDown = count
                }
            }, 1000)
        })
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        const tokenString = (localStorage.getItem('user') as string)
            ? (localStorage.getItem('user') as string)
            : undefined;
        if (tokenString) {
            this.user = JSON.parse(tokenString);
        }

        window.addEventListener('localstorageupdated', () => {
            let userItem: any = (localStorage.getItem('user') as string)
                ? (localStorage.getItem('user') as string)
                : undefined;
            this.user = JSON.parse(userItem);
        });

        // this._profileService.onProfileChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(profile => {
        //         if (profile && profile.id) {
        //             this.user = profile;
        //         }

        //     })
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
                this.fixedSidebar = false;
            });
    }

    setHeaderTitle() {
        let currentUrl = this._router.url;
        this._router.events.subscribe((event: any) => {
            if (event.url) {
                currentUrl = event.url;
            }
            if (currentUrl == '/dashboard') {
                this.headerName = 'Dashboard';
            }
            else if (currentUrl == '/accounts') {
                this.headerName = 'Accounts';
            }
            else if (currentUrl == '/file-logs') {
                this.headerName = 'File Logs';
            }
            else if (currentUrl == '/file-logs/view-log') {
                this.headerName = 'View File Logs';
            }
            else if (currentUrl == '/accounts/details') {
                this.headerName = 'Accounts Details';
            }
            else if (currentUrl == '/configurations') {
                this.headerName = 'Configurations';
            } else if (currentUrl == '/reports/batches') {
                this.headerName = 'Batches';
            } else if (currentUrl == '/reports/jobs') {
                this.headerName = 'Jobs';
            } else if (currentUrl == '/reports/emails') {
                this.headerName = 'Emails';
            } else if (currentUrl == '/reports/reports-log') {
                this.headerName = 'Reports Logs';
            } else if (currentUrl == '/reports/templates') {
                this.headerName = 'Templates';
            } else if (currentUrl == '/reports/accounts') {
                this.headerName = 'Accounts';
            }
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
