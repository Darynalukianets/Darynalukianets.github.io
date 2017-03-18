var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var splitBtn = document.getElementById('split');
var outputList = [];
var resetBtn = document.getElementById('reset');
var container = document.getElementById('container');

var splitsContainer = document.createElement('div');
splitsContainer.setAttribute('id', 'splitsContainer');
container.appendChild(splitsContainer);

var watch = new Stopwatch(timer);

function start() {
  watch.start();
  toggleBtn.textContent = 'Stop';
  console.log(watch);
}

function stop() {
  watch.stop();
  toggleBtn.textContent = 'Start';
  var stopOutput = document.createElement('div');
  stopOutput.textContent = showStop();
  splitsContainer.appendChild(stopOutput);

  function showStop(elem) {
    elem = timer.innerHTML;
    outputList.push(elem);
    outputListLastItem = outputList[outputList.length - 1];

    return outputList.length + ' Stop: ' + outputListLastItem;
  }
}

toggleBtn.addEventListener('click', function() {
  (watch.isOn) ? stop() : start();
});

splitBtn.addEventListener('click', function() {
  var splitOutput = document.createElement('div');
  splitOutput.textContent = showSplit();
  splitsContainer.appendChild(splitOutput);

  function showSplit(elem) {
    elem = timer.innerHTML;
    outputList.push(elem);
    outputListLastItem = outputList[outputList.length - 1];

    return outputList.length + ' Split: ' + outputListLastItem;
  }
})

resetBtn.addEventListener('click', function() {
  watch.reset();
  toggleBtn.textContent = 'Start';
  outputList = [];
  splitsContainer.innerHTML = '';
});
