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

function formValidation(form) {
  // form can be signin or signup
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

///Saving user information
function saveUserData(userName, userEmail, userPassword) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let isexist = false;
  users.forEach(function (user) {
    if (user.userEmail === userEmail) isexist = true;
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

/**------------------------------------ */
// Function to get random questions
function getRandomQuestions(array, count) {
  const randumized = array.sort(() => 0.5 - Math.random());
  return randumized.slice(0, count);
}
// Function to fetch data from API
var _count = 5;
async function fetchData(apiLink) {
  console.log("fetchData called");
  try {
    const response = await fetch(apiLink);
    if (!response.ok) {
      throw new Error("No Data Found");
    }
    const data = await response.json(); // get all question
    const randomQuestions = getRandomQuestions(data, _count); // return random question
    return randomQuestions;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Function to display Question
function displayQuestion(index, questions) {
  const question = questions[index]; // object
  $(".quiz-card h5").text(`${index + 1}. ${question.question}`);
  $(".form-check").each(function (i) {
    $(this)
      .find("input")
      .attr("value", `${String.fromCharCode(65 + i)}`);
    $(this)
      .find("span")
      .text(question[String.fromCharCode(65 + i)]);
  });
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
          title: "Registeration Process success You Can Login Now",
          icon: "success",
          draggable: true,
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
        Swal.fire({
          title: "Login Successfully",
          icon: "success",
          draggable: true,
        });
      } else {
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
        Swal.fire({
          title: "Login Successfully",
          icon: "success",
          draggable: true,
        });
      } else {
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

  //
  $("#signup").hide();
  $("#signin").hide();
  $("#hero").hide();
  $("#quiz-section").show();
  //

  //$("#startEx").on("click", function (e) {
  $("#quiz-section").show();
  $("#start-ex").hide();
  // const startExamBtn = document.getElementById("start-ex-btn");
  const timer = document.getElementById("timer");
  let exCounter = 60; // five minutes
  let interval = setInterval(() => {
    let seconds = Math.floor(exCounter % 60);
    let minutes = Math.floor(exCounter / 60);
    if (exCounter < 30) {
      timer.style.color = "red";
    }
    if (exCounter <= 0) {
      timer.innerText = "00:00";
      clearInterval(interval);
      //go to the timeout page
      $("#start-ex").hide();
      $("#timeout").show();
    }
    timer.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    exCounter--;
  }, 1000);

  //fetching data from API
  let currentQuestionIndex = 0;
  let answers = [];
  fetchData("questions.json").then((questions) => {
    console.log(questions);
    displayQuestion(currentQuestionIndex, questions);

    //hide Previous and Submit Buttons at the starting
    $("#previous-btn").hide();
    $("#submit-btn").hide();

    //next Button logic
    $("#next-btn").on("click", function (e) {
      $("#previous-btn").show();
      if (currentQuestionIndex == _count - 2) {
        $("#next-btn").hide();
        $("#submit-btn").show();
      } else {
        $("#next-btn").show();
        $("#submit-btn").hide();
      }
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex, questions);
      }
      console.log(currentQuestionIndex);
    });

    //Previous Button logic
    $("#previous-btn").on("click", function (e) {
      $("#next-btn").show();
      if (currentQuestionIndex == 1) {
        $("#previous-btn").hide();
      } else {
        $("#previous-btn").show();
      }
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex, questions);
      }
    });

    //select choice logic
    $(".form-check").on("click", function (e) {
      answers[currentQuestionIndex] = $(this).find("input").attr("value");
      // console.log($(this).find("span").text());
      console.log(answers);

      //handle active selection
      // $(".form-check").removeClass("active");
      // $(this).addClass("active");
    });

    //select choice logic
    $("#submit-btn").on("click", function (e) {
      let counter = 0;
      questions.forEach(function (question, i) {
        if (question.answer == answers[i]) {
          counter++;
        }
      });
      let searchEmail = $("#signinEmail").val();
      let users = JSON.parse(localStorage.getItem("users")) || [];
      let user = users.find((u) => u.userEmail === searchEmail);
      console.log(user);

      if (counter >= 5) {
        $("#succes-res").text(`${counter * 10}  %`);
        $("#succes-uname").text(`${user.userName}`);
        $("#start-ex").hide();
        $("#pass-res").show();
      } else {
        $("#fail-res").text(`${counter * 10}  %`);
        $("#fail-uname").text(`${user.userName}`);
        $("#start-ex").hide();
        $("#fail-res").show();
      }
    });
  });
});
