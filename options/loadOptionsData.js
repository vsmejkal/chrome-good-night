export function loadOptionsData() {
  return chrome.storage.sync.get({
    startTime: "22:00",
    endTime: "04:00"
  });
}
