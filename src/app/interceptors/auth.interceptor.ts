import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
console.log("TOKEN:", localStorage.getItem('token'));
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`   // ✅ VERY IMPORTANT
      }
    });

    return next(modifiedReq);
  }

  return next(req);
};