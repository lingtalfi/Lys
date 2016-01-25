(function ($) {

    //------------------------------------------------------------------------------/
    // THRESHOLD SYSTEM
    //------------------------------------------------------------------------------/
    /**
     *
     * Designed to provide infinite scroll to the whole page.
     * If you need infinite scroll on a specific element, you should use another system.
     *
     *
     * The whole page has 100% height.
     * You specify the threshold (in percent) above (or equals to) which  the request is being executed.
     *
     * There is no special markup that you have to worry about, the system detects the scrolling movement on the window.
     * The system appends a lys_loader to the body tag of the html page.
     * The markup of that automatically generated lys_loader looks like this:
     *
     *
     *     <lys_loader_overlay>
     *          <lys_loader/>
     *     </lys_loader_overlay>
     *
     *
     *
     * This implementation includes a css only (css3 transitions) ajax loader,
     * which by default is rendered at the bottom of the page.
     *
     * SetUp
     * ------------------
     *
     * The element on which you call the plugin is the wall element, on which your items are appended.
     *
     *
     * In your html head (or elsewhere if you prefer), include the following assets:
     *
     * <script src="/libs/lys/js/lys.js"></script>
     * <script src="/libs/lys/js/threshold1.skin.js"></script>
     * <link rel="stylesheet" href="/libs/lys/css/threshold1.css">
     *
     * Note that the skin has to be called AFTER the call to the lys.js library
     *
     *
     *
     *
     */



    window.lysSkins.threshold = function (lys, options) {


        var settings = $.extend({
            /**
             * The threshold (int), which represents the percentage of total available scrolling above which (or equals to) the request is triggered.
             * The default is 100, which means that the user needs to reach the very bottom of the page to trigger the request.
             */
            threshold: 100,
            /**
             * Whether or not to automatically build the necessary skin markup.
             * Default is true.
             */
            autoMarkup: true,
            /**
             * By default, when the ball is in the "water zone", and if the user keeps scrolling down,
             * numerous scroll events are fired.
             *
             * The requestDelay represents the minimum amount of time between two consecutive requests.
             * As a consequence of the current implementation, it's also the delay after which
             * a request is executed (but this second behaviour might be removed at any time).
             *
             * Default is 250.
             */
            requestDelay: 250,
            /**
             * When the request returns the content, the content gets appended to the wall.
             * Before it does so, it calls the wrapContent callback to give the developer the opportunity
             * to wrap the content within special html markup.
             */
            wrapContent: function (content) {
                return '<p>' + content + '</p>';
            },
            /**
             * By default, the params sent to the request is a map containing the (auto-incremented) count value.
             * The startingCount option specifies the starting value of "count". 
             * 
             * Default is 1
             */
            startingCount: 1
        }, options);


        // useful vars
        var count = settings.startingCount;
        var jBody = $('body');


        //------------------------------------------------------------------------------/
        // AUTO MARKUP
        //------------------------------------------------------------------------------/
        if (true === settings.autoMarkup) {
            var jLoader = $('body > .lys_loader_overlay');
            if (0 === jLoader.length) {
                jBody.append('<div class="lys_loader_overlay"><div class="lys_loader"></div></div>');
            }
        }


        //------------------------------------------------------------------------------/
        // AJAX LOADER AND REQUEST HANDLING
        //------------------------------------------------------------------------------/
        lys.settings = $.extend(lys.settings, {
            onFetchBefore: function (lys) {
                jBody.addClass('lys_scrolling');
            },
            onFetchSuccess: function (lys, content) {
                if (content) {
                    $(lys.element).append(settings.wrapContent(content));
                }
            },
            onFetchAfter: function(){
                setTimeout(function () {
                    jBody.removeClass('lys_scrolling');
                }, 1000);
            },
            sensors: [
                function (lys) {
                    $(window).on('scroll.lys', function () {
                        var scrolledDistance = $(window).scrollTop();
                        var maximumScrollableDistance = $(document).height() - $(window).height();
                        if (scrolledDistance >= maximumScrollableDistance * settings.threshold / 100) {
                            var zis = this;
                            clearTimeout($.data(this, 'lys_timer'));
                            $.data(this, 'lys_timer', setTimeout(function () {
                                lys.fetch({
                                    count: count++
                                });
                            }, settings.requestDelay));
                        }
                    });
                }
            ]
        });
    };

})(jQuery);