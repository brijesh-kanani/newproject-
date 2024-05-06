import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { of, switchMap } from 'rxjs';

export const AdminGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    const tokenString = localStorage.getItem('user') as string ? localStorage.getItem('user') as string : undefined;
    if (tokenString) {
        let user = JSON.parse(tokenString)
        if (user) {
            return of(true);
        } else {
            const urlTree = router.parseUrl(`401-unauthorized`);
            return of(urlTree)
        }

    } else {
        const urlTree = router.parseUrl(`401-unauthorized`);
        return of(urlTree)
    }
};

export const AdminGuardWithDashboard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    const tokenString = localStorage.getItem('user') as string ? localStorage.getItem('user') as string : undefined;
    if (tokenString) {
        let user = JSON.parse(tokenString)
        if (user && user.IdRole == 1) {
            return of(true);
        } else {
            const urlTree = router.parseUrl(`401-unauthorized`);
            return of(urlTree)
        }

    } else {
        const urlTree = router.parseUrl(`401-unauthorized`);
        return of(urlTree)
    }
};
