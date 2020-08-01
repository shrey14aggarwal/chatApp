import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router, private snackbar: MatSnackBar){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (localStorage.getItem('name') != null) {
      console.log(localStorage.getItem('name'))
      return true
    }

    else {
      this.snackbar.open('Please Login first!!', '', {
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn'],
       
      });
      this.router.navigate(['login'])
      console.log('auth')
      return false;
    }

  }
}
