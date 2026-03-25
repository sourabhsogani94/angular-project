import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    alert('Access denied');
    return false;
  }

  return true;
};