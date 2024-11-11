import { Toast } from "bootstrap";
import "./toast.css"
import "bootstrap/dist/css/bootstrap.min.css";

export function showToast(heading: string, body: string) {
    const toastHeading = document.getElementById('toast-heading');
    if (toastHeading)
        toastHeading.innerHTML = heading;

    const toastBody = document.getElementById('toast-body');
    if (toastBody)
        toastBody.innerHTML = body;

    const toastElement = document.getElementById('myToast');
    if (toastElement) {
        const toast = new Toast(toastElement);
        toast.show();
    }
}