'use strict';

var testContent = {
  title: 'Тест по программированию',
  questions: [
    {question: 'Вопрос №1',
     ansvers: [
      {text: 'Вариант ответа №1',
      correct: true},
      {text: 'Вариант ответа №2',
      correct: false},
      {text: 'Вариант ответа №3',
      correct: true}
    ]},
    {question: 'Вопрос №2',
     ansvers: [
      {text: 'Вариант ответа №1',
      correct: false},
      {text: 'Вариант ответа №2',
      correct: true},
      {text: 'Вариант ответа №3',
      correct: true}
    ]},
    {question: 'Вопрос №3',
     ansvers: [
      {text: 'Вариант ответа №1',
      correct: false},
      {text: 'Вариант ответа №2',
      correct: false},
      {text: 'Вариант ответа №3',
      correct : true}
    ]}
  ],
  check: 'Проверить мои результаты',
  winModal: 'Тест пройден успешно! Вы праивльно ответили на все вопросы!',
  loseModal: 'Тест провален! Возможно, не все ответы на вопросы были правильными. После закрытия данного сообщения попробуйте еще раз!'
};

localStorage.setItem('test', JSON.stringify(testContent));

var test = localStorage.getItem('test');
test = JSON.parse(test);

var tmpl = document.getElementById('tmpl-test').innerHTML;
var result = _.template(tmpl)(test);
document.body.insertAdjacentHTML("beforeEnd", result);

window.onload = function() {
  var button = document.getElementById('check-button'),
      userAnsvers = [],
      inputs = document.getElementsByTagName('input'),
      correctAnsvers = [],
      comparedAnsvers = false,
      modal = document.getElementById('modal'),
      modalContent = document.getElementById('modal-content'),
      overlay = document.getElementById('overlay'),
      close = document.getElementById('close');

  button.addEventListener('click', function() {
    for (var i = 0; i < inputs.length; i++) {
      userAnsvers.push(inputs[i].checked);
    };

    for (var i = 0; i < testContent.questions.length; i++) {
      for (var y = 0; y < testContent.questions[i].ansvers.length; y++) {
        correctAnsvers.push(testContent.questions[i].ansvers[y].correct);
      };
    };

    (function compAnsvers() {
      for (var i = 0; i < userAnsvers.length; i++) {
        if (userAnsvers[i] === correctAnsvers[i]) {
          comparedAnsvers = true;
        } else {
          comparedAnsvers = false;
        }
      };

      if (comparedAnsvers === true) {
        showWin();
        close.addEventListener('click', hideModal);
      } else {
        showLose();
        close.addEventListener('click', hideModal);
      }
    })();

    function showWin() {
      modal.style.display = "block";
      modalContent.innerHTML = testContent.winModal;
      overlay.style.display = "block";
    };

    function showLose() {
      modal.style.display = "block";
      modalContent.innerHTML = testContent.loseModal;
      overlay.style.display = "block";
    };

    function hideModal() {
      modal.style.display = "none";
      overlay.style.display = "none";
      modalContent.innerHTML = '';
      var userAnsvers = [];
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      };
    };
  });
}
