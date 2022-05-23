/*
音乐信息

感谢 @武恩赐 提供的 MetingAPI
https://api.wuenci.com/meting/api/

作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/
var server = "netease"; //netease: 网易云音乐; tencent: QQ音乐; kugou: 酷狗音乐; xiami: 虾米; kuwo: 酷我
var type = "playlist"; //song: 单曲; playlist: 歌单; album: 唱片
var id = "60198"; //封面 ID / 单曲 ID / 歌单 ID

$.ajax({
    url: "https://api.wuenci.com/meting/api/?server=" + server + "&type=" + type + "&id=" + id, //json文件位置，文件名
    type: "GET",
    dataType: "JSON",
    success: function (data) { 
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            order: 'random',
            preload: 'auto',
            listMaxHeight: '336px',
            volume: '0.5',
            mutex: true,
            lrcType: 3,
            audio: data,
        });

        /* 底栏歌词 */
        setInterval(function () {
            $("#lrc").html("<span class='lrc-show'><i class='iconfont icon-music'></i> " + $(".aplayer-lrc-current").text() + " <i class='iconfont icon-music'></i></span>");
        }, 500);

        /* 音乐通知及控制 */
        ap.on('play', function () {
            music = $(".aplayer-title").text() + $(".aplayer-author").text();
            iziToast.info({
                timeout: 8000,
                iconUrl: './img/icon/music.png',
                displayMode: 'replace',
                message: music
            });
            $("#play").html("<i class='iconfont icon-pause'>");
            $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
            if ($(document).width() >= 990) {
                $('.power').css("cssText", "display:none");
                $('#lrc').css("cssText", "display:block !important");
            }
        });

        ap.on('pause', function () {
            $("#play").html("<i class='iconfont icon-play'>");
            if ($(document).width() >= 990) {
                $('#lrc').css("cssText", "display:none !important");
                $('.power').css("cssText", "display:block");
            }
        });

        $("#music").hover(function () {
            $('.music-text').css("display", "none");
            $('.music-volume').css("display", "flex");
        }, function () {
            $('.music-text').css("display", "block");
            $('.music-volume').css("display", "none");
        })

        /* 一言与音乐切换 */
        $('#open-music').on('click', function () {
            $('#hitokoto').css("display", "none");
            $('#music').css("display", "flex");
        });

        $("#hitokoto").hover(function () {
            $('#open-music').css("display", "flex");
        }, function () {
            $('#open-music').css("display", "none");
        })

        $('#music-close').on('click', function () {
            $('#music').css("display", "none");
            $('#hitokoto').css("display", "flex");
        });

        /* 上下曲 */
        $('#play').on('click', function () {
            ap.toggle();
            $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
        });

        $('#last').on('click', function () {
            ap.skipBack();
            $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
        });

        $('#next').on('click', function () {
            ap.skipForward();
            $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
        });

        /* 打开音乐列表 */
        $('#music-open').on('click', function () {
            if ($(document).width() >= 990) {
                $('#box').css("display", "block");
                $('#row').css("display", "none");
                $('#more').css("cssText", "display:none !important");
            }
        });

        //音量调节
        $("#volume").on('click', function () {
            var x = $("#volume").val();
            ap.volume(x, true);
            if (x == 0) {
                $("#volume-ico").html("<i class='iconfont icon-volume-x'></i>");
            } else if (x > 0 && x <= 0.3) {
                $("#volume-ico").html("<i class='iconfont icon-volume'></i>");
            } else if (x > 0.3 && x <= 0.6) {
                $("#volume-ico").html("<i class='iconfont icon-volume-1'></i>");
            } else {
                $("#volume-ico").html("<i class='iconfont icon-volume-2'></i>");
            }
        });
    },
    error: function () {
        setTimeout(function () {
            iziToast.info({
                timeout: 12000,
                iconUrl: './img/icon/warn.png',
                displayMode: 'replace',
                message: '音乐播放器加载失败'
            });
        }, 3800);
    }
})