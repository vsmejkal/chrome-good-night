import { loadOptionsData } from "./options/loadOptionsData.js";

let options = {};

const css = `
body {
  filter: grayscale(1) !important;
}
`;

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await loadOptions();
  grayTabAtNight(tabId); 
})

chrome.tabs.onUpdated.addListener(async (tabId) => {
  await loadOptions();
  grayTabAtNight(tabId); 
})

chrome.storage.onChanged.addListener(() => {
  options = {};
})

async function loadOptions() {
  if (Object.keys(options).length === 0) {
    options = await loadOptionsData();
  }
}

function grayTabAtNight(tabId) {
  removeCSS(tabId);

  if (isNight()) {
    insertCSS(tabId);
  }
}

async function insertCSS(tabId) {
  try {
    await chrome.scripting.insertCSS({
      css,
      target: {
        tabId: tabId,
        allFrames: true
      }
    });
  } catch {
    // Cannot access a chrome:// URL
  }
}

async function removeCSS(tabId) {
  try {
    await chrome.scripting.removeCSS({
      css,
      target: {
        tabId: tabId,
        allFrames: true
      }
    });
  } catch {
    // Cannot access a chrome:// URL
  }
}

function isNight() {
  const start = makeDateFromTimeValue(options.startTime);
  const end = makeDateFromTimeValue(options.endTime);
  const current = new Date();
  
  if (start < end) {
    // end is today
    return current >= start && current <= end;
  } else {
    // end is tomorrow
    return current >= start || current <= end;
  }
}

function makeDateFromTimeValue(timeValue) {
  const date = new Date();
  const [hours, minutes] = timeValue.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}