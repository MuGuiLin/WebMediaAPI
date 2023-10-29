CreModule.VideoPlayerModule = $.jextends(CreModule.ModuleBase, function () {
});
$.extend(CreModule.VideoPlayerModule.prototype, {
    create:function () {
        this.parent.html();
        var that = this;
        this.bindEvent();
        this.readonly = this.getDataFromPool("readonly");
        this.putDataToPool("videoPlayer", this.parent);
    },

    bindEvent: function() {
        var that = this;
        this.bindEventToPool("seekVideo", this, this.onSeekVideo);
        this.bindEventToPool("hidePlayer", this, this.onHidePlayer);
        this.bindEventToPool("showPlayer", this, this.onShowPlayer);

        this.bindEventToPool("openVideo", this, function(eventName, eventData, initData) {
            that.openVideo(eventData.rootId, eventData.fullFileName, eventData.inpoint, eventData.outpoint, eventData.fullFileNameStatus,null,null,null,eventData);
        });

        this.bindEventToPool("open", this, function(eventName, eventData, initData) {
            that.open();
        });

        this.bindEventToPool("InOutAdd", this, function(eventName, eventData, initData) {
            that.InOutAdd(eventData.inpoint, eventData.outpoint);
        });

        this.bindEventToPool("setIn", this, function(eventName, eventData, initData) {
            that.setIn(eventData.inpoint);
        });

        this.bindEventToPool("setOut", this, function(eventName, eventData, initData) {
            that.setOut(eventData.outpoint);
        });
        this.bindEventToPool("closeVideo", this, function(eventName, eventData, initData) {
            that.close();
        });
        this.bindEventToPool("setClipID", this, function(eventName, eventData, initData) {
            that.setClipID(eventData.resourceId);
        });
        this.bindEventToPool("getInpoint", this, this.onGetInpoint);
        this.bindEventToPool("getOutpoint", this, this.onGetOutpoint);

        //if (!this.readonly) {//编目模式
        //    this.parent.css("z-index", 10);
        //    $(window).scroll(function (){
        //        //固定播放器的位置
        //        if ($(document).scrollTop() > '60') {
        //            that.parent.offset({top:$(document).scrollTop()+43});
        //        } else {
        //            that.parent.offset({top:102});
        //        }
        //    });
        //}
    },

    onSeekVideo:function (eventName, eventData, initData) {
        var that = initData;
        if(Global.useDayangPlayer == 2) {
            var H5player = that.getDataFromPool("H5Player");
            H5player.seek(eventData.position);
        }else
            that.parent.slplayer("seek", eventData.position);
    },

    close: function() {
        this.parent.slplayer("close");
    },

    open:function () {
        var resource = this.getDataFromPool("resource");
        this.rootId = resource.rootId;
        if (this.parent.attr("showplayerwithoutvideo") == "true") {
            this.createPlayer();
            return;
        }
        var standard=parseFloat(resource.standardRate / resource.standardScale);
        if(standard<1){
            standard = '';
        }
        var playerOpenType = this.getDataFromPool("playerOpenType");
        if(playerOpenType == 1) {
            var rootResource = this.getDataFromPool("rootResource");
            if(!rootResource)return this.showMessage("未找到节目层资源");
            var isPlay = this.getDataFromPool("isPlay");
            if(!isPlay) {
                this.openVideo(resource.rootId, resource.fullFileName, rootResource.inpoint, rootResource.outpoint, standard,resource.fullFileNameStatus,resource.isIncludeVA,resource.parentId,resource);
                CreModuleManager.putDataToPool("isPlay", true);
            }
            if(Global.useDayangPlayer != 2) {
                this.fireEvent("setIn", resource);//设置当前打开子片段为高亮
                this.fireEvent("setOut", resource);
            }else{
                var H5player = this.getDataFromPool("H5Player");
                var iop = {
                    inpoint: resource.inpoint,
                    outpoint: resource.outpoint
                };
                if(resource.fullFileNameStatus != GlobalConstants.FILE_STATUS_NONE) {
                    H5player.highlightSubvideo(iop);
                }
            }

        }else{
            this.openVideo(resource.rootId, resource.fullFileName, resource.inpoint, resource.outpoint, standard,resource.fullFileNameStatus,resource.isIncludeVA,resource.parentId,resource);
        }

        if(Global.useDayangPlayer == "1"){
            var taskMode = this.getDataFromPool("taskMode");
            var auditReadonly = this.getDataFromPool("auditReadonly");
            if (taskMode == "audit" && auditReadonly == 1) {
                this.parent.slplayer("setEditPrivilege");
            }

        }
    },

    showMessage: function(message) {
        Notify.info(message, 5000);
        this.parent.hide();
    },

    InOutAdd: function(inpoint, outpoint){
        if(Global.useDayangPlayer != "2") {
            this.parent.slplayer("InOutAdd", {
                inpoint: inpoint,
                outpoint: outpoint
            });
        }
    },

    setClipID: function(resourceId) {
        this.parent.slplayer("setClipID", {
            resourceId:resourceId
        })
    },

    setIn: function(inpoint) {
        this.parent.slplayer("setIn", {
            inpoint:inpoint
        })
    },

    setOut: function(outpoint) {
        this.parent.slplayer("setOut", {
            outpoint:outpoint
        })
    },

    openVideo: function(rootId, url, inpoint, outpoint,standard, status,isIncludeVA,parentId,resourceData) {
        if (status == GlobalConstants.FILE_STATUS_NONE) {
            this.parent.hide();
            return;
        }
        /*if(isIncludeVA!==""&&parseInt(isIncludeVA) == 0){//不包含视音频
            $("#video-player-container").remove();
            return;
        }*/
        if (status == GlobalConstants.FILE_STATUS_UNREADY && parseInt(isIncludeVA) == 1 ) {//没有视频文件，高码率，低码率都没有，应该是微博类资源的详情页面
            return this.showMessage("暂无可浏览的低码文件，可在IE中浏览高码");
        }
        if(parseInt(isIncludeVA) == 0 && resourceData.ccId!="片段子类"){
            $("#video-player-container").remove();
            return;
        }
        if (status == GlobalConstants.FILE_STATUS_ACCESS_DENIED) {
            return this.showMessage("抱歉，由于权限限制，您无法查看该资源内容");
        }

        // if(this.parent.find("#Msshow2").size() > 0 && Global.useDayangPlayer == "1"){//判断是否已存在播放器插件
        //     this.parent.slplayer("open", {
        //         rootId: rootId,
        //         playNow: playNow,
        //         fullFileName:url,
        //         inpoint:inpoint,
        //         outpoint:outpoint
        //     });
        //
        //     var options = {
        //         pickFrameUrl: contextPath + "/addKeyframeFromActiveX",
        //         addFrameToIconUrl: contextPath + "/addFirstTimeCodeToIcon",
        //         callback: {
        //             onAddChildResource: this.onAddChildResource,
        //             onPickupKeyframe: this.onPickupKeyframe,
        //             afterPickupKeyframe: this.afterPickupKeyframe,
        //             onPickupKeyframeCallbackPara: this,
        //             onAddChildResourceCallbackPara: this,
        //             afterPickupKeyframeCallbackPara: this
        //         }
        //     };
        //     this.parent.slplayer("setOptions", options);
        //
        // }else{
            //编目中因气象局定制将播放器写死在页面上，其他项目要删除此dom
            // $("#Msshow2").remove();
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

            if (!Sys.ie) {
                if (Global.useDayangPlayer == "1")
                    return this.showMessage("系统指定的播放器需要在IE浏览器中使用");
            }

            console.log("url=" + url);

            if (!this.playerCreated && Global.useDayangPlayer != "2") {
                var readonly = this.getDataFromPool("readonly");
                var playerType = "d3player";
                var viewType = 2;
                var workType = 1;
                var extension = (url == null) ? null : url.substring(url.length - 3, url.length);
                if (extension != null)
                    extension = extension.toLowerCase();

                if (url != null && extension != "wmv" && extension != "mp4") {
                    if (!Sys.ie && parseInt(isIncludeVA) == 1 ) {
                        return this.showMessage("暂无可浏览的低码文件，可在IE中浏览高码");
                    }
                } else if (url != null && url.substring(0, 3) != "htt") {
                    if (!Sys.ie) {
                        return this.showMessage("系统指定的访问方式需要在IE浏览器中浏览");
                    }
                } else {
                    if (Global.useDayangPlayer != "1")
                        playerType = "slplayer";
                }

                if (playerType == "slplayer") {
                    this.parent.width(640);
                    this.parent.height(420);
                } else {
                    this.parent.width(644);
                    this.parent.height(434);
                }
                if (readonly) {//详情页
                    viewType = 0;
                    workType = 0;
                } else {// 编目
                    viewType = 2;
                    workType = 1;
                }

                this.parent.slplayer({
                    pickFrameUrl: contextPath + "/addKeyframeFromActiveX",
                    addFrameToIconUrl: contextPath + "/addFirstTimeCodeToIcon",
//                pickFrameUrl: contextPath + "/addFirstTimeCodeToIcon",
                    workType: workType,
                    playerType: playerType,
                    viewType: viewType,
                    callback: {
                        onAddChildResource: this.onAddChildResource,
                        onPickupKeyframe: this.onPickupKeyframe,
                        afterPickupKeyframe: this.afterPickupKeyframe,
                        onPickupKeyframeCallbackPara: this,
                        onAddChildResourceCallbackPara: this,
                        afterPickupKeyframeCallbackPara: this
                    }
                });
                this.playerCreated = true;
            }


            var playNow = true;
            if (Global.doNotPlayWhenReady == 1)
                playNow = false;

        if(Global.useDayangPlayer != "2") {
            this.parent.slplayer("open", {
                rootId: rootId,
                playNow: playNow,
                fullFileName:url,
//            lowFileStatus:status,
                inpoint:inpoint,
                outpoint:outpoint
            });
            if (playerType == "slplayer") {
                window.onscroll = function () {
                    var sTop = $(window).scrollTop();
                    var sTop = parseInt(sTop);
                    var stopTop = 495;
                    if (sTop >= stopTop) {
                        $("#detail-toolbar-module").css("margin-top", "464px");
                        Global.scrollx({id: 'video-player-container', l: 719, stopTop: stopTop,stopBottom: 40, f: 1});
                        $("#video-player-container-slplayer").css("width", "400px").css("height", "300px");
                        $("#video-player-container").css("width", "").css("height", "");
                    } else {
                        if ($("#video-player-container").css("position") == "fixed") {
                            Global.scrollx({id: 'video-player-container', l: 719, stopTop: stopTop,stopBottom: 40, f: 1});
                            $("#detail-toolbar-module").css("margin-top", "");
                            $("#video-player-container").css("width", "644px").css("height", "464px");
                            $("#video-player-container-slplayer").css("width", "644px").css("height", "464px");
                        }
                    }

                };
            }
        }else {
            if (this.readonly) {
                //H5播放器
                //创建video标签
                this.parent.width(644);
                this.parent.height(464);
                var html = '<video id="detail-video" class="video-js vjs-default-skin vjs-big-play-centered" controls  preload="auto"></video>';
                this.parent.html(html);



                // Get player configs from Global
                var config = Global.playerConfig;
                var autoplay = config.autoPlay;
                var autorepeat = config.autoRepeat;
                var step = parseInt(config.step);
                var opts = {
                    mediaSrc: url,    //必须
                    beginningTimecode: inpoint,     //必须
                    endTimecode: outpoint,           // 必须
                    videoStandard: standard		    // optional
                    };

                var player = videojs('detail-video', {
                    mediaSrc: url,
                    mode: 'normal',
                    videoStandard:standard,
                    autoplay: true,
                    autorepeat: autorepeat,
                    step: step
                },function(){
                    Global.initH5PlayerSettings();
                    //player.changeRecordedInpointOutpoint({inpoint:inpoint,outpoint:outpoint});
                });
                player.playMediaPortion(opts);
                if(resourceData.ccId!=undefined&&resourceData.ccId!=null) {
                    if(resourceData.ccId=="片段子类")
                    player.markAllInpoitOutpointParis([{inpoint: inpoint, outpoint: outpoint}]);
                }
                this.putDataToPool("H5Player", player);

                //$(document).off("click",".vjs-play-control").on('click',".vjs-play-control",function(){
                //    InpointOutpointPair = player.autorepeat;
                //    alert(InpointOutpointPair.inpoint);
                //});
                window.onscroll = function() {
                    var sTop = $(window).scrollTop();
                    var sTop = parseInt(sTop);
                    var stopTop= 495;
                    if(sTop>=stopTop){
                        $("#detail-toolbar-module").css("margin-top","464px");
                        Global.scrollx({id:'video-player-container',l:719,stopTop:stopTop, stopBottom: 40,f:1});
                        $("#detail-video").css("width","400px").css("height","300px");
                        $("#video-player-container").css("width","").css("height","");
                        $(".vjs-timecode-wrapper").css("display","none");
                    }else{
                        if ($("#video-player-container").css("position") == "fixed") {
                            Global.scrollx({id: 'video-player-container', l: 719, stopTop: stopTop,stopBottom: 40, f: 1});
                            $("#detail-toolbar-module").css("margin-top", "");
                            $(".vjs-timecode-wrapper").css("display", "");
                            $("#video-player-container").css("width", "644px").css("height", "464px");
                            $("#detail-video").css("width", "").css("height", "");
                        }
                    }

                };
            } else {
                //H5播放器
                //创建video标签
                // this.parent.width(644);
                this.parent.height(490);
                var html = '<video id="catalog-video" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" crossorigin="anonymous" muted="muted"></video>';
                this.parent.html(html);


                // if (videojs.getPlayers()['catalog-video']) {
                //     delete videojs.getPlayers()['catalog-video'];
                // }
                var channels = this.getDataFromPool("dwChannels");
                // Get player configs from Global
                var config = Global.playerConfig;
                var autoplay = config.autoPlay;
                var autorepeat = config.autoRepeat;
                var step = parseInt(config.step);
                var player = videojs('catalog-video', {
                    mediaSrc: url,
                    mode: 'powerful',
                    beginningTimecode: resourceData.inpoint,
                    endTimecode: resourceData.outpoint,
                    autoplay: true,
                    autorepeat: autorepeat,
                    step: step,
                    nbOfChnlsAudio:channels,
                    videoStandard: standard
                },function(){
                    Global.initH5PlayerSettings();
                });
                var opts = {
                    mediaSrc: url,    //必须
                    beginningTimecode: resourceData.inpoint,     //必须
                    endTimecode: resourceData.outpoint,           // 必须
                    videoStandard: standard		    // optional
                };

                player.playMediaPortion(opts);
                this.putDataToPool("H5Player", player);
                var that = this;
                this.parent.find(".vjs-screenshot").unbind("click").bind("click", function () {
                    var keyFrameData = player.screenshot();
                    that.onPickupKeyframeByH5Player(keyFrameData);
                });
                //增加快捷键实现抽取关键帧 Ctrl+P 或者 B
                //$(window).keydown(function (event) {
                //    if((event.which == 80 && event.ctrlKey) || event.which == 66) {
                //        event.preventDefault();
                //        var keyFrameData = player.screenshot();
                //        that.onPickupKeyframeByH5Player(keyFrameData);
                //    }
                //});
                this.parent.find(".vjs-yield-subvideo").unbind("click").bind("click", function () {
                    var inOutPoint = player.getInpointOutpointPair();
                    that.onAddChildResourceByH5Player(inOutPoint);
                });

            }
        }
        // }
    },

    createPlayer: function() {
        var playerType = "slplayer";
//        var playerType = "d3player";
        var viewType = 0;
        var workType = 0;
        this.parent.width(640);
        this.parent.height(420);

        this.parent.slplayer({
            pickFrameUrl: contextPath + "/addKeyframeFromActiveX",
            addFrameToIconUrl: contextPath + "/addFirstTimeCodeToIcon",
            workType: workType,
            playerType: playerType,
            viewType: viewType,
            callback: {
                onAddChildResource: this.onAddChildResource,
                onPickupKeyframe: this.onPickupKeyframe,
                afterPickupKeyframe: this.afterPickupKeyframe,
                onPickupKeyframeCallbackPara: this,
                onAddChildResourceCallbackPara: this,
                afterPickupKeyframeCallbackPara: this
            }
        });
        this.playerCreated = true;
    },

    onHidePlayer: function(eventName, eventData, initData) {
        var that = initData;
        that.parent.hide();
    },

    onShowPlayer: function(eventName, eventData, initData) {
        var that = initData;
        that.parent.show();
    },

    onAddChildResource: function(callbackPara, data) {
        var that = callbackPara;
        that.fireEvent("onAddChildResource", data);
    },
    onAddChildResourceByH5Player: function (data) {
        this.fireEvent("onAddchildResourceByH5Player", data);
    },
    onPickupKeyframeByH5Player: function (data) {
        this.fireEvent("onPickupKeyframeByH5Player", data);
    },
    onPickupKeyframe: function(callbackPara, data) {
        var that = callbackPara;
        that.fireEvent("onPickupKeyframe", data);
    },

    afterPickupKeyframe: function(callbackPara, data) {
        var that = callbackPara;
        that.fireEvent("afterPickupKeyframe", data);
    },

    onGetInpoint: function(eventName, eventData, initData) {
        var that = initData;

        if (that.getDataFromPool("H5Player")) {
            var inOutPoint = that.getDataFromPool("H5Player").getInpointOutpointPair();
            that.putDataToPool("inpoint", inOutPoint.inpoint);
        } else {
            var inpoint = that.parent.slplayer("getInpoint");
            that.putDataToPool("inpoint", inpoint);
        }
    },

    onGetOutpoint:function (eventName, eventData, initData) {
        var that = initData;
        if (that.getDataFromPool("H5Player")) {
            var inOutPoint = that.getDataFromPool("H5Player").getInpointOutpointPair();
            that.putDataToPool("outpoint", inOutPoint.outpoint);
        } else {
            var outpoint = that.parent.slplayer("getOutpoint");
            that.putDataToPool("outpoint", outpoint);
        }

    },

    resize:function () {

    },

    empty:null
});

