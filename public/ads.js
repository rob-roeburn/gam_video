var videoContent = document.getElementById('contentElement');
var adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'),videoContent);
adDisplayContainer.initialize();
var adsLoader = new google.ima.AdsLoader(adDisplayContainer);

adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,onAdsManagerLoaded,false);
adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,onAdError,false);

function onAdError(adErrorEvent) {
  console.log(adErrorEvent.getError());
  adsManager.destroy();
}

var playing = false;
var status =  "Not started";

var contentEndedListener = function() {adsLoader.contentComplete();};
videoContent.onended = contentEndedListener;

var adsRequest = new google.ima.AdsRequest();
adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
adsRequest.linearAdSlotWidth = 640;
adsRequest.linearAdSlotHeight = 400;
adsRequest.nonLinearAdSlotWidth = 640;
adsRequest.nonLinearAdSlotHeight = 150;

var playButton = document.getElementById('playButton');
playButton.addEventListener('click', requestAds);

var pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseAd);

var pauseButton = document.getElementById('reloadButton');
pauseButton.addEventListener('click', reloadA);

function reloadA() {
  location.reload();
}

var userMessages = {
  "LOADED" : "Ready to play...",
  "CLICK" : "Ad clicked!",
  "STARTED" : "Off we go!",
  "FIRST_QUARTILE" : "The fun's only just getting started!",
  "MIDPOINT" : "Halfway there!",
  "THIRD_QUARTILE" : "Nearly there!",
  "COMPLETE" : "Well done for watching to the end, have a bonus popup",
  "ALL_ADS_COMPLETED" : "All finished!"
};

function requestAds() {
  playing=true;
  adsLoader.requestAds(adsRequest);
}

function pauseAd() {
  if (playing) {
    adsManager.pause()
    playing=false;
  } else {
    adsManager.resume()
    playing=true;
    document.getElementById('statusdiv').innerHTML = status;
  }
}

function updateDisplay(status) {
  document.getElementById('statusdiv').innerHTML = status;
  document.getElementById('usermessage').innerHTML = userMessages[status];
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  adsManager = adsManagerLoadedEvent.getAdsManager(videoContent);
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,onAdError);
  adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,  function () { videoContent.removeEventListener('ended', contentEndedListener); videoContent.pause(); });
  adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () { videoContent.addEventListener('ended', contentEndedListener); videoContent.play(); });
  adsManager.addEventListener(google.ima.AdEvent.Type.CLICK,                    function () { status="CLICK";             updateDisplay(status); });
  adsManager.addEventListener(google.ima.AdEvent.Type.LOADED,                   function () { status="LOADED";            updateDisplay(status); });
  adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE,           function () { status="FIRST_QUARTILE";    updateDisplay(status); });
  adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT,                 function () { status="MIDPOINT";          updateDisplay(status); });
  adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE,           function () { status="THIRD_QUARTILE";    updateDisplay(status); });
  adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED,        function () { status="ALL_ADS_COMPLETED"; updateDisplay(status); document.getElementById('pauseButton').style.display="none"; document.getElementById('reloadButton').style.display="block";});
  adsManager.addEventListener(google.ima.AdEvent.Type.STARTED,                  function () { status="STARTED";           updateDisplay(status); document.getElementById('playButton').style.display="none"; document.getElementById('pauseButton').style.display="block"; });
  adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE,                 function () { status="COMPLETE";          updateDisplay(status); window.alert(userMessages[status]); });
  adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED,                   function () { document.getElementById('statusdiv').innerHTML = "PAUSED"; });

  try {
    adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    videoContent.play();
  }
}
