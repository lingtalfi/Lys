(function ($) {

    //------------------------------------------------------------------------------/
    // BALL AND WATER SYSTEM
    //------------------------------------------------------------------------------/
    /**
     * The ball falls from a wall, down to the water...
     * When the ball reaches the water, we fetch using fetch(count++)
     *
     * This is designed to provide infinite scroll for a specific element on the page.
     * If you need infinite scroll for the whole page, you should use another system.
     *
     *
     * Markup is the following:
     *
     * <wallContainer>                              (css: {position: relative})
     *
     *     <wall></wall>                            (css: {height: 400px; overflow-y: scroll})
     *
     *
     *     <lys_loader_overlay>
     *          <lys_loader/>
     *     </lys_loader_overlay>
     *
     * </wallContainer>
     *
     *
     * Apart from the wall element, which is the element on which you apply the jquery plugin,
     * all other elements are by default automatically generated (options.autoMarkup=true).
     *
     *
     *
     * SetUp
     * ------------------
     *
     * The element on which you call the plugin is the wall.
     * It must have a height, and it's overflow in y must be scroll.
     *
     * In your html head (or elsewhere if you prefer), include the following assets:
     *
     * <script src="/libs/lys/js/lys.js"></script>
     * <script src="/libs/lys/js/waterball1.skin.js"></script>
     * <link rel="stylesheet" href="/libs/lys/css/waterball1.css">
     *
     * Note that the skin has to be called AFTER the call to the lys.js library
     *
     *
     *
     *
     */



    window.lysSkins.waterBallWithBottomLoader = function (lys, options) {

        var noop = function () {
        };

        var settings = $.extend({
            /**
             * Whether or not to automatically build the necessary skin markup.
             * Default is true.
             */
            autoMarkup: true,
            /**
             * The height (int in pixel) of the water at the bottom of your wall.
             * When the user scrolls down your wall, there is an imaginary ball that goes down;
             * if the ball reaches the water, then a request to the service is executed.
             * Therefore, with a very small height of water, the user needs to scroll more (nearly to the
             * very bottom of the page) to get the request executed.
             *
             * The default is 10
             *
             */
            waterHeight: 10,
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
             * Some css classes used by this skin
             */
            cssClass: {
                wallContainer: 'wall_container'
            },
            /**
             * By default, the params sent to the request is a map containing the (auto-incremented) count value.
             * The startingCount option specifies the starting value of "count".
             *
             * Default is 1
             */
            startingCount: 1,
            /**
             * This callback is executed at the beginning of the mouse wheel event.
             * You can use it to manually move down the scrolled content, if you've overridden the default
             * scrolling behaviour and put an overflow:hidden in your css for instance.
             *
             */
            scrollPreHelper: noop,
            /**
             * A map of extra parameters to send to the server.
             * Note that an auto-incremented parameter will be added to this map.
             */
            urlParams: {},
            /**
             * The name of the auto-incremented url parameter.
             * Default is "count".
             */
            autoIncrementedUrlParamName: 'count',
            /**
             * This plugin automatically set some of the lys options for you 
             * (like the onFetchSuccess option for instance). 
             * 
             * This might even override your own lys options.
             * To avoid any conflict between your options and THIS plugin's option,
             * you can use the pluginParams map.
             * 
             * Technically speaking, you only need to put the conflictual options here
             * (look at THIS plugin's options: onFetchBefore, onFetchSucess, onFetchAfter, ...).
             * But if you don't want to bother, you can simply put all your options here...
             * 
             * 
             */
            pluginParams: {}
        }, options);


        var containerHeight = $(lys.element).height();


        //if (null === settings.waterHeight) {
        //    settings.waterHeight = parseInt(containerHeight / 3);
        //}


        var count = settings.startingCount;


        /**
         * Set the new count.
         */
        this.setCount = function(newCount){
            count = newCount;
        };
        
        
        //------------------------------------------------------------------------------/
        // AUTO MARKUP
        //------------------------------------------------------------------------------/
        if (true === settings.autoMarkup) {
            function lysWaterBallAutoBuild(jWall) {
                jWall.wrap('<div class="' + settings.cssClass.wallContainer + '"></div>');
                jWall.after('<div class="lys_loader_overlay"><div class="lys_loader"></div></div>');
            }

            lysWaterBallAutoBuild($(lys.element));
        }


        //------------------------------------------------------------------------------/
        // AJAX LOADER FOR BALL AND WATER SYSTEM
        //------------------------------------------------------------------------------/
        var jWallContainer = $(lys.element).closest('.' + settings.cssClass.wallContainer);


        lys.settings = $.extend(lys.settings, {
            onFetchBefore: function (lys) {
                jWallContainer.addClass('active');
            },
            onFetchSuccess: function (lys, content) {
                if (content) {
                    $(lys.element).append(settings.wrapContent(content));
                }
            },
            onFetchAfter: function () {
                setTimeout(function () {
                    jWallContainer.removeClass('active');
                }, 1000);
            },
            sensors: [
                //------------------------------------------------------------------------------/
                // ADD MOUSE WHEEL SCROLLING SENSOR (Chrome - Firefox - ?)
                //------------------------------------------------------------------------------/
                function (lys) {

                    var urlParams = $.extend({}, settings.urlParams); // assuming params do not change dynamically


                    $(lys.element).on('mousewheel.lys_waterball DOMMouseScroll.lys_waterball', function (e) {
                        settings.scrollPreHelper(e);
                        var zis = this;
                        clearTimeout($.data(this, 'timer'));
                        $.data(this, 'timer', setTimeout(function () {
                            var scrollDown = $(zis).scrollTop() + containerHeight;
                            var triggerValue = $(zis).prop('scrollHeight') - settings.waterHeight;                            
                            if (scrollDown >= triggerValue) {
                                urlParams[settings.autoIncrementedUrlParamName] = count++;
                                lys.fetch(urlParams);
                            }
                        }, settings.requestDelay));
                    });
                }
            ]
        }, settings.pluginParams);
    };

})(jQuery);