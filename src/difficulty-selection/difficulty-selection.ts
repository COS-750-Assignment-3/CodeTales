import 'bootstrap/dist/css/bootstrap.min.css';
import './difficulty-selection.css';

const checkIcon = "<i class=\"fa-solid fa-check\"></i>";
const rightArrowIcon = "<i class=\"fa-solid fa-arrow-right\"></i>";
const lockIcon = "<i class=\"fa-solid fa-lock\"></i>";

export function navigateTo(route: string) {
    window.location.href = route;
}

(window as any).navigateTo = navigateTo;

function initialize() {
    console.log("Initializing");
    localStorage.clear();
    if (localStorage.getItem("quizResult") === null) {

        localStorage.setItem("quizResult", "3"); // set quiz result to highest difficulty. This implies the user clicked on I know what I'm doing

        console.log("Setting quiz result to 3");
        // 0 is locked, 1 is unlocked, 2 is completed
        localStorage.setItem("t0", "1");
        localStorage.setItem("t1", "0");
        localStorage.setItem("t2", "0");
        localStorage.setItem("t3", "1");
        localStorage.setItem("t4", "0");
        localStorage.setItem("t5", "0");
        localStorage.setItem("t6", "1");
        localStorage.setItem("t7", "0");
        localStorage.setItem("t8", "0");
    }


    for (let i = 0; i < 9; i++) {
        let button = document.getElementById(`t${i}`) as HTMLButtonElement;

        button.onclick = () => {
            console.log(`Navigating to activity ${i}`);
            navigateToActivity(i);
        }

        if (localStorage.getItem(`t${i}`) === "0") {
            button.innerHTML += lockIcon;
            button.disabled = true;
            button.style.backgroundColor = "#FF4B4B";
        }
        if (localStorage.getItem(`t${i}`) === "1") {
            button.innerHTML += rightArrowIcon;
            button.style.backgroundColor = "#FF9600";
        }
        if (localStorage.getItem(`t${i}`) === "2") {
            button.innerHTML += checkIcon;
            button.style.backgroundColor = "#47A600";
        }
    }



}

initialize();

export function navigateToActivity(activity: number) {
    navigateTo(`index.html?activity=${activity}`);
}

(window as any).navigateToActivity = navigateToActivity;