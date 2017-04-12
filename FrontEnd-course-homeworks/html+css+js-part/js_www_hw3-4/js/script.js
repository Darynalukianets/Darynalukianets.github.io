var body = document.getElementsByTagName('body')[0],
 tests = document.createElement('div'),
 header = document.createElement('h3'),
 question = {
   text : 'Вопрос №',
   ansvers: [
     {text : 'Вариант ответа №1',
     correct : true},
     {text : 'Вариант ответа №2',
     correct : true},
     {text : 'Вариант ответа №3',
     correct : true}
   ],
   getQuestion: function(n) {
     var list = '';
     for (var i = 0; i < this.ansvers.length; i++) {
       list += '<li><input type="checkbox">' + this.ansvers[i].text + '</li>';
     }

     return '<h4>' + this.text + n + '</h4><ul>' + list + '</ul>';
   }
 },
 submit = document.createElement('button');

header.classList.add('test-header');
header.innerHTML = 'Тест по программированию';
tests.appendChild(header);

body.appendChild(tests);
for(var i = 1; i < 4; i++) {
  tests.innerHTML += question.getQuestion(i);
}

var tagInput = document.getElementsByTagName('input');
for (i = 0; i < tagInput.length; i++) {
  tagInput[i].setAttribute('name', 'answer' + i);
}


submit.classList.add('btn-lg');
submit.innerHTML = 'Проверить мои результаты';
tests.appendChild(submit);
