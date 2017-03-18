var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var clearBtn = document.getElementById('clear');

var watch = new Stopwatch(timer);


function start() {
  watch.start();
  toggleBtn.textContent = 'Pause';
}

function pause() {
  watch.pause();
  toggleBtn.textContent = 'Cont..';
}

toggleBtn.addEventListener('click', function() {
  (watch.isOn) ? pause() : start();
});

clearBtn.addEventListener('click', function() {
  watch.clear();
  toggleBtn.textContent = 'Start';
});
