import { inputValidation, formValidation } from "./validation.js";
import { saveUserData, inputsComparing } from "./userManagement.js";
import { resetQuiz } from "./quiz.js";

export function initializeUI() {
  $("#signup").hide();
  $("#signin").hide();
  $("#logout-link").hide(); // Initially hide the logout link

  $(".toggle-section").on("click", function (e) {
    e.preventDefault();
    const targetSection = $(this).data("target");
    $("#hero").hide();
    $("#signup, #signin").hide();

    $(".err").remove();

    $("#signupForm").trigger("reset");
    $("#signinForm").trigger("reset");
    $(targetSection).show();
  });

  $("#signup input, #signin input").on("blur", function () {
    inputValidation($(this));
  });

  $("#signup form").on("submit", function (e) {
    e.preventDefault();
    if (formValidation("signup")) {
      let firstName = $("#signupFirstName").val().trim();
      let lastName = $("#signupLastName").val().trim();
      let uEmail = $("#signupEmail").val().trim();
      let upass = $("#signupPassword").val().trim();
      saveUserData(firstName, lastName, uEmail, upass);

      Swal.fire({
        title: "Registration Process success You Can Login Now",
        icon: "success",
        draggable: true,
      });
      $("#signup").hide();
      $("#signin").show();
    }

    $("#signup input").each(function () {
      inputValidation($(this));
    });
  });

  $("#signin form").on("submit", function (e) {
    e.preventDefault();
    if (formValidation("signin")) {
      let uEmail = $("#signinEmail").val().trim();
      let upass = $("#signinPassword").val().trim();
      let isValid = inputsComparing(uEmail, upass);

      if (isValid) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let currentUser = users.find((u) => u.userEmail === uEmail);

        $("#nav-about-id").text(currentUser.fullName);
        $("#logout-link").show(); // Show the logout link when logged in

        $("#quiz-section").append(`
                <input type="hidden" id="currentUserName" value="${currentUser.fullName}">
            `);

        $("#signin").hide();
        $("#start-ex").show();
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops! We couldn't find this user",
        });
      }
    } else {
      $("#signin input").each(function () {
        inputValidation($(this));
      });
    }
  });

  $("#new-quiz-btn, #new-quiz-timer-btn, #new-quiz-fail-btn").on(
    "click",
    function () {
      let target = $(this).data("target");
      $(target).hide();
      resetQuiz();
    }
  );
}
