const SPEED_BUTTONS_OUTER_DIV_ID = 'speed-buttons-outerdiv-id';
const YOUTUBE_INJECT_DIV_CLASSNAME = 'ytp-right-controls';
const SPEED_BUTTONS_TEMPLATE_OUTER_DIV_CLASSNAME = 'btn-speed-container';
const YOUTUBE_SETTINGS_BUTTON_QUERY = 'button[data-tooltip-target-id="ytp-settings-button"]';
const YOUTUBE_SETTINGS_PANEL_CLASSNAME = 'ytp-panel-menu';
const YOUTEBE_VIDEO_PLAYER_CLASSNAME = 'video-stream html5-main-video';
const SELECTED_BTN_BG_COLOR = '#717171';
const SESSION_STORAGE_PLAYBACK_RATE_KEY = 'yt-player-playback-rate';
const RENDER_INTERVAL_MS = 5;

function doSomething() {
  chrome.runtime.onMessage.addListener((message) => {
    //url change listener
    if (message.action === 'urlChanged') {
      injectYoutubeTemplate();
    }
  });
  injectYoutubeTemplate();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', doSomething);
} else {
  doSomething();
}

function injectYoutubeTemplate() {
  if (document.getElementById(SPEED_BUTTONS_OUTER_DIV_ID)) {
    document.getElementById(SPEED_BUTTONS_OUTER_DIV_ID).remove();
  }

  var outerDiv = document.createElement('div');
  outerDiv.id = SPEED_BUTTONS_OUTER_DIV_ID;
  let tempEl = document.getElementsByClassName(YOUTUBE_INJECT_DIV_CLASSNAME)[0];
  tempEl.insertBefore(outerDiv, tempEl.children[4]);
  fetchContentTemplate();

  let checkRenderedInterval = setInterval(() => {
    let el = document.getElementsByClassName(SPEED_BUTTONS_TEMPLATE_OUTER_DIV_CLASSNAME)[0];
    if (el != undefined || el != null) {
      handleBtnClick('0.25');
      handleBtnClick('0.50');
      handleBtnClick('0.75');
      handleBtnClick('1.00');
      handleBtnClick('1.25');
      handleBtnClick('1.50');
      handleBtnClick('1.75');
      handleBtnClick('2.00');
      clearInterval(checkRenderedInterval);
    }
  }, RENDER_INTERVAL_MS);
}

