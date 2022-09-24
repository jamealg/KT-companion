dayjs.extend(dayjs_plugin_duration)

class SimpleStore {
  constructor() {
    this.store = {};
  }

  get(key) {
    let item = this.store[key];
    if(!item) {
      item = localStorage.getItem(key);
      this.store[key] = item;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }

  set(key,val) {
    if(typeof val == "object") {
      let newVal = JSON.stringify(val);
      this.store[key] = newVal;
      localStorage.setItem(key, newVal);
    } else if(typeof val !== "string") {
      this.store[key] = val;
      localStorage.setItem(key, val);
    } else {
      console.error("Store only takes strings or objects. Got: ", typeof val)
    }
  }

  unset(key) {
    delete this.store[key];
  }
}
let store = new SimpleStore()

// Const
const headerFormat = 'dddd, MMMM DD';
const eventFormat = 'h:mm A';
const rowDataTpl = {
  event: "begin",
  latlng: "",
  date: dayjs(),
};
const rowTpl = (label, row1, row2) => {
  if(row1 && row2) {
    return rowTpl2(label, row1, row2);
  } else {
    return rowTpl1(label, row1);
  }
}
const rowTpl1 = (label, row) => (`
  <li class="events__row">
    <div class="events__row__label">${label}</div>
    <div class="events__row__val">${dayjs(row.date).format(eventFormat)}</div>
  </li>
`);
const rowTpl2 = (label, row1, row2) => (`
  <li class="events__row">
    <div class="events__row__label">${label}</div>
    <div class="events__row__val">
      ${dayjs(row1.date).format(eventFormat)} - ${dayjs(row2.date).format(eventFormat)}
      (${dayjs.duration(dayjs(row2.date).diff(row1.date)).format('HH:mm:ss')})
    </div>
  </li>
`);

// Elements
let $h = document.querySelector('h2');
let $prevBtn = document.querySelector('[data-previous-btn]');
let $nextBtn = document.querySelector('[data-next-btn]');

let $eventsTable = document.querySelector('[data-events-table]');
let $estimateRow = document.querySelector('[data-estimate-row]');
let $paceRow = document.querySelector('[data-pace-row]');

let $beginBtn = document.querySelector('[data-begin-btn]');
let $pauseBtn = document.querySelector('[data-pause-btn]');
let $resumeBtn = document.querySelector('[data-resume-btn]');
let $endBtn = document.querySelector('[data-end-btn]');
let $resetBtn = document.querySelector('[data-reset-btn]');

let $hikeTime = document.querySelector('[data-hike-time]');
let $breaksTime = document.querySelector('[data-breaks-time]');
let $totalTime = document.querySelector('[data-total-time]');

let $overallPace = document.querySelector('[data-overall-pace]');
let $hikingPace = document.querySelector('[data-hiking-pace]');
let $estCompletionOverall = document.querySelector('[data-est-completion-overall]');
let $estCompletionHiking = document.querySelector('[data-est-completion-hiking]');

let $milesHikedInput = document.querySelector('[data-miles-hiked-input]');
let $milesRemainingInput = document.querySelector('[data-miles-remaining-input]');

// Global State
let day = dayjs();
let dayKey = day.format(headerFormat);
let opData = [];

// Controls
$nextBtn.addEventListener('click', () => {
  day = day.add('1', 'day');
  changeDay(day);
});
$prevBtn.addEventListener('click', () => {
  day = day.add('-1', 'day');
  changeDay(day);
});
$beginBtn.addEventListener('click', () => {
  applyEvent('begin');
})
$pauseBtn.addEventListener('click', () => {
  applyEvent('pause');
})
$resumeBtn.addEventListener('click', () => {
  applyEvent('resume');
})
$endBtn.addEventListener('click', () => {
  applyEvent('end');
})
$resetBtn.addEventListener('click', () => {
  if(confirm("R u sure?")) {
    opData = [];
    store.set(dayKey, opData);
    populateTable(opData);
    updateControls();
    updateStats();
  }
})

// Fns
function applyEvent(event) {
  opData.push({
    event,
    latlng: null,
    date: dayjs(),
  });
  store.set(dayKey, opData);
  populateTable(opData);
  updateControls();
  updateStats();
}

function changeDay(newDate) {
  dayKey = newDate.format(headerFormat);
  $h.innerText = dayKey;

  opData = store.get(dayKey) || [];
  if(opData.length) {
    console.log('Found', opData);
    populateTable(opData);
  } else {
    // No data found
    resetTable();
  }
  updateControls();
  updateStats();
}

function resetTable() {
  $eventsTable.innerHTML = `
    <li class="events__row" style="justify-content: center; padding-top: 2em; padding-bottom: 2em;">
      No records yet.
    </li>
  `;
}

function populateTable(data) {
  let rowsHtml = "";
  for(let i=0; i<data.length; i++) {
    let { event } = data[i];
    if(event === "begin") {
      let nextEntry = data[i+1];
      rowsHtml += rowTpl("Hiking", data[i], nextEntry);

    } else if(event === "pause") {
      let nextEntry = data[i+1];
      rowsHtml += rowTpl("Resting", data[i], nextEntry);

    } else if(event === "resume") {
      let nextEntry = data[i+1];
      rowsHtml += rowTpl("Hiking", data[i], nextEntry);

    } else if(event === "end") {
      let prevEntry = data[i-1];
      rowsHtml += rowTpl("Hiking", prevEntry, data[i]);
    }
  }
  $eventsTable.innerHTML = rowsHtml;
}

function updateControls() {
  let lastEvent = opData[opData.length-1];
  if(lastEvent) {
    switch(lastEvent.event) {
      case "begin":
        $beginBtn.style.display = "none";
        $pauseBtn.style.display = "inline-block";
        $resumeBtn.style.display = "none";
        $endBtn.style.display = "inline-block";
        break;
      case "pause":
        $beginBtn.style.display = "none";
        $pauseBtn.style.display = "none";
        $resumeBtn.style.display = "inline-block";
        $endBtn.style.display = "none";
        break;
      case "resume":
        $beginBtn.style.display = "none";
        $pauseBtn.style.display = "inline-block";
        $resumeBtn.style.display = "none";
        $endBtn.style.display = "inline-block";
        break;
      case "end":
        $beginBtn.style.display = "none";
        $pauseBtn.style.display = "none";
        $resumeBtn.style.display = "none";
        $endBtn.style.display = "none";
        break;
    }
  } else {
    $beginBtn.style.display = "inline-block";
    $pauseBtn.style.display = "none";
    $resumeBtn.style.display = "none";
    $endBtn.style.display = "none"; 
  }

  if(opData.length > 1 && lastEvent !== "end") {
    $estimateRow.style.display = "block";
  } else {
    $estimateRow.style.display = "none";
  }
  if(opData.length > 1) {
    $paceRow.style.display = "block";
  } else {
    $paceRow.style.display = "none";
  }
}

function updateStats() {
  let events = opData;
  let totalSeconds = 0;;
  let hikeSeconds = 0;
  let breakSeconds = 0;
  if(events.length > 1) {
    totalSeconds = dayjs(events[events.length-1].date).diff(events[0].date);
    $totalTime.innerText = dayjs.duration(totalSeconds).format('HH:mm:ss');
    
    let lastDate = events[0].date;
    for(let i=1; i<events.length; i++) {
      let event = events[i];
      let secs = dayjs(dayjs(event.date)).diff(lastDate);
      lastDate = event.date;
      if(event.event === 'pause' || event.event === 'end') {
        // All the time before this was hiking
        hikeSeconds += secs;
      } else if(event.event === 'resume') {
        // All the time before this was pausing
        breakSeconds += secs;
      }
    }
    $hikeTime.innerText = dayjs.duration(hikeSeconds).format('HH:mm:ss');
    $breaksTime.innerText = dayjs.duration(breakSeconds).format('HH:mm:ss');
  } else {
    $hikeTime.innerText = "N/A";
    $breaksTime.innerText = "N/A";
    $totalTime.innerText = "N/A";
  }

  // Pace
  let milesHiked = $milesHikedInput.value
  let overallPaceMph = (milesHiked / (totalSeconds/1000/60/60)).toFixed(2);
  let overallPace = ((totalSeconds/1000/60)/milesHiked).toFixed(2);
  $overallPace.innerText = `${overallPace} min/mile (${overallPaceMph}mph)`;
  let hikingPaceMph = (milesHiked / (hikeSeconds/1000/60/60)).toFixed(2);
  let hikingPace = ((hikeSeconds/1000/60)/milesHiked).toFixed(2);
  $hikingPace.innerText = `${hikingPace} min/mile (${hikingPaceMph}mph)`;

  // Time estimates
  let milesRemaining = $milesRemainingInput.value;
  let minsLeftOverall = milesRemaining * overallPace;
  let minsLeftHiking = milesRemaining * hikingPace;
  $estCompletionOverall.innerText = `${dayjs().add(minsLeftOverall, 'minutes').format(eventFormat)} (${(minsLeftOverall/60).toFixed(1)} hours)`;
  $estCompletionHiking.innerText = `${dayjs().add(minsLeftHiking, 'minutes').format(eventFormat)} (${(minsLeftHiking/60).toFixed(1)} hours)`;
}

$milesHikedInput.addEventListener('change', updateStats);
$milesRemainingInput.addEventListener('change', updateStats);


// Init with today's date
function init() {
  changeDay(dayjs());
}
init();
