/**
* RS_YoutubePlayer (v1.0.2)
* ====================================================
* Change Log
* ====================================================
* 2018.08.23 (v1.0.0) - First Release.
* 2018.08.24 (v1.0.1) : 
* - Now Youtube Player would control parameters using Record Manager.
* - Youtube Player could return as the previous scene after finished the video.
* - Added setSize method.
* 2018.08.24 (v1.0.2) - Supported for Action-based UI.
*/
var Imported = Imported || {};
Imported.RS_YoutubePlayer = true;

var player;
var RS = RS || {};
RS.YoutubePlayer = RS.YoutubePlayer || {};
RS.YoutubePlayer.Params = RS.YoutubePlayer.Params || {};

function YTPlayer() {
    throw new Error("This is a static class");
}

//----------------------------------------------------------------------------
// Youtube Event Handler
//
//
function onYouTubeIframeAPIReady() {
    
    if(RecordManager.youtubePlayer && RecordManager.youtubePlayer[0]) {    
        var item = RecordManager.youtubePlayer[0];
    }
    
    player = new YT.Player('ytplayer-iframe', {
        height: item.videoWidth || 560,
        width: item.videoHeight || 315,
        videoId: 'BIbpYySZ-2Q',
        fs: 1,
        autoplay: 1,
        enablejsapi: 1,
        rel: 1,
        showinfo: 0,
        playsinline: 0,
        controls: 0,
        autohide: 1,
        loop: 1,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    var target = event.target;
    target.playVideo();
}

function onPlayerError(event) {
    var errorLog = "";
    switch (event.data) {
        case 2:
        // 요청에 잘못된 매개변수 값이 포함되어 있습니다. 예를 들어 11자리가 아닌 동영상 ID를 지정하거나
        // 동영상 ID에 느낌표 또는 별표와 같은 잘못된 문자가 포함된 경우에 이 오류가 발생합니다.
        errorLog += "요청에 잘못된 매개변수 값이 포함되어 있습니다. 예를 들어 11자리가 아닌 동영상 ID를 지정하거나 동영상 ID에 느낌표 또는 별표와 같은 잘못된 문자가 포함된 경우에 이 오류가 발생합니다.";
        break;
        case 5:
        // 요청한 콘텐츠는 HTML5플레이어에서 재생할 수 없는, 또는 HTML5플레이어에 대한 별도의 에러가 발생했습니다.
        errorLog += "Error Code : 5" + '\r\n';
        errorLog += " The requested content cannot be played in an HTML5 player" + '\r\n';
        errorLog += "or another error related to the HTML5 player has occurred." + '\r\n';
        break;
        case 100:
        // 요청한 동영상을 찾을 수 없습니다.
        // 어떠한 이유로든 동영상이 삭제되었거나 비공개로 표시된 경우에 이 오류가 발생합니다.
        errorLog += "Error Code : 100" + '\r\n';
        errorLog += "The video requested was not found. " + '\r\n';
        errorLog += "This error occurs when a video has been removed (for any reason) " + '\r\n';
        errorLog += "or has been marked as private." + '\r\n';
        break;
        case 101:
        case 150:
        // 요청한 동영상의 소유자가 내장 플레이어에서 동영상을 재생하는 것을 허용하지 않습니다.
        errorLog += "Error Code : 101 or 150" + '\r\n';
        errorLog += "The owner of the requested video does not allow it to be played in embedded players.";
        break;
    }
    YTPlayer.stopVideo();
    window.alert(errorLog);
    YTPlayer.onEnd();
}

function onPlayerStateChange (event) {
    switch(event.data) {
        case YT.PlayerState.ENDED: // 종료됨
        console.log('Video has ended.');
        YTPlayer._status = YT.PlayerState.ENDED;
        if(RS.YoutubePlayer.Params.isLooping) {
            YTPlayer.callPlayer('playVideo', []);
            YTPlayer.callPlayer('seekTo', [0, true]);
        } else {
            console.log("YT.PlayerState.ENDED 감지됨");
            return (function() {
                return setTimeout(function() {
                    YTPlayer.onEnd();
                });
            })();
        }
        break;
        case YT.PlayerState.PLAYING: // 재생 중
        console.log('Video is playing.');
        YTPlayer._status = YT.PlayerState.PLAYING;
        break;
        case YT.PlayerState.PAUSED: // 일시 중지
        console.log('Video is paused.');
        YTPlayer._status = YT.PlayerState.PAUSED
        break;
        case YT.PlayerState.BUFFERING: // 버퍼링
        console.log('Video is buffering.');
        YTPlayer._status = YT.PlayerState.BUFFERING;
        break;
        case YT.PlayerState.CUED: // 동영상 신호
        console.log('Video is cued.');
        YTPlayer._status = YT.PlayerState.CUED;
        break;
        default: // 시작 전
        console.log('Unrecognized state.');
        break;
    }
}

(function() {
    
    YTPlayer._boundRect = new gs.Rect(0, 0, 1, 1);
    
    var quality = 'hd720';
    RS.YoutubePlayer.Params.viewSize = 'Normal';
    RS.YoutubePlayer.Params.isLooping = false;
    RS.YoutubePlayer.Params.videoWidth = 560;
    RS.YoutubePlayer.Params.videoHeight = 315;
    RS.YoutubePlayer.Params.callbackTime = 2000;
    
    (function() {
        
        if(RecordManager.youtubePlayer && RecordManager.youtubePlayer[0]) {
            var item = RecordManager.youtubePlayer[0];
            RS.YoutubePlayer.Params.videoWidth = parseInt(item.videoWidth);
            RS.YoutubePlayer.Params.videoHeight = parseInt(item.videoHeight);
            quality = item.quality;
            RS.YoutubePlayer.Params.isLooping = (item.isLooping === 1);
            RS.YoutubePlayer.Params.callbackTime = parseInt(item.callbackTime) || 2000;
        }
        
    })();
    
    //================================================================
    // YTPlayer for JQuery
    //================================================================
    
    YTPlayer.initialize = function(width, height) {
        "use strict";
        var tw = window.outerWidth - window.innerWidth;
        var th = window.outerHeight - window.innerHeight;
        var viewMode = RS.YoutubePlayer.Params.viewSize;
        this._init = false;
        this._status = -1;
        
        this._ytPlayer = jQuery('<div>');
        this._ytPlayer.attr("id", 'ytplayer');
        this._ytPlayer.attr("width", (viewMode === 'Fullscreen' ) ? `${width - tw}px` : '560px');
        this._ytPlayer.attr("height", (viewMode === 'Fullscreen' ) ? `${height - th}px` : '315px');
        jQuery("body").append(this._ytPlayer);
        this._tag = document.createElement('script');
        this._tag.src = "https://www.youtube.com/iframe_api";            
        
        this.createIframe();
        
    };
    
    YTPlayer.createIframe = function () {
        if(this._ytPlayer && this._iframe && this._iframe[0]) {
            this._iframe.remove();
        }
        var viewMode = RS.YoutubePlayer.Params.viewSize;
        this._iframe = jQuery('<iframe>');
        this._iframe.attr("id", 'ytplayer-iframe');
        
        var width = (viewMode === 'Fullscreen' ) ? gs.Graphics.width + "px" : '560px';
        var height = (viewMode === 'Fullscreen' ) ? gs.Graphics.height + "px" : '315px'
        this._iframe.attr("width", width);
        this._iframe.attr("height", height);
        this._iframe.css("opacity", "0");
        this._iframe.css("z-index", "0");
        this._iframe.attr("frameBorder", 0);
        this._iframe.attr("allowfullscreen", true);
        this._iframe.css("left", 0);
        this._iframe.css("top", 0);
        this._iframe.css("right", "0");
        this._iframe.css("bottom", "0");
        this._iframe.css("margin", "auto");
        this._iframe.css("position", "absolute");
        this._iframe.css("width", width);
        this._iframe.css("height", height);
        if(this._ytPlayer) {
            this._ytPlayer.append(this._iframe);
        }
    };
    
    YTPlayer.preVideo = function(src) {
        if(src) {
            this._iframe.attr("src", 'https://www.youtube.com/embed/{0}?enablejsapi=1&version=3'.format(src));
        }
        
        this._iframe.css("opacity", '1');
        this._iframe.css("z-index",'60');
        
        if(!this._init) {
            this._firstScriptTag = document.getElementsByTagName('script')[0];
            this._firstScriptTag.parentNode.insertBefore(this._tag, this._firstScriptTag);
            this._init = true;
        } else {
            window.onYouTubeIframeAPIReady();
        }
    };
    
    YTPlayer.playVideo = function(src) {
        this.createIframe();
        this.preVideo(src);
        jQuery("canvas").css("opacity", "0.0");
    };
    
    YTPlayer.dispose = function() {
        YTPlayer.removeAllElement();
        if(this._iframe[0]) {
            this._iframe.remove();
            this._iframe = null;
        }
        if(this._ytPlayer[0]) {
            this._ytPlayer.remove();
            this._ytPlayer = null;
        }
        this._init = false;
    };
    
    YTPlayer.stopVideo = function() {
        if(!this._iframe) return;
        this._iframe.css("opacity", "0.0");
        this._iframe.css("z-index", "0");
        jQuery("canvas").css("opacity", "1.0");
        this.callPlayer("stopVideo");
    };
    
    YTPlayer.removeAllElement = function() {
        this.stopVideo();
    };
    
    YTPlayer.callPlayer = function(func, args) {
        if(!this._iframe) return;
        var frame_id = 'ytplayer-iframe';
        var src = this._iframe[0].src;
        if (src.indexOf('youtube.com/embed') != -1) {
            this._iframe[0].contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': func,
                'args': args || [],
                'id': frame_id
            }), "*");
        }
    };
    
    YTPlayer.isOnPlayer = function() {
        if(!this._iframe) return false;
        if(!this._iframe[0]) return false;
        if(!this._iframe[0].contentWindow) return false
        if(!this._ytPlayer) return false;
        return this._init;
    };
    
    YTPlayer.isPlaying = function() {
        if(this._status === YT.PlayerState.PLAYING) {
            return true;
        }
        return false;
    };
    
    YTPlayer.isPaused = function() {
        if(this._status === YT.PlayerState.PAUSED) {
            return true;
        }
        return false;
    };
    
    YTPlayer.isBuffering = function() {
        if(this._status === YT.PlayerState.BUFFERING) {
            return true;
        }
        return false;
    };
    
    YTPlayer.isEnded = function() {
        if(this._status === YT.PlayerState.ENDED || this._status === YT.PlayerState.CUED) {
            return true;
        }
        return false;
    };
    
    YTPlayer.getRect = function() {
        var w, h, gw, gh, x1, x2, y1, y2;
        w = RS.YoutubePlayer.Params.videoWidth / 2;
        h = RS.YoutubePlayer.Params.videoHeight / 2;
        gw = (gs.Graphics.width / 2);
        gh = (gs.Graphics.height / 2);
        x1 = gw - w;
        x2 = gw + w;
        y1 = gh - h;
        y2 = gh + h;
        this._boundRect.set(x1, y1, w, h);
        return this._boundRect;
    };
    
    YTPlayer.isTouched = function(x, y) {
        var rect = this.getRect();
        return rect.contains(x, y);
    };
    
    YTPlayer.urlUtils = function (src) {
        
        var url = new URL(src);
        var urlParams = {};
        url.search.substring(1)
        .split('&')
        .map(function(i) { return i.split('=') })
        .forEach(function (e, i, a) {
            urlParams[e[0]] = e[1];
        });
        
        if(src.match(/(?:http|https)+(?:\:\/\/youtu.be\/)+(.*)/gi)) {
            urlParams['v'] = String(RegExp.$1);
        }
        
        return urlParams;
    };
    
    YTPlayer.playYoutube = function(src) {
        var lastStep;
        var params = YTPlayer.urlUtils(src);
        var url = params["v"] || 'BIbpYySZ-2Q';
        var startSecond = Number(params["t"]) || 0;
        YTPlayer.playVideo(url);
        lastStep = setInterval(function() {
            YTPlayer.callPlayer('playVideo');
            YTPlayer.callPlayer('setLoop', [RS.YoutubePlayer.Params.isLooping]);
            YTPlayer.callPlayer('setSize', [RS.YoutubePlayer.Params.videoWidth, RS.YoutubePlayer.Params.videoHeight]);
            YTPlayer.callPlayer('setPlaybackQuality', [quality]);
            YTPlayer.callPlayer('seekTo', [startSecond, true]);
            if(YTPlayer.isOnPlayer()) {
                clearInterval(lastStep);
            }
        }, 2000);
    };
    
    YTPlayer.isVideoVisible = function() {
        var youtubePlayer = jQuery('#ytplayer-iframe');
        return (youtubePlayer[0] && youtubePlayer.css("opacity") > 0);
    };
    
    YTPlayer.onEnd = function() {};
    
    YTPlayer.updateFrame = function() {
        gs.Main.updateFrame();
        if(YTPlayer.isOnPlayer() && YTPlayer.isVideoVisible()) {
            YTPlayer.requestUpdateFrame();
        }
    };
    
    YTPlayer.requestUpdateFrame = function() {
        var id = window.requestAnimationFrame(YTPlayer.updateFrame);
        return id;
    };
    
    //================================================================
    // Component_PlayingYoutubeGameScene
    //================================================================
    
    class Component_PlayingYoutubeGameScene extends vn.Component_GameSceneBehavior
    {
     
        initialize() {
            super.initialize();       
        }

        playYoutubeVideo(src) {
            let w = $PARAMS.resolution.width || 800;
            let h = $PARAMS.resolution.height || 600;
            YTPlayer.initialize(w, h);
            YTPlayer.playYoutube(src);
            return setTimeout(function() {
                YTPlayer.requestUpdateFrame();
            }, 100);      

        }
        
        updateContent() {
            this.checkEscapeToYoutube();      
            super.updateContent();
        } 
        
        checkEscapeToYoutube() {
            
            let x = Input.Mouse.x || 0;
            let y = Input.Mouse.y || 0;
            
            if(Input.Mouse.buttons[Input.Mouse.LEFT] == 1) { // mouse down == 1
                if(!YTPlayer.isTouched(x, y) && (YTPlayer._status > 0) ) {
                    YTPlayer.stopVideo();
                    YTPlayer.onEnd();
                }
            }  
            
        }
        
        dispose() {
            super.dispose();
        }
        
    }
    
    vn.Component_GameSceneBehavior = Component_PlayingYoutubeGameScene;
    
    //================================================================
    // Component_CommandInterpreterForYoutube
    //================================================================

    class Component_CommandInterpreterForYoutube extends gs.Component_CommandInterpreter {

        assignCommand (command) {
            switch (command.id) {
                case "gs.PlayYoutubeVideo":
                return command.execute = this.commandYoutubeVideo;
            };    
            return super.assignCommand(command);
        }
        
        commandYoutubeVideo() 
        {
            let scene, src;

            if ((GameManager.inLivePreview || GameManager.settings.allowVideoSkip) && GameManager.tempSettings.skip) {
                return;
            }
            GameManager.tempSettings.skip = false;
            scene = SceneManager.scene;
            src = lcsm(this.params.src);
            
            /**
            * iframe이 있으면 브라우저의 콜백 함수인 requestAnimationFrame 메서드가 중단된다.
            * Visual Novel Maker의 game loop는 알만툴과 달라서 멈춘 callback이 다시 재실행되지 않는다.
            * 게임 루프가 돌지 않으면 렌더링도 되지 않으므로 화면은 검은색으로 처리된다.
            * 따라서 유튜브 동영상 재생 이후, iframe을 완벽하게 삭제한 후 재시작 처리 작업이 필요하다.
            * 약 2초간의 시간이 적절한 것으로 파악되었다.
            * 2초 이후에는 렌더링이 다시 재개된다. 
            */
            YTPlayer.onEnd = function() {
                // 다음 이벤트 커맨드 실행을 재개한다.
                this.interpreter.isWaiting = false;
                YTPlayer.dispose()
                return setTimeout(function() {
                    // 렌더링을 재개한다.
                    Graphics.onEachFrame(gs.Main.frameCallback);
                    gs.Audio.resume();
                    Input.clear();       
                    // 포커스를 되찾는다.
                    Graphics.canvas.focus();   
                    window.focus();
                }, RS.YoutubePlayer.Params.callbackTime);
            }.bind(this);
            
            // 씬의 기능도 컴포넌트로 분리되어있음을 알아야 한다.
            scene.behavior.playYoutubeVideo(src);
            this.interpreter.isWaiting = true;
            
            return gs.GameNotifier.postMinorChange();
            
        }       
    }

    gs.Component_CommandInterpreter = Component_CommandInterpreterForYoutube;
    
})();
