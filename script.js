let video = document.querySelector("video");
let recordBtnContainer = document.querySelector(".record-btn-container");
let recordBtn = document.querySelector(".record-btn");
let captureBtnContainer = document.querySelector(".capture-btn-container");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let constraints = {
  video: true,
  audio: false,
};

let recorder;
let chunks = [];

let recorderFlag = false;

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", () => {
    chunks = [];
  });

  recorder.addEventListener("dataavailable", (event) => {
    chunks.push(event.data);
  });

  recorder.addEventListener("stop", () => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    let videoUrl = URL.createObjectURL(blob);

    let anchorEl = document.createElement("a");
    anchorEl.href = videoUrl;
    anchorEl.download = "stream.mp4";
    anchorEl.click();
  });

  recordBtnContainer.addEventListener("click", () => {
    if (!recorder) return;
    recorderFlag = !recorderFlag;
    if (recorderFlag) {
      recorder.start();
      recordBtn.classList.add("scale-record");
      startTimer();
    } else {
      recorder.stop();
      recordBtn.classList.remove("scale-record");
      stopTimer();
    }
  });
});

captureBtnContainer.addEventListener("click", () => {
  captureBtn.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");

  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageUrl = canvas.toDataURL("image/jpeg");

  let anchorEl = document.createElement("a");
  anchorEl.href = imageUrl;
  anchorEl.download = "image.jpeg";
  anchorEl.click();

  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
});

let filter = document.querySelector(".filter-layer");

let getAllFilter = document.querySelectorAll(".filter");
getAllFilter.forEach((eachItem) => {
  eachItem.addEventListener("click", () => {
    transparentColor =
      getComputedStyle(eachItem).getPropertyValue("background-color");
    filter.style.backgroundColor = transparentColor;
  });
});

let timerId;
let counter = 0;
let timer = document.querySelector(".timer");

function startTimer() {
  counter = 0;
  timer.style.display = "block";

  function displayTimer() {
    let totalSeconds = counter;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerHTML = `${hours}:${minutes}:${seconds}`;
    counter++;
  }

  timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timer.innerHTML = "00:00:00";
  timer.style.display = "none";
}
