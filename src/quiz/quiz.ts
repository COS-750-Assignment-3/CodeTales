import 'bootstrap/dist/css/bootstrap.min.css';
import './quiz.css';
import "../toast/toast.css"
import { showToast } from "../toast/toast";


export function setDifficulty() {
    const selectedQ1 = document.querySelector('input[name="q1"]:checked') as HTMLInputElement;
    const selectedQ2 = document.querySelector('input[name="q2"]:checked') as HTMLInputElement;
    const selectedQ3 = document.querySelector('input[name="q3"]:checked') as HTMLInputElement;


    // Check if a radio button is selected and get its value
    if (selectedQ1 && selectedQ2 && selectedQ3) {
        const total: number = Number.parseInt(selectedQ1.value) +
            Number.parseInt(selectedQ2.value) +
            Number.parseInt(selectedQ3.value);

        localStorage.setItem("quizResult", total.toString());

        localStorage.setItem("t0", "1");
        localStorage.setItem("t1", "0");
        localStorage.setItem("t2", "0");
        localStorage.setItem("t3", "0");
        localStorage.setItem("t4", "0");
        localStorage.setItem("t5", "0");
        localStorage.setItem("t6", "0");
        localStorage.setItem("t7", "0");
        localStorage.setItem("t8", "0");

        // questions will be layed out 0 to 8
        // 0-2 beginner
        // 3-5 intermediate
        // 6-8 advanced
        if (total <= 1) {
            navigateTo(`index.html?t=${0}`);
        }
        if (total === 2) {
            localStorage.setItem("t3", "1");
            navigateTo(`index.html?t=${3}`);

        }
        if (total === 3) {
            localStorage.setItem("t3", "1");
            localStorage.setItem("t6", "1");
            navigateTo(`index.html?t=${6}`);
        }

    } else {
        console.log("No option selected");
        showToast('Incomplete quiz', 'Please select all of the options');
    }
}

export function navigateTo(route: string) {
    window.location.href = route;
}

(window as any).navigateTo = navigateTo;
(window as any).setDifficulty = setDifficulty;