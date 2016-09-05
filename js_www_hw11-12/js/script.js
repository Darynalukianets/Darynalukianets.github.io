$(function () {
  $('li.carousel-element').myCarousel();
});

$(function() {

  var html = $('#tmpl-profile').html();
  var personalInfo = [
    {
      name: 'Лукьянец Дарья',
      descr: 'Юрист в прошлом, свитчер в настоящем',
      listTitle: 'Хочу учить фронтенд, потому что:',
      listItem1: 'Это интересно',
      listItem2: 'Хочу эффективно использовать свои способности',
      listItem3: 'Хочу качественных карьерных перемен',
      numTitle: 'Мой контактный телефон',
      num: '+380636284469',
      fbTitle: 'Мой профиль в Facebook',
      link: 'fb.com',
      feedbackTitle: 'Мой фидбек:',
      feedback: 'Могу все на свете - лишь бы было вдохновение :)'
    }
  ];

  var content = tmpl(html, {
    data: personalInfo
  });

  $('body').append(content);
});

var tmpl2 = document.getElementById('tmpl-lodash-profile').innerHTML;

var result = _.template(tmpl2)({
name: 'Лукьянец Дарья',
descr: 'Юрист в прошлом, свитчер в настоящем',
listTitle: 'Хочу учить фронтенд, потому что:',
items: [
  "Это интересно",
  "Хочу эффективно использовать свои способности",
  "Хочу качественных карьерных перемен"
],
numTitle: 'Мой контактный телефон',
num: '+380636284469',
fbTitle: 'Мой профиль в Facebook',
link: 'fb.com',
feedbackTitle: 'Мой фидбек:',
feedback: 'Могу все на свете - лишь бы было вдохновение :)'
});

document.body.insertAdjacentHTML("beforeEnd", result);
