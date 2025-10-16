// Initialize speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const colors = ['green', 'blue', 'red', 'yellow', 'black', 'white'];
const messages = [
  'The mind is all yours',
  'The marks of a rational person: self-awareness,self-examination and self-determination.',
  'Life is a battlefield.',
  'Stay focused on the present.',
  'Anything can be an advantage.',
  'Words cannot be unsaid.',
  'Revenge is a dish best not served.',
];
const recOutput = document.getElementById('rec-results');
const recDisplay = document.getElementById('rec-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

// allow results continuity
recognition.continuous = true;
// set language
recognition.lang = 'en-US';
// return final/interim res
recognition.interimResults = false;
// nber of alternative potential mathces
recognition.maxAlternatives = 1;

function record() {
  startBtn.classList.add('click');
  startBtn.innerText = 'Listening...';
  recognition.start();
}

function stopRecord() {
  startBtn.classList.remove('click');
  startBtn.innerText = 'Start Listening';
  recognition.stop();
}

function handleResults(recognition) {
  for (let i = 0; i < recognition.results.length; i++) {
    const output = recognition.results[i][0].transcript.toLowerCase().trim();
    if (colors.includes(output)) {
      recOutput.style.backgroundColor = output;
      recDisplay.style.backgroundColor = output;
      recDisplay.innerText = `your selected background color is ${output}`;
      console.log(output);
      const message = messages[Math.floor(Math.random() * messages.length)];
      recDisplay.innerHTML = `<h3>${message}</h3>`;
    } else {
      recDisplay.innerHTML = '<h3>please say a valid color.</h3>';
    }
  }
  console.log(recognition.results.length);
}

recognition.onresult = (e) => handleResults(e);

startBtn.addEventListener('click', record);
stopBtn.addEventListener('click', stopRecord);

// Speech synthesis
// TODO: Pitch, Rate functions - Pause - change accent -Resume
// Initialize
const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-select');
const textInput = document.getElementById('text-input');
let voices;
let utterance;
// get voices

function addVoicesToSelect() {
  voices = synth.getVoices();
  //console.log(speechSynthesis.getVoices());
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = `${voices[i].name}`;

    if (voices[i].default) {
      option.textContent += ' - DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

function setVoice() {
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute('data-name');
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterance.voice = voices[i];
    }
  }
  console.log(utterance.voice);
}
const onSubmit = (e) => {
  e.preventDefault();
  // Create utterance
  utterance = new SpeechSynthesisUtterance(textInput.value);
  setVoice();
  synth.speak(utterance);
};

// add voice options to select when event is fired
synth.onvoiceschanged = addVoicesToSelect;

// Pause and Resume Speech
const pauseSpeech = () => {
  if (!synth.speaking) {
    return;
  }
  if (!synth.paused) {
    pauseBtn.innerText = 'Resume';
    synth.pause();
  } else {
    pauseBtn.innerText = 'Pause';
    synth.resume();
  }
};
const cancelUtterance = () => {
  synth.cancel();
  pauseBtn.innerText = 'Pause';
  textInput.value = '';
};
const pauseBtn = document.getElementById('pause-btn');
const clearBtn = document.getElementById('clear-btn');
pauseBtn.addEventListener('click', pauseSpeech);
clearBtn.addEventListener('click', cancelUtterance);
document.getElementById('form').addEventListener('submit', onSubmit);
synth.addEventListener('voiceschanged', (event) => {
  console.log('voice changed');
});
