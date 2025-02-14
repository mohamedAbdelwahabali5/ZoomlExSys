export function showErr(fieldId, msg) {
  if (!$(`#${fieldId}`).next(".err").length) {
    $(`#${fieldId}`).after(`<span class="err text-danger">${msg}</span>`);
  } else {
    $(`#${fieldId}`).next(".err").text(msg);
  }
}

export function clearErr(fieldId) {
  $(`#${fieldId}`).next(".err").remove();
}

export function inputValidation(input) {
  let fieldId = input.attr("id");
  let val = input.val().trim();
  let isValid = true;

  switch (fieldId) {
    case "signupFirstName":
    case "signupLastName":
      let nameRegex = /^[a-zA-Z]+$/;
      if (!val) {
        showErr(fieldId, "this field is required");
        isValid = false;
      } else if (!nameRegex.test(val)) {
        showErr(fieldId, "Name must contain only letters (no spaces)");
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

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

export function formValidation(form) {
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
    isValid = isValid && inputValidation($(input));
  });
  return isValid;
}
