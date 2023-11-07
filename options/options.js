import { loadOptionsData } from "./loadOptionsData.js";

const $ = document.querySelector.bind(document);

document.addEventListener("DOMContentLoaded", async () => {
  const debouncedSaveOptions = debounced(saveOptions, 1000);
  
  await loadOptions();

  $("#startTime").onchange = () => debouncedSaveOptions();
  $("#endTime").onchange = () => debouncedSaveOptions();
});

async function loadOptions() {
  const { startTime, endTime } = await loadOptionsData();

  console.debug("Loading options", startTime, endTime);
    
  $("#startTime").value = startTime;
  $("#endTime").value = endTime;
}

async function saveOptions() {
  const startTime = $("#startTime").value;
  const endTime = $("#endTime").value;

  console.debug("Saving options", startTime, endTime);

  await chrome.storage.sync.set({ startTime, endTime });

  const status = $("#status");
  status.textContent = 'Options saved.';
  setTimeout(() => { status.textContent = ""; }, 2000);
}

function debounced(fn, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }
}