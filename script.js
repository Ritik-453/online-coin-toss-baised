let recognition;
let listening = false;
let waitingForCall = false;
let callTimeout;

const coin = document.getElementById("coin");
const result = document.getElementById("result");

// 🎙️ Start listening immediately (hidden)
window.onload = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // Better for Indian accents
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;

  recognition.start();
  listening = true;

  recognition.onresult = (event) => {
    const text =
      event.results[event.results.length - 1][0]
        .transcript
        .toLowerCase();

    if (waitingForCall) {
      const call = extractCall(text);
      if (call) {
        clearTimeout(callTimeout);
        finishToss(call);
      }
    }
  };
};

// 🪙 Flip button
function startFlip() {
  result.textContent = "";
  waitingForCall = true;

  coin.classList.add("spin");

  // If no call in 6 seconds → random
  callTimeout = setTimeout(() => {
    const randomCall = Math.random() < 0.5 ? "Head" : "Tail";
    finishToss(randomCall, true);
  }, 6000);
}

// 🎧 Extract call from sentence
function extractCall(text) {
  if (
    text.includes("head") ||
    text.includes("heads") ||
    text.includes("bharat")
  ) return "Head";

  if (
    text.includes("tail") ||
    text.includes("tails") ||
    text.includes("rupyo")
  ) return "Tail";

  return null;
}

// 🎯 Final toss logic (9:1 bias hidden)
function finishToss(call, auto = false) {
  waitingForCall = false;

  setTimeout(() => {
    coin.classList.remove("spin");

    // Hidden 9:1 bias
    const callerWins = Math.random() < 0.1;

    let coinFace;
    if (callerWins) {
      coinFace = call;
    } else {
      coinFace = call === "Head" ? "Tail" : "Head";
    }

    coin.src =
      coinFace === "Head"
        ? "images/head.png"
        : "images/tail.png";

    result.innerHTML = `
      <strong>Call:</strong> ${auto ? "No call" : call}<br>
      <strong>Coin:</strong> ${coinFace}<br><br>
      <b>${callerWins ? "Caller wins the toss" : "Caller loses the toss"}</b>
    `;
  }, 1000);
}
