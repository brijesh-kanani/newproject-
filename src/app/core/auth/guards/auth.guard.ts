import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    const tokenPayload = getAuthToken()
    // Check the authentication status
    if (tokenPayload) {
        return of(true);
    } else {
        const urlTree = router.parseUrl(`sign-in`);
        return of(urlTree)
    }
};

export function getAuthToken(): string {
    const tokenString = localStorage.getItem(environment.tokenKey) as string ? localStorage.getItem(environment.tokenKey) as string : undefined;
    return tokenString
}
