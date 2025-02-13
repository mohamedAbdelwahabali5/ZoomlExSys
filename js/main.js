import { showErr, clearErr, inputValidation, formValidation } from './validation.js';
import { saveUserData, inputsComparing } from './userManagement.js';
import { startQuiz, resetQuiz } from './quiz.js';
import { initializeUI } from './ui.js';

$(document).ready(function () {
    initializeUI();

    $("#startEx").on("click", function (e) {
        startQuiz();
    });
});