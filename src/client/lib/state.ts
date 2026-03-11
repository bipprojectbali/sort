import { proxy } from "valtio";

export const state = proxy({
    pass: ""
});
    
export function loadPass() {
    const pass = localStorage.getItem("pass");
    if (pass && pass === "Makuro_123") {
        state.pass = pass;
    }
}

export function savePass(pass: string) {
    localStorage.setItem("pass", pass);
    state.pass = pass;
    loadPass();
}

export function removePass() {
    localStorage.removeItem("pass");
    state.pass = "";
}
    


    