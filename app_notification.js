var AppNotification = (function () {

    var banner,

        // Browsers
        userAgent = window.navigator.userAgent,
        isWebkit = (/webkit/i).test(userAgent),
        isMoz = (/mozilla/i).test(userAgent) && !isWebkit,
        isOpera = (/opera/i).test(userAgent),
        isIE = (/msie/i).test(userAgent),
        isIE8 = (/MSIE 8.0/).test(userAgent),

        // Prefixes
        vendorPrefix = isWebkit ? "webkit" :
                        isMoz ? "Moz" :
                        isOpera ? "O" :
                        isIE ? "ms" : "",
        transitionEnd = isMoz ? "transitionend" : vendorPrefix.toLowerCase() + "TransitionEnd",

        // Init function
        init = function (config) {

            // Config vars
            var icon = config.icon || "images/thumb_placeholder.png",
                text = config.text || "Download our awesome <strong>iPhone App</strong> and enjoy the best music experience on Mobile.",
                positions = config.position ? config.position.split(" ") :
                    (window.navigator.userAgent.toLowerCase().indexOf("ipad") > -1 ? ["top", "middle"] : ["bottom", "middle"]),
                positionVertical = positions[0],
                positionHorizontal = positions[1],
                link = config.link || "#",
                maxViews = config.maxViews || 3,

            // Template vars
                closeButton = "closeBtn.png",
                template =
                "<div id=\"AppNotification\" class=\"hidden\">" +
                    "<img id=\"AppNotification-close\" src=\"" + closeButton + "\" onclick=\"AppNotification.close()\" />" +
                    "<img id=\"AppNotification-icon\" src=\"" + icon + "\" />" +
                    "<div id=\"AppNotification-text\">" + text + "</div>" +
                    "<a id=\"AppNotification-button\" href=\"" + link + "\">DOWNLOAD</a>" +
                "</div>";

            // Add banner to page + store DOM reference
            document.body.innerHTML += template;
            banner = document.getElementById("AppNotification");

            // Position banner
            reposition(positionVertical, positionHorizontal);

            // Make sure impressions are set in local storage
            if (!localStorage["AppNotification.impressions"]) localStorage["AppNotification.impressions"] = 0;

            // Show banner if impressions is less than maxViews
            if (Number(localStorage["AppNotification.impressions"]) < maxViews) show();

            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {

                reposition(positionVertical, positionHorizontal);
            });
        },

        reposition = function (vertical, horizontal) {

            var top = 0, left = 0;

            // Set vertical position
            switch (vertical) {
                case "top": banner.style.top = 0; break;
                case "bottom": banner.style.bottom = 0; break;
                default: banner.style.top = (window.innerHeight / 2 - banner.offsetHeight / 2) + "px"; break;
            }

            // Set horizontal position
            switch (horizontal) {
                case "left": banner.style.left = 0; break;
                case "right": banner.style.right = 0; break;
                default: banner.style.left = (window.innerWidth / 2 - banner.offsetWidth / 2) + "px"; break;
            }
        }

        show = function () {

            // Increment impressions
            var impressions = Number(localStorage["AppNotification.impressions"]);
            localStorage["AppNotification.impressions"] = impressions + 1;
            
            // Show banner
            banner.className = "";
        },

        hide = function () {

            banner.className = "hidden";
            banner.addEventListener(transitionEnd, function () {

                document.body.removeChild(banner);
            });
        }

    return {

        settings: init,
        close: hide
    }

})();