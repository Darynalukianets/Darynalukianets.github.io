'use strict';

let testContent = {
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
  winModal: 'Тест пройден успешно! Вы верно ответили на все вопросы!',
  loseModal: 'Тест провален! Возможно, не все ответы на вопросы были верными. Попробуйте еще раз!'
};

localStorage.setItem('test', JSON.stringify(testContent));

let test = localStorage.getItem('test');
test = JSON.parse(test);

let tmpl = document.getElementById('tmpl-test').innerHTML;
let result = _.template(tmpl)(test);
document.body.insertAdjacentHTML("beforeEnd", result);

window.onload = function() {
  let button = document.getElementById('check-button'),
      userAnsvers = [],
      inputs = document.getElementsByTagName('input'),
      correctAnsvers = [],
      comparedAnsvers = false,
      modal = document.getElementById('modal'),
      modalContent = document.getElementById('modal-content'),
      overlay = document.getElementById('overlay'),
      close = document.getElementById('close'),

      hideModal = () => {
        modal.style.display = "none";
        overlay.style.display = "none";
        modalContent.innerHTML = '';
        let userAnsvers = [];
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].checked = false;
        };
      },

      showWin = () => {
        modal.style.display = "block";
        modalContent.innerHTML = testContent.winModal;
        overlay.style.display = "block";
      },

      showLose = () => {
        modal.style.display = "block";
        modalContent.innerHTML = testContent.loseModal;
        overlay.style.display = "block";
      };

  button.addEventListener('click', function() {
    for (let i = 0; i < inputs.length; i++) {
      userAnsvers.push(inputs[i].checked);
    };

    for (let i = 0; i < testContent.questions.length; i++) {
      for (let y = 0; y < testContent.questions[i].ansvers.length; y++) {
        correctAnsvers.push(testContent.questions[i].ansvers[y].correct);
      };
    };

    (function compAnsvers() {
      for (let i = 0; i < userAnsvers.length; i++) {
        if (Object.is(userAnsvers[i], correctAnsvers[i])) {
          comparedAnsvers = true;
        } else {
          comparedAnsvers = false;
        }
      };

      if(Object.is(comparedAnsvers, true)) {
        showWin();
        close.addEventListener('click', hideModal);
      } else {
        showLose();
        close.addEventListener('click', hideModal);
      }
    })();
  });
}
