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
  }
}

function clearErr(fieldId) {
  $(`#${fieldId}`).next(".error").remove(); // remove next for feild id
}

function validateEmail(email) {
  //i put it in functio because if found myself pass regext on if condition
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

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
      if (!val) {
        showErr(fieldId, "Email is required");
        isValid = false;
      } else if (!validateEmail(val)) {
        showErr(fieldId, "Invalid email format");
        isValid = false;
      } else clearErr(fieldId);
      break;
    case "signupPassword":
    case "signinPassword":
      if (!val) {
        showErr(fieldId, "Password is required.");
        isValid = false;
      } else if (val.length < 8) {
        showErr(fieldId, "Password must be at least 8 characters.");
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
    isValid = isValid && inputValidation($(input)); // don't for get to pass it byid # so $(field)
  });
  return isValid;
}

$(document).ready(function () {
  // Initially hide signup and signin sections
  $("#signup").hide();
  $("#signin").hide();

  // Show section based on button clicked
  $(".toggle-section").on("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    const targetSection = $(this).data("target");
    $("#hero").hide();
    $("#signup, #signin").hide();
    $(targetSection).show();
  });

  $("#signup form").on("submit", function (e) {
    e.preventDefault();
    if (formValidation("signup")) {
      console.log("signuup success");
    }
  });

  $("#signin form").on("submit", function (e) {
    e.preventDefault();
    if (formValidation("signin")) {
      console.log("signin success");
    }
  });
});