function handleBtnClick(btnId) {
  if (document.getElementById(btnId)) {
    document.getElementById(btnId).addEventListener('click', function () {
      let checkBtnSettingsRendered = setInterval(() => {
        let btnSettings = document.querySelector(YOUTUBE_SETTINGS_BUTTON_QUERY);

        if (btnSettings != undefined || btnSettings != null) {
          btnSettings.click();
          // console.log("btnSettings clicked!");
          let checkBtnSettingsPopupRendered = setInterval(() => {
            let btnSettingsPopup = document.getElementsByClassName(YOUTUBE_SETTINGS_PANEL_CLASSNAME)[0];

            if (btnSettingsPopup != undefined || btnSettingsPopup != null) {
              btnSettingsPopup.click();
              // console.log("btnSettingsPopup clicked!", btnSettingsPopup);

              let checkBtnPlaybackSpeedRendered = setInterval(() => {
                // find playbackSpeed button as order (i don't want to deal with
                // language spesifications)
                let btnPlaybackSpeed = btnSettingsPopup.children[btnSettingsPopup.childElementCount - 3];

                if (btnPlaybackSpeed != undefined || btnPlaybackSpeed != null) {
                  btnPlaybackSpeed.click();
                  // console.log("btnPlaybackSpeed clicked!", btnPlaybackSpeed);

                  let checkBtnPlaybackSpeedPopupRendered = setInterval(() => {
                    let btnPlaybackSpeedPopup = document.getElementsByClassName(YOUTUBE_SETTINGS_PANEL_CLASSNAME)[1];
                    if (btnPlaybackSpeedPopup != undefined || btnPlaybackSpeedPopup != null) {
                      // console.log("btnPlaybackSpeedPopup !", btnPlaybackSpeedPopup);
                      let btnSpeed = null;
                      if (btnId == '0.25') {
                        btnSpeed = btnPlaybackSpeedPopup.children[0];
                      } else if (btnId == '0.50') {
                        btnSpeed = btnPlaybackSpeedPopup.children[1];
                      } else if (btnId == '0.75') {
                        btnSpeed = btnPlaybackSpeedPopup.children[2];
                      } else if (btnId == '1.00') {
                        btnSpeed = btnPlaybackSpeedPopup.children[3];
                      } else if (btnId == '1.25') {
                        btnSpeed = btnPlaybackSpeedPopup.children[4];
                      } else if (btnId == '1.50') {
                        btnSpeed = btnPlaybackSpeedPopup.children[5];
                      } else if (btnId == '1.75') {
                        btnSpeed = btnPlaybackSpeedPopup.children[6];
                      } else if (btnId == '2.00') {
                        btnSpeed = btnPlaybackSpeedPopup.children[7];
                      }
                      if (btnSpeed) {
                        btnSpeed.click();
                        let videoEl = document.getElementsByClassName(YOUTEBE_VIDEO_PLAYER_CLASSNAME)[0];
                        videoEl.click();
                        let speedButtons = document.getElementsByClassName(
                          SPEED_BUTTONS_TEMPLATE_OUTER_DIV_CLASSNAME,
                        )[0];
                        if (speedButtons) {
                          [...speedButtons.children].forEach((el) => {
                            // console.log("el:", el);
                            if (el.id != btnId) {
                              el.style.background = 'white';
                              el.style.color = 'black';
                            }
                          });
                        }

                        let mySpeedBtn = document.getElementById(btnId);
                        if (mySpeedBtn) {
                          // console.log("mySpeedBtn")
                          mySpeedBtn.style.background = SELECTED_BTN_BG_COLOR;
                          mySpeedBtn.style.color = 'white';
                        }
                      }
                      clearInterval(checkBtnPlaybackSpeedPopupRendered);
                    }
                  }, RENDER_INTERVAL_MS);
                  clearInterval(checkBtnPlaybackSpeedRendered);
                }
              }, RENDER_INTERVAL_MS);
              clearInterval(checkBtnSettingsPopupRendered);
            }
          }, RENDER_INTERVAL_MS);
          clearInterval(checkBtnSettingsRendered);
        }
      }, RENDER_INTERVAL_MS);
    });
  }
}

function fetchContentTemplate() {
  fetch(chrome.runtime.getURL('speedButtons.html'))
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(SPEED_BUTTONS_OUTER_DIV_ID).innerHTML = data;
      //set css to button as playback speed
      let playbackSpeedData = sessionStorage.getItem(SESSION_STORAGE_PLAYBACK_RATE_KEY);
      let playbackSpeed = '1.00';
      if (playbackSpeedData) {
        playbackSpeed = JSON.parse(playbackSpeedData).data;
      }
      let psLength = [...playbackSpeed].length;
      if (psLength == 1) {
        playbackSpeed = playbackSpeed + '.00';
      } else if (psLength == 3) {
        playbackSpeed = playbackSpeed + '0';
      }
      // console.log("playbackspeed : ", playbackSpeed);
      let mySpeedBtn = document.getElementById(playbackSpeed);
      let checkMySpeedBtnRendered = setInterval(() => {
        if (mySpeedBtn != undefined || mySpeedBtn != null) {
          // console.log("mySpeedBtn : ", mySpeedBtn);
          mySpeedBtn.style.background = SELECTED_BTN_BG_COLOR;
          mySpeedBtn.style.color = 'white';
          clearInterval(checkMySpeedBtnRendered);
        }
      }, RENDER_INTERVAL_MS);
    })
    .catch((err) => {
      console.log(err);
    });
}
