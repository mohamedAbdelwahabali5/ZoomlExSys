let isQuizActive = false; // Flag to track if the exam is active

export function startQuiz() {
  $("#start-ex").hide();
  $("#quiz-section").show();

  let selectedQuestions = [];
  let currentIndex = 0;
  let userAnswers = {};
  let flaggedQuestions = {};
  isQuizActive = true;

  $("#flagged-list").empty();

  const timer = document.getElementById("timer");
  let exCounter = 60;
  const fullName = $("#currentUserName").val();

  if (window.quizInterval) {
    clearInterval(window.quizInterval);
  }

  window.quizInterval = setInterval(() => {
    let seconds = Math.floor(exCounter % 60);
    let minutes = Math.floor(exCounter / 60);
    if (exCounter < 30) {
      timer.style.color = "red";
    }
    if (exCounter <= 0) {
      let counter = 0;
      selectedQuestions.forEach(function (question, i) {
        if (question.answer === userAnswers[i]) {
          counter++;
        }
      });

      timer.innerText = "00:00";
      clearInterval(window.quizInterval);
      $("#timeout-span").text(`${counter * 10} %`);
      $("#timeout").show();
      $("#quiz-section").hide();
    }
    timer.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    exCounter--;
  }, 1000);

  async function fetchData(apiLink) {
    try {
      const response = await fetch(apiLink);
      if (!response.ok) {
        throw new Error("No Data Found");
      }
      const data = await response.json();
      selectedQuestions = getRandomQuestions(data, 10);
      displayQuestion();
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  function getRandomQuestions(array, count) {
    const randomized = array.sort(() => 0.5 - Math.random());
    return randomized.slice(0, count);
  }

  function displayQuestion() {
    const question = selectedQuestions[currentIndex];
    $(".quiz-card h5").text(`${currentIndex + 1}. ${question.question}`);
    $(".form-check").each(function (i) {
      $(this)
        .find("input")
        .attr("value", `${String.fromCharCode(65 + i)}`);
      $(this)
        .find("span")
        .text(question[String.fromCharCode(65 + i)]);
    });

    $('input[name="answer"]').each(function () {
      $(this).prop(
        "checked",
        userAnswers[currentIndex] === $(this).attr("id").replace("option", "")
      );
    });

    if (flaggedQuestions[question.id]) {
      $("#flag").find("i").addClass("flag-red");
    } else {
      $("#flag").find("i").removeClass("flag-red");
    }

    $(".quiz-nav[title='Go to Previous']").prop("disabled", currentIndex === 0);
    $(".quiz-nav[title='Go to Next']").prop(
      "disabled",
      currentIndex === selectedQuestions.length - 1
    );
    $(".btn-submit").toggle(currentIndex === selectedQuestions.length - 1);
  }

  fetchData("questions.json");

  $(".quiz-nav").on("click", function () {
    const isNext = $(this).attr("title") === "Go to Next";
    if (isNext && currentIndex < selectedQuestions.length - 1) {
      currentIndex++;
    } else if (!isNext && currentIndex > 0) {
      currentIndex--;
    }

    displayQuestion();
  });

  $("#flag")
    .off("click")
    .on("click", function () {
      let currQues = selectedQuestions[currentIndex];
      const isFlagged = flaggedQuestions[currQues.id];

      if (!isFlagged) {
        flaggedQuestions[currQues.id] = true;
        $("#flagged-list").append(`
                    <li id="flagged-${currQues.id}" class="fs-6 fs-sm-5">
                        Question ${currentIndex + 1}
                        <button class="btn btn-link text-danger remove-flag" title="Remove this question">
                            <i class="bi bi-trash"></i>
                        </button>
                    </li>
                `);
        $(this).find("i").addClass("flag-red");
      } else {
        delete flaggedQuestions[currQues.id];
        $(`#flagged-${currQues.id}`).remove();
        $(this).find("i").removeClass("flag-red");
      }
    });

  $("#flagged-list").on("click", ".remove-flag", function () {
    const questionId = $(this).parent().attr("id").replace("flagged-", "");
    $(`#flagged-${questionId}`).remove();
    delete flaggedQuestions[questionId];

    if (selectedQuestions[currentIndex].id == questionId) {
      $("#flag").find("i").removeClass("flag-red");
    }
  });

  $("input[name='answer']").on("change", function () {
    userAnswers[currentIndex] = this.id.replace("option", "");
  });

  // Add event handler for the Home link and brand navigation
  $("#home-link, .navbar-brand").on("click", function (e) {
    e.preventDefault();
    const currentUserName = $("#currentUserName").val();

    if (isQuizActive) {
      // If the exam is active, show a SweetAlert notification
      Swal.fire({
        icon: "warning",
        title: "Exam in Progress",
        text: "You cannot navigate away from the exam until it is completed.",
      });
      return;
    }

    if (currentUserName) {
      // If user is logged in, redirect to start exam section
      $("#hero").hide();
      $("#signup").hide();
      $("#signin").hide();
      $(".res").hide();
      $("#start-ex").show(); // Redirect to Start Exam section
    } else {
      // If not logged in show the hero section
      $("#hero").show();
    }
  });

  $("#submit-btn").on("click", function (e) {
    e.preventDefault();
    let counter = 0;
    isQuizActive = false;
    selectedQuestions.forEach(function (question, i) {
      if (question.answer === userAnswers[i]) {
        counter++;
      }
    });

    const fullName = $("#currentUserName").val();

    if (counter >= 5) {
      $("#succes-res-span").text(`${counter * 10} %`);
      $("#succes-uname").text(`${fullName}`);
      $("#fail-res").hide();
      $("#pass-res").show();
    } else {
      $("#fail-res-span").text(`${counter * 10} %`);
      $("#fail-uname").text(`${fullName}`);
      $("#pass-res").hide();
      $("#fail-res").show();
    }
    $("#start-ex").hide();
    $("#quiz-section").hide();
    clearInterval(window.quizInterval);
  });
}

export function resetQuiz() {
  const timer = document.getElementById("timer");
  if (timer) {
    timer.innerText = "05:00";
    timer.style.color = "#581c87";
  }

  if (window.quizInterval) {
    clearInterval(window.quizInterval);
  }
  $("#fail-res").hide();
  $("#pass-res").hide();
  $("#start-ex").show();
}
