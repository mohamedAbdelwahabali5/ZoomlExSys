
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
            let nameRegex = /^[a-zA-Z]+$/;
            if (!val) {
                showErr(fieldId, "this feild is required");
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

function formValidation(form) { // form can be signin or signup
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

//Saving user information
function saveUserData(userName, userEmail, userPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isexist = false;
    users.forEach(function (user) {
        if (user.userEmail === userEmail)
            isexist = true;
    });
    if (!isexist) {
        users.push({ userName, userEmail, userPassword });
        localStorage.setItem("users", JSON.stringify(users));
    }
    return isexist;
}


//compare between sign in and signup
function inputsComparing(userEmail, userPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isValid = false;
    users.forEach(function (user) {
        if (user.userEmail === userEmail && user.userPassword === userPassword)
            isValid = true;
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

    // Validate data when exiting the field
    $("#signup input, #signin input").on("blur", function () {
        inputValidation($(this));
    });

    $("#signup form").on("submit", function (e) {
        e.preventDefault();
        if (formValidation("signup")) {
            console.log("signuup success");
            //saving user information in local storage
            let uName = $("#signupFirstName").val().trim();
            let uEmail = $("#signupEmail").val().trim();
            let upass = $("#signupPassword").val().trim();
            let isValid = saveUserData(uName, uEmail, upass);
            if (!isValid) {
                $("#signup").hide();
                $("#signin").show();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "User Is Already Exist!",
                });
            }

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
            let uEmail = $("#signinEmail").val().trim();
            let upass = $("#signinPassword").val().trim();
            let isValid = inputsComparing(uEmail, upass);
            if (isValid) {
                $("#signin").hide();
                $("#start-ex").show();
            } else {
                // showErr(fieldId, "User Not Found");
                Swal.fire({
                    icon: "error",
                    title: "User Not Found!",
                });
            }
        } else {
            // Trigger validation for all inputs to ensure errors are displayed
            $("#signin input").each(function () {
                inputValidation($(this));
            });
        }
    });
});
