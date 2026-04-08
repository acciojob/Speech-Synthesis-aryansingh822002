// Your script here.
const msg = new SpeechSynthesisUtterance();
  let voices = [];
  const voicesDropdown = document.querySelector('[name="voice"]');
  const options = document.querySelectorAll('[type="range"], [name="text"]');
  const speakButton = document.querySelector('#speak');
  const stopButton = document.querySelector('#stop');

  // 1. Set the initial text from the textarea into our message object
  msg.text = document.querySelector('[name="text"]').value;

  function populateVoices() {
    // Get all voices available on the device/browser
    voices = speechSynthesis.getVoices();
    
    // Create <option> elements for each voice and add to dropdown
    voicesDropdown.innerHTML = voices
      .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
      .join('');
  }

  function setVoice() {
    // Find the voice object that matches the selected name in the dropdown
    msg.voice = voices.find(voice => voice.name === this.value);
    toggle(); // Restart speech if voice changes
  }

  function toggle(startOver = true) {
    // Cancel any current speech
    speechSynthesis.cancel();
    // Restart only if we want to (not for the stop button)
    if (startOver && msg.text.trim() !== "") {
      speechSynthesis.speak(msg);
    }
  }

  function setOption() {
    // 'this.name' will be "rate", "pitch", or "text"
    // We update the corresponding property on the SpeechSynthesisUtterance object
    msg[this.name] = this.value;
    toggle();
  }

  // EVENT LISTENERS

  // The 'voiceschanged' event is crucial because voices are loaded asynchronously
  speechSynthesis.addEventListener('voiceschanged', populateVoices);

  // When dropdown selection changes, update the voice
  voicesDropdown.addEventListener('change', setVoice);

  // When sliders move or text is typed, update the settings
  options.forEach(option => option.addEventListener('change', setOption));

  // Speak button: triggers the toggle
  speakButton.addEventListener('click', toggle);

  // Stop button: stops speech (passes false to prevent restart)
  stopButton.addEventListener('click', () => toggle(false));