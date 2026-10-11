// Classroom Organizer - Background Service Worker

chrome.action.onClicked.addListener((tab) => {
  const isClassroom = tab?.url?.startsWith("https://classroom.google.com/");
  if (!isClassroom) {
    chrome.tabs.create({ url: "https://classroom.google.com/" });
  }
});
