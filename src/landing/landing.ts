import 'bootstrap/dist/css/bootstrap.min.css';

export function navigateTo(route: string) {
    window.location.href = route;
}

(window as any).navigateTo = navigateTo;