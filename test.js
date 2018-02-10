"use strict";

$(document).ready(
    function () {
        var anim = lottie.loadAnimation({
            container: document.getElementById('logo'),
            renderer: 'svg',
            autoplay: 'false',
            loop: true,
            path: 'lottie.json'
        });
        anim.setSpeed(0.2);
        (function () {
            var root = "https://test.goodlife.work/";
            var unload = root + "api/unload.json";
            var pagedata = [];
            var maindata, navidata;
            var sidedata = [];
            $.when(
                $.getJSON(unload)
            ).done(function (data) {
                var navi = root + data['navigation'];
                var main = root + data['main'];

                var async1 = $.when(
                    $.getJSON(main),
                    $.getJSON(navi)
                ).then(function (md, nd) {
                    var dfd = $.Deferred();
                    maindata = md[0];
                    navidata = nd[0];
                    dfd.resolve();
                    return dfd.prormise;
                });


                var requests = [];
                data['side'].forEach(function (element) {
                    var getjson = $.getJSON(root + element);
                    requests.push(getjson);
                });
                var async2 = $.when.apply(
                    null,
                    requests
                ).then(function () {
                    var dfd = $.Deferred();
                    $.each(arguments, function (i, row) {
                        sidedata[i] = row[0];
                    });
                    dfd.resolve();
                    return dfd.prormise;
                });

                $.when(
                    async1,
                    async2
                ).done(function () {
                    pagedata['main'] = [];
                    pagedata['side'] = [];
                    pagedata['main']['title'] = maindata['title'];
                    pagedata['main']['content'] = maindata['content'];
                    pagedata['navi'] = navidata;
                    pagedata['images'] = [];
                    pagedata['scripts'] = [];
                    pagedata['styles'] = [];
                    var resource = ['images', 'scripts', 'styles'];
                    resource.forEach(function (element) {
                        pagedata[element].push.apply(pagedata[element], maindata[element])
                    });

                    for (var i = 0; i < sidedata.length; i++) {
                        pagedata['side'][i] = [];
                        pagedata['side'][i]['title'] = sidedata[i]['title'];
                        pagedata['side'][i]['content'] = sidedata[i]['content'];
                        resource.forEach(function (element) {
                            pagedata[element].push.apply(pagedata[element], sidedata[i][element])
                        });
                    }

                    console.log(pagedata);
                    anim.loop = false;
                    anim.setSpeed(2);
                    $('#loading').css({"transition": "background-color 0.6s ease"});
                    $('#loading').css({"background-color": "transparent"});

                    anim.onComplete = function () {
                        $('#loading').fadeTo('slow', 0, function () {
                            $('#loading').hide()
                        });
                    }
                });
            });
        })();
    });


var sublayer_open = 0;
var phone_sublayer_width_percent = "85%";
var tablet_sublayer_width = 500;
var min_tablet_width = 600;
var min_pc_width = 1100;
$(window).resize(function () {
    if ($(window).width() > min_pc_width) {
        $("body").css("background-color", "transparent");
        $(".sublayer").attr("style", "");
    } else if (min_tablet_width < $(window).width() && $(window).width() <= min_pc_width) {
        if (sublayer_open === 1) {
            $(".sublayer").width(tablet_sublayer_width);
            $("body").css("background-color", "gray");
        } else {
            $(".sublayer").width(0);
        }
    } else {
        if (sublayer_open === 1) {
            $(".sublayer").width(phone_sublayer_width_percent);
            $("body").css("background-color", "gray");
        } else {
            $(".sublayer").width(0);
        }
    }
});

function openNav() {
    sublayer_open = 1;
    if ($(window).width() > min_tablet_width) {
        $(".sublayer").width(tablet_sublayer_width);
    }
    else {
        $(".sublayer").width(phone_sublayer_width_percent);
    }
    $("body").css("background-color", "gray"); //edit, body must be in quotes!
}

function closeNav() {
    sublayer_open = 0;
    $(".sublayer").width("0%");
    $("body").css("background-color", "transparent"); //edit, body must be in quotes!
}
