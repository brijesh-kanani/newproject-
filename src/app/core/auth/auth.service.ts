import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { FileLogService } from 'app/modules/file-log/file-log.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private fileLogService: FileLogService,
        private router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * It calls the API to request the user's password reset.
     * @param user
     */
    forgotPassword(user: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.url + '/login/Authentication/forgotPassword', {
                    ...user
                })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    /**
    * It updates the user's password.
    * @param user
    */
    resetPassword(user: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.url + `/login/authentication/updateNewPassword`,
                    { ...user }
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }


    /**
     * It does the authentication with the API.
     * @param user
     */
    authentication(credentials: { email: string; password: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.phUrl +
                    '/api/auth/login',
                    { ...credentials }
                )
                .subscribe((response: any) => {
                    if (response.data) {
                        this.accessToken = response.data.access_token;
                        // Set the authenticated flag to true
                        this._authenticated = true;

                        // Store the user on the user service
                        localStorage.setItem(environment.tokenKey, response.data.access_token)
                        localStorage.setItem('user', JSON.stringify(response.data.user))
                        const event = new Event('localstorageupdated');
                        window.dispatchEvent(event);

                        resolve(response);
                    } else {
                        reject(response.message);
                    }
                }, reject);
        });

        // return this._httpClient.post<ResponseData<any>>(environment.url + '/api/authentication/getByEmailAndPassword', user);
    }

    decodeToken(token) {
        const _decodeToken = (token) => {
            try {
                return JSON.parse(atob(token));
            } catch {
                return;
            }
        };
        return token
            .split('.')
            .map(token => _decodeToken(token))
            .reduce((acc, curr) => {
                if (!!curr) acc = { ...acc, ...curr };
                return acc;
            }, Object.create(null));
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) => {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.clear();
        localStorage.removeItem('accessToken');
        this.fileLogService.filters = ''


        // Set the authenticated flag to false
        this._authenticated = false;
        this.router.navigate(['/sign-in'])

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
