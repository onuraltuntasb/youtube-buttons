
//url change sender
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		chrome.tabs.sendMessage(tabId, {
			action: "urlChanged",
			msg: tab.url,
		});
	}
});

