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

function requestAds() {
  adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  adsManager = adsManagerLoadedEvent.getAdsManager(videoContent);
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,onAdError);
  adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,onContentPauseRequested);
  adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,onContentResumeRequested);
  try {
    adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    videoContent.play();
  }
}

function onContentPauseRequested() {
  videoContent.removeEventListener('ended', contentEndedListener);
  videoContent.pause();
}

function onContentResumeRequested() {
  videoContent.addEventListener('ended', contentEndedListener);
  videoContent.play();
}
