const inputText = document.getElementById("inputText");
const summaryOutput = document.getElementById("summaryOutput");
const summarizeBtn = document.getElementById("summarizeBtn");
const speakBtn = document.getElementById("speakBtn");
const startVoice = document.getElementById("startVoice");

summarizeBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    alert("Please enter or speak some text.");
    return;
  }

  summaryOutput.textContent = "Summarizing...";

  try {
    const res = await fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    summaryOutput.textContent = data.summary || "Failed to summarize.";
  } catch (err) {
    summaryOutput.textContent = "Error contacting summarizer server.";
    console.error(err);
  }
});

// Text to speech
speakBtn.addEventListener("click", () => {
  const summary = summaryOutput.textContent;
  if (!summary) {
    alert("No summary to read.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(summary);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
});

// Voice input
startVoice.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Sorry, your browser does not support Speech Recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    inputText.value += " " + transcript;
  };

  recognition.onerror = function(event) {
    alert("Speech recognition error: " + event.error);
  };
});
