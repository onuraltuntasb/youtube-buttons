const SPEED_BUTTONS_OUTER_DIV_ID = 'speed-buttons-outerdiv-id';
const QUALITY_BUTTONS_OUTER_DIV_ID = 'quality-buttons-outerdiv-id';

const YOUTUBE_INJECT_DIV_CLASSNAME = 'ytp-right-controls';
const SPEED_BUTTONS_TEMPLATE_OUTER_DIV_CLASSNAME = 'btn-speed-container';
const YOUTUBE_SETTINGS_BUTTON_QUERY = 'button[data-tooltip-target-id="ytp-settings-button"]';
const YOUTUBE_SETTINGS_PANEL_CLASSNAME = 'ytp-panel-menu';
const YOUTEBE_VIDEO_PLAYER_CLASSNAME = 'video-stream html5-main-video';
const SELECTED_BTN_BG_COLOR = '#717171';
const SESSION_STORAGE_PLAYBACK_RATE_KEY = 'yt-player-playback-rate';
const LOCAL_STORAGE_QUALITY_RATE_KEY = 'yt-player-quality';

const RENDER_INTERVAL_MS = 5;
const YOUTUBE_MENU_ITEM_CLASSNAME = 'ytp-menuitem '; // there is one " " space char at the end of classname!
const YOUTUBE_MENU_ITEM_LABEL_CLASSNAME = 'ytp-menuitem-label';

function starter() {
    chrome.runtime.onMessage.addListener((message) => {
        //url change listener
        if (message.action === 'urlChanged') {
            injectYoutubeTemplate();
            injectYoutubeQualityButtons();
        }
    });
    injectYoutubeSpeedButtons();
    injectYoutubeQualityButtons();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doSomething);
} else {
    starter();
}

function injectYoutubeQualityButtons() {
    if (document.getElementById(QUALITY_BUTTONS_OUTER_DIV_ID)) {
        document.getElementById(QUALITY_BUTTONS_OUTER_DIV_ID).remove();
    }

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

                    let checkBtnQualityRendered = setInterval(() => {
                        // find Quality button as order (i don't want to deal with
                        // language spesifications)
                        let btnQuality = btnSettingsPopup.children[btnSettingsPopup.children.length - 1];

                        if (btnQuality != undefined || btnQuality != null) {
                            btnQuality.click();
                            // console.log("btnQuality clicked!", btnQuality);

                            let checkBtnQualityPopupRendered = setInterval(() => {
                                let btnQualityPopup = document.getElementsByClassName(
                                    YOUTUBE_SETTINGS_PANEL_CLASSNAME,
                                )[1];
                                if (btnQualityPopup != undefined || btnQualityPopup != null) {
                                    console.log('btnQualityPopup !', btnQualityPopup);
                                    //TODO: CREATE HTML AS QUALITY BUTTONS

                                    let btnQualityPopupArray = Array.from(btnQualityPopup.children).filter(
                                        (el) => el.className === YOUTUBE_MENU_ITEM_CLASSNAME,
                                    );

                                    btnQualityPopupArray.forEach((el) => {
                                        console.log('el :', el.children[0].children[0].children[0].innerHTML);
                                    });

                                    //inject quality buttons
                                    let btnQualityContainerEl = document.createElement('div');
                                    btnQualityContainerEl.className = 'btn-quality-container';
                                    btnQualityPopupArray.forEach((el) => {
                                        let btnQualityEl = document.createElement('button');
                                        btnQualityEl.classList = 'btn-quality';
                                        let tempInner =
                                            el.children[0].children[0].children[0].innerHTML.split(' <sup')[0];
                                        console.log('tempInner :', tempInner);
                                        btnQualityEl.id = tempInner;
                                        btnQualityEl.innerHTML = tempInner;

                                        btnQualityContainerEl.appendChild(btnQualityEl);
                                    });

                                    let insertPoint = document.getElementsByClassName(YOUTUBE_INJECT_DIV_CLASSNAME)[0];
                                    insertPoint.insertBefore(btnQualityContainerEl, insertPoint.children[4]);

                                    let qualityData = localStorage.getItem(LOCAL_STORAGE_QUALITY_RATE_KEY);
                                    let quality = '144';
                                    if (qualityData) {
                                        let qualityProperty = JSON.parse(qualityData).data;
                                        quality = JSON.parse(qualityProperty).quality;

                                        let myQualityBtn = document.getElementById(quality + 'p');
                                        console.log('myQualityBtn :', myQualityBtn);
                                        if (myQualityBtn != undefined || myQualityBtn != null) {
                                            myQualityBtn.style.background = SELECTED_BTN_BG_COLOR;
                                            myQualityBtn.style.color = 'white';
                                        }
                                    }

                                    let checkDynamicQualityButtonsRendered = setInterval(() => {
                                        if (document.getElementsByClassName('btn-quality-container')[0]) {
                                            btnQualityPopupArray.forEach((el) => {
                                                let tempInner =
                                                    el.children[0].children[0].children[0].innerHTML.split(' <sup')[0];
                                                handleQualityButtons(tempInner);
                                            });
                                            clearInterval(checkDynamicQualityButtonsRendered);
                                        }
                                    }, RENDER_INTERVAL_MS);

                                    //TODO: click to video
                                    let videoEl = document.getElementsByClassName(YOUTEBE_VIDEO_PLAYER_CLASSNAME)[0];
                                    let checkVideoElRendered = setInterval(() => {
                                        if (videoEl !== undefined && videoEl !== null) {
                                            videoEl.click();
                                            clearInterval(checkVideoElRendered);
                                        }
                                    }, RENDER_INTERVAL_MS);

                                    clearInterval(checkBtnQualityPopupRendered);
                                }
                            }, RENDER_INTERVAL_MS);
                            clearInterval(checkBtnQualityRendered);
                        }
                    }, RENDER_INTERVAL_MS);
                    clearInterval(checkBtnSettingsPopupRendered);
                }
            }, RENDER_INTERVAL_MS);
            clearInterval(checkBtnSettingsRendered);
        }
    }, RENDER_INTERVAL_MS);
}

