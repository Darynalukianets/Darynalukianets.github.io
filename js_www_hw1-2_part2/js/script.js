var userNamesList = [];

for (var i = 0; i < 5; i++) {
  userNamesList[i] = prompt('Укажите имя нового пользователя');
}

var inputedUserName = prompt('Введите Ваше имя пользователя');

var listItem;
var checkResult;

for (var i = 0; i < 5; i++) {
    listItem = userNamesList[i];

    if (inputedUserName == listItem) {
        checkResult = true;
        console.log('true');
        break;
      } else {
        checkResult = false;
        console.log('false');
      }
  }

if (checkResult == true) {
  alert(inputedUserName + ', вы успешно вошли');
  console.log('true');
} else {
  alert('Такого имени не существует');
  console.log('false');
}
