// $("#signup").hide();
// $("#signin").hide();

// $("#sign-in").on("click", function () {
//   $("#hero").hide();
//   $("#signup").hide();
//   $("#signin").show();
// });

// $("#sign-up").on("click", function () {
//   $("#hero").hide();
//   $("#signin").hide();
//   $("#signup").show();
// });
// $("#sign-upp").on("click", function () {
//   $("#hero").hide();
//   $("#signin").hide();
//   $("#signup").show();
// });
// $("#sign-inn").on("click", function () {
//   $("#hero").hide();
//   $("#signup").hide();
//   $("#signin").show();
// });

// function isValid(id, regx) {}

// $("#quiz-section").show();

function showErr(fieldId, msg) {
  if (!$(`#${fieldId}`).next(".err").length) {
    // check if no err after feildid to prevent dupliction of err
    $(`#${fieldId}`).after(`<span class="err text-danger">${msg}</span>`);
  } else {
    $(`#${fieldId}`).next(".err").text(msg);
  }
}

function clearErr(fieldId) {
  $(`#${fieldId}`).next(".err").remove(); // remove next for feild id
}

// function validateEmail(email) {
//   //i put it in function because if found myself pass regext on if condition
//   let regex =
//   return regex.test(email);
// }

function inputValidation(input) {
  let fieldId = input.attr("id"); // get id attribute for eact input
  console.log(fieldId);

  let val = input.val().trim(); // get input value and rempve spaces
  let isValid = true;

  switch (fieldId) {
    case "signupFirstName":
    case "signupLastName":
      if (!val) {
        showErr(fieldId, "this feild is required");
        isValid = false;
      } else if (val.length < 3 || val.length > 12) {
        showErr(fieldId, "name must be between 3 and 12 characters");
        isValid = false;
      } else {
        clearErr(fieldId);
      }
      break;
    case "signupEmail":
    case "signinEmail":
      let emailRegex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!val) {
        showErr(fieldId, "Email is required");
        isValid = false;
      } else if (!emailRegex.test(val)) {
        showErr(fieldId, "Invalid email format");
        isValid = false;
      } else {
        clearErr(fieldId);
      }
      break;
    case "signupPassword":
    case "signinPassword":
      let passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!val) {
        showErr(fieldId, "Password is required.");
        isValid = false;
      } else if (!passRegex.test(val)) {
        showErr(
          fieldId,
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character."
        );
        isValid = false;
      } else {
        clearErr(fieldId);
      }
      break;
    case "signupConfirmPassword":
      const pass = $("#signupPassword").val().trim();
      if (!val) {
        showErr(fieldId, "Confirm Password is required");
        isValid = false;
      } else if (val !== pass) {
        showErr(fieldId, "password does not match");
        isValid = false;
      } else clearErr(fieldId);
      break;
  }
  return isValid;
}

function formValidation(form) {
  $(".err").remove();
  let isValid = true;
  let inputs = {
    signup: [
      "#signupFirstName",
      "#signupLastName",
      "#signupEmail",
      "#signupPassword",
      "#signupConfirmPassword",
    ],
    signin: ["#signinEmail", "#signinPassword"],
  };

  inputs[form].forEach((input) => {
    isValid = isValid && inputValidation($(input)); // don't forget to pass it byid # so $(field)
  });
  return isValid;
}

$(document).ready(function () {
  // Initially hide signup and signin sections
  $("#signup").hide();
  $("#signin").hide();

  // Show section based on button clicked
  $(".toggle-section").on("click", function (e) {
    e.preventDefault(); // Prevent default link behavior
    const targetSection = $(this).data("target");
    $("#hero").hide();
    $("#signup, #signin").hide();

    $(".err").remove(); // for remve err msg if i navigate between login and signup

    // for reseting forms
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
      console.log("signuup success");
    } else {
      // Trigger validation for all inputs to ensure errors are displayed
      $("#signup input").each(function () {
        inputValidation($(this));
      });
    }
  });

  $("#signin form").on("submit", function (e) {
    e.preventDefault();
    if (formValidation("signin")) {
      console.log("signin success");
    } else {
      // Trigger validation for all inputs to ensure errors are displayed
      $("#signin input").each(function () {
        inputValidation($(this));
      });
    }
  });
});
