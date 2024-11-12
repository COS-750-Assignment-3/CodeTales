import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

navigateTo('landing.html');

export function navigateTo(route: string) {
  window.location.href = route;
}

(window as any).navigateTo = navigateTo;