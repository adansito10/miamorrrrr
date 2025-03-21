import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { Observable, of, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  // Verifica si el usuario está autenticado
  private checkAuthStatus(): Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['./auth/login']); // Redirige si no está autenticado
        }
      })
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.checkAuthStatus(); // Solo los usuarios autenticados pueden acceder a las rutas protegidas
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthStatus(); // Solo los usuarios autenticados pueden acceder a las rutas protegidas
  }
}
