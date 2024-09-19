import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

// import(inject) to app.module, since we want it to work on the global level
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    // req is immutable, we must clone it
    req = req.clone({
      // set the header
      setHeaders: {
        Authorization: token ?? '',
      },
    });
    return next.handle(req);
  }
}
