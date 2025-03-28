import {HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './service/auth.service';

const PUBLIC_ROUTES = [
  '/api/tasks',
  '/api/auth/login',
  '/api/auth/register'
];

export const AuthInterceptor:HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (PUBLIC_ROUTES.includes(req.url)) {
    return next(req);
  }

  const reqAurh = token
  ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  : req;

  return next(reqAurh);
}
