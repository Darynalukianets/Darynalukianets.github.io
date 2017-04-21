'use strict';

var testContent = {
  title: 'Тест по программированию',
  questions: [{ question: 'Вопрос №1',
    ansvers: [{ text: 'Вариант ответа №1',
      correct: true }, { text: 'Вариант ответа №2',
      correct: false }, { text: 'Вариант ответа №3',
      correct: true }] }, { question: 'Вопрос №2',
    ansvers: [{ text: 'Вариант ответа №1',
      correct: false }, { text: 'Вариант ответа №2',
      correct: true }, { text: 'Вариант ответа №3',
      correct: true }] }, { question: 'Вопрос №3',
    ansvers: [{ text: 'Вариант ответа №1',
      correct: false }, { text: 'Вариант ответа №2',
      correct: false }, { text: 'Вариант ответа №3',
      correct: true }] }],
  check: 'Проверить мои результаты',
  winModal: 'Тест пройден успешно! Вы верно ответили на все вопросы!',
  loseModal: 'Тест провален! Возможно, не все ответы на вопросы были верными. Попробуйте еще раз!'
};

localStorage.setItem('test', JSON.stringify(testContent));

var test = localStorage.getItem('test');
test = JSON.parse(test);

var tmpl = document.getElementById('tmpl-test').innerHTML;
var result = _.template(tmpl)(test);
document.body.insertAdjacentHTML("beforeEnd", result);

window.onload = function () {
  var button = document.getElementById('check-button'),
      userAnsvers = [],
      inputs = document.getElementsByTagName('input'),
      correctAnsvers = [],
      comparedAnsvers = false,
      modal = document.getElementById('modal'),
      modalContent = document.getElementById('modal-content'),
      overlay = document.getElementById('overlay'),
      close = document.getElementById('close'),
      hideModal = function hideModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
    modalContent.innerHTML = '';
    var userAnsvers = [];
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = false;
    };
  },
      showWin = function showWin() {
    modal.style.display = "block";
    modalContent.innerHTML = testContent.winModal;
    overlay.style.display = "block";
  },
      showLose = function showLose() {
    modal.style.display = "block";
    modalContent.innerHTML = testContent.loseModal;
    overlay.style.display = "block";
  };

  button.addEventListener('click', function () {
    for (var i = 0; i < inputs.length; i++) {
      userAnsvers.push(inputs[i].checked);
    };

    for (var _i = 0; _i < testContent.questions.length; _i++) {
      for (var y = 0; y < testContent.questions[_i].ansvers.length; y++) {
        correctAnsvers.push(testContent.questions[_i].ansvers[y].correct);
      };
    };

    (function compAnsvers() {
      for (var _i2 = 0; _i2 < userAnsvers.length; _i2++) {
        if (Object.is(userAnsvers[_i2], correctAnsvers[_i2])) {
          comparedAnsvers = true;
        } else {
          comparedAnsvers = false;
        }
      };

      if (Object.is(comparedAnsvers, true)) {
        showWin();
        close.addEventListener('click', hideModal);
      } else {
        showLose();
        close.addEventListener('click', hideModal);
      }
    })();
  });
};
