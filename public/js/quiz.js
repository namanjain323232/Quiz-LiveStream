(function() {
   var questions = [{
     question: "What is 2*5?",
     choices: [2, 5, 10, 15, 20],
     correctAnswer: 2
   }, {
     question: "What is 3*6?",
     choices: [3, 6, 9, 12, 18],
     correctAnswer: 4
   }, {
     question: "What is 8*9?",
     choices: [72, 99, 108, 134, 156],
     correctAnswer: 0
   }, {
     question: "What is 1*7?",
     choices: [4, 5, 6, 7, 8],
     correctAnswer: 3
   }, {
     question: "What is 8*8?",
     choices: [20, 30, 40, 50, 64],
     correctAnswer: 4
   }, 
   {
    question: "What is 7*8?",
    choices: [28, 36, 48, 70, 56],
    correctAnswer: 4
   }];
   
   var questionCounter = 0; //Tracks question number
   var selections = [-1,-1,-1,-1,-1,-1]; //Array containing user choices
   var quiz = $('#quiz'); //Quiz div object
   
   // Display initial question
   displayNext();
   
   // Click handler for the 'next' button
   $('#next').on('click', function (e) {
     e.preventDefault();
     
     // Suspend click listener during fade animation
     if(quiz.is(':animated')) {        
       return false;
     }
     choose();

     questionCounter++;
     displayNext();
     
     // If no user selection, progress is stopped
    //  if (isNaN(selections[questionCounter])) {
    //    alert('Please make a selection!');
    //  } else {
    //    questionCounter++;
    //    displayNext();
    //  }
   });
   
   // Click handler for the 'prev' button
   $('#prev').on('click', function (e) {
     e.preventDefault();
     
     if(quiz.is(':animated')) {
       return false;
     }
     choose();
     questionCounter--;
     displayNext();
   });
   
   // Click handler for the 'Start Over' button
  //  $('#start').on('click', function (e) {
  //    e.preventDefault();
     
  //    if(quiz.is(':animated')) {
  //      return false;
  //    }
  //    questionCounter = 0;
  //    selections = [];
  //    displayNext();
  //    $('#start').hide();
  //  });
   
   // Animates buttons on hover
   $('.button').on('mouseenter', function () {
     $(this).addClass('active');
   });
   $('.button').on('mouseleave', function () {
     $(this).removeClass('active');
   });
   
   // Creates and returns the div that contains the questions and 
   // the answer selections
   function createQuestionElement(index) {
     var qElement = $('<div>', {
       id: 'question'
     });
     
     var header = $('<h2>Question ' + (index + 1) + ':</h2>');
     qElement.append(header);
     
     var question = $('<p>').append(questions[index].question);
     qElement.append(question);
     
     var radioButtons = createRadios(index);
     qElement.append(radioButtons);
     
     return qElement;
   }
   
   // Creates a list of the answer choices as radio inputs
   function createRadios(index) {
     var radioList = $('<ul>');
     var item;
     var input = '';
     for (var i = 0; i < questions[index].choices.length; i++) {
       item = $('<li>');
       input = '<input type="radio" name="answer" value=' + i + ' />';
       input += questions[index].choices[i];
       item.append(input);
       radioList.append(item);
     }
     return radioList;
   }
   
   // Reads the user selection and pushes the value to an array
   function choose() {
     if(+$('input[name="answer"]:checked').val() > -1){
      selections[questionCounter] = +$('input[name="answer"]:checked').val();
      $(`.item${questionCounter+1}`).css({ 'background-image': 'linear-gradient(130deg, #18e767 0%, #0cecc7 85%, #2ae79f 100%)' });
     }
   }
   
   // Displays next requested element
   function displayNext() {
     quiz.fadeOut(function() {
       $('#question').remove();
       $('#next').show();
       
       if(questionCounter < questions.length){
         var nextQuestion = createQuestionElement(questionCounter);
         quiz.append(nextQuestion).fadeIn();
         if (!(isNaN(selections[questionCounter]))) {
           $('input[value='+selections[questionCounter]+']').prop('checked', true);
         }
         
         // Controls display of 'prev' button
         if(questionCounter === 1){
           $('#prev').show();
         }else if(questionCounter === 0){
           
           $('#prev').hide();
           $('#next').show();
         }else if(questionCounter === (questions.length - 1)){
          $('#next').hide();
         }
       }else {
         var scoreElem = displayScore();
         quiz.append(scoreElem).fadeIn();
         $('#next').hide();
         $('#prev').hide();
        //  $('#start').show();
       }
     });
   }

  //  $('.submitTest').on('click', function (e) {
  //   e.preventDefault();
    
  //   questionCounter = questions.length;
  //   displayNext();
  // });

  $('.endTestPopup').on('click', function (e) {
    e.preventDefault();

    choose();
    questionCounter = questions.length;
    displayNext();
    document.getElementById('navTimer').style.display = 'none';
    document.getElementById('timeUp').style.display = 'none';
    window.setTimeout(function() {
      location.assign('/quiz');
    }, 3000);
  });

  $('.areYouSurePopup').on('click', function (e) {
    e.preventDefault();

    choose();
    questionCounter = questions.length;
    displayNext();
    document.getElementById('navTimer').style.display = 'none';
    document.getElementById('endTestButton').style.display = 'none';
    window.setTimeout(function() {
      location.assign('/quiz');
    }, 3000);
  });
   
   // Computes score and returns a paragraph element to be displayed
   function displayScore() {
     var score = $('<p>',{id: 'question', class: 'finalDisplay'});
     
     var numCorrect = 0;
     for (var i = 0; i < selections.length; i++) {
       if (selections[i] === questions[i].correctAnswer) {
         numCorrect++;
       }
     }
     
     score.append('Total Marks: ' + numCorrect + ' out of ' + questions.length);
     return score;
   }

   $('.item').on('click', function (e) {
    e.preventDefault();
    $('#prev').show();

    choose();
    
    questionCounter = this.innerHTML - 1;
        
      quiz.fadeOut(function() {
      $('#question').remove();
      $('#next').show()
      
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }else if(questionCounter === (questions.length - 1)){
         $('#next').hide();
        }
    });
  });
 })();

 (function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  let time = Date.now() + 15000,
  countDown = new Date(time).getTime(),
  x = setInterval(function() {    

        let now = new Date().getTime(),
        distance = countDown - now;

        // document.getElementById("days").innerText = Math.floor(distance / (day)),
        if(Math.floor((distance % (day)) / (hour))){
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
        }else if(Math.floor((distance % (day)) / (hour)) < 10){
          document.getElementById("hours").innerText = '0' + Math.floor((distance % (day)) / (hour));
        }else{
          document.getElementById("hours").innerText = '00';
        }
        if(Math.floor((distance % (hour)) / (minute))){
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
        }else if(Math.floor((distance % (hour)) / (minute)) < 10){
          document.getElementById("minutes").innerText = '0' + Math.floor((distance % (hour)) / (minute));
        }else{
          document.getElementById("minutes").innerText = '00';
        }
        if(Math.floor((distance % (minute)) / second) > 9){
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
        }else{
          document.getElementById("seconds").innerText = '0' + Math.floor((distance % (minute)) / second);
        }

        //do something later when date is reached
        if (distance < 0) {
          document.getElementById("timeUp").style.display = 'flex';
          clearInterval(x);
        }
  }, 0)
  }());

  // $(window).blur(function() {
  //     alert('Do not switch');
  // });