function handleQualityButtons(btnId) {
    console.log('click');
    if (btnId) {
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

                            let checkBtnQualityRendered = setInterval(() => {
                                // find Quality button as order (i don't want to deal with
                                // language spesifications)
                                let btnQuality = btnSettingsPopup.children[btnSettingsPopup.children.length - 1];

                                if (btnQuality != undefined || btnQuality != null) {
                                    btnQuality.click();
                                    // console.log("btnQuality clicked!", btnQuality);

                                    let checkBtnQualityPopupRendered = setInterval(() => {
                                        let btnQualityPopup = document.getElementsByClassName(
                                            YOUTUBE_SETTINGS_PANEL_CLASSNAME,
                                        )[1];
                                        if (btnQualityPopup != undefined || btnQualityPopup != null) {
                                            console.log('btnQualityPopup !', btnQualityPopup);
                                            //TODO: CREATE HTML AS QUALITY BUTTONS

                                            let btnQualityPopupArray = Array.from(btnQualityPopup.children).filter(
                                                (el) => el.className === YOUTUBE_MENU_ITEM_CLASSNAME,
                                            );

                                            btnQualityPopupArray.forEach((el) => {
                                                console.log('el :', el.children[0].children[0].children[0].innerHTML);
                                            });

                                            let btnQuality = null;

                                            btnQuality = btnQualityPopupArray.find(
                                                (el) =>
                                                    el.children[0].children[0].children[0].innerHTML.split(
                                                        ' <sup',
                                                    )[0] === btnId,
                                            );
                                            btnQuality.click();

                                            let videoEl =
                                                document.getElementsByClassName(YOUTEBE_VIDEO_PLAYER_CLASSNAME)[0];
                                            videoEl.click();
                                            //TODO: change style of selected btn
                                            let myQualityBtn = document.getElementById(btnId);
                                            if (myQualityBtn != undefined || myQualityBtn != null) {
                                                // console.log("myQualityBtn : ", myQualityBtn);
                                                myQualityBtn.style.background = SELECTED_BTN_BG_COLOR;
                                                myQualityBtn.style.color = 'white';
                                            }

                                            clearInterval(checkBtnQualityPopupRendered);
                                        }
                                    }, RENDER_INTERVAL_MS);
                                    clearInterval(checkBtnQualityRendered);
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

function injectYoutubeSpeedButtons() {
    // SPEED BUTTONS //
    if (document.getElementById(SPEED_BUTTONS_OUTER_DIV_ID)) {
        document.getElementById(SPEED_BUTTONS_OUTER_DIV_ID).remove();
    }

    var outerDiv = document.createElement('div');
    outerDiv.id = SPEED_BUTTONS_OUTER_DIV_ID;
    let tempEl = document.getElementsByClassName(YOUTUBE_INJECT_DIV_CLASSNAME)[0];
    tempEl.insertBefore(outerDiv, tempEl.children[4]);
    fetchSpeedButtonsTemplate();

    let checkRenderedInterval = setInterval(() => {
        let el = document.getElementsByClassName(SPEED_BUTTONS_TEMPLATE_OUTER_DIV_CLASSNAME)[0];
        if (el != undefined || el != null) {
            handleSpeedBtnClick('0.25');
            handleSpeedBtnClick('0.50');
            handleSpeedBtnClick('0.75');
            handleSpeedBtnClick('1.00');
            handleSpeedBtnClick('1.25');
            handleSpeedBtnClick('1.50');
            handleSpeedBtnClick('1.75');
            handleSpeedBtnClick('2.00');
            clearInterval(checkRenderedInterval);
        }
    }, RENDER_INTERVAL_MS);
}

function handleSpeedBtnClick(btnId) {
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
                                let btnPlaybackSpeed =
                                    btnSettingsPopup.children[btnSettingsPopup.childElementCount - 3];

                                if (btnPlaybackSpeed != undefined || btnPlaybackSpeed != null) {
                                    btnPlaybackSpeed.click();
                                    // console.log("btnPlaybackSpeed clicked!", btnPlaybackSpeed);

                                    let checkBtnPlaybackSpeedPopupRendered = setInterval(() => {
                                        let btnPlaybackSpeedPopup = document.getElementsByClassName(
                                            YOUTUBE_SETTINGS_PANEL_CLASSNAME,
                                        )[1];
                                        if (btnPlaybackSpeedPopup != undefined || btnPlaybackSpeedPopup != null) {
                                            // console.log("btnPlaybackSpeedPopup !", btnPlaybackSpeedPopup);

                                            let btnPlaybackSpeedPopupArray = Array.from(
                                                btnPlaybackSpeedPopup.children,
                                            ).filter((el) => el.className === YOUTUBE_MENU_ITEM_CLASSNAME);

                                            let btnSpeed = null;
                                            if (btnId == '0.25') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '0.25') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });

                                                // btnSpeed = btnPlaybackSpeedPopup.children[1];
                                            } else if (btnId == '0.50') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '0.50' || ch.innerHTML === '0.5') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '0.75') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '0.75') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '1.00') {
                                                console.log('btnplaybakcspeed 1.0 :', btnPlaybackSpeedPopupArray);
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (
                                                            ch.innerHTML === 'Normal' ||
                                                            ch.innerHTML === '1.00' ||
                                                            ch.innerHTML === '1.0' ||
                                                            ch.innerHTML === '1'
                                                        ) {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '1.25') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '1.25') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '1.50') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '1.50' || ch.innerHTML === '1.5') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '1.75') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (ch.innerHTML === '1.75') {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            } else if (btnId == '2.00') {
                                                btnPlaybackSpeedPopupArray.forEach((el) => {
                                                    let ch = el.children[0];
                                                    if (ch.className === YOUTUBE_MENU_ITEM_LABEL_CLASSNAME) {
                                                        if (
                                                            ch.innerHTML === '2.00' ||
                                                            ch.innerHTML === '2.0' ||
                                                            ch.innerHTML === '2'
                                                        ) {
                                                            btnSpeed = el;
                                                        }
                                                    }
                                                });
                                            }
                                            if (btnSpeed) {
                                                btnSpeed.click();
                                                let videoEl =
                                                    document.getElementsByClassName(YOUTEBE_VIDEO_PLAYER_CLASSNAME)[0];
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

function fetchSpeedButtonsTemplate() {
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

// function fetchQualityButtonsTemplate() {
//     fetch(chrome.runtime.getURL('qualityButtons.html'))
//         .then((response) => response.text())
//         .then((data) => {
//             document.getElementById(QUALITY_BUTTONS_OUTER_DIV_ID).innerHTML = data;
//             //set css to button as playback Quality
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }
