//------------------------------------------------------------------------------/
// THRESHOLD
//------------------------------------------------------------------------------/
/**
 * This sensor triggers the data fetching based on the window's scrolling height (main scroll).
 *
 * The options let you specify at which percentage of the page do you want to trigger the data fetching.
 *
 *
 */
(function () {


    if ('undefined' === typeof window.lysThresholdSensorDeaf) {
        window.lysThresholdSensorDeaf = false; // see conception notes for more info (https://github.com/lingtalfi/Lys/blob/master/doc/about-deaf-sensor.md)
    }


    lys.sensors.threshold = function (options) {
        var d = $.extend({
            /**
             * The threshold (int), which represents the percentage of total available scrolling above
             * which (or equals to) the data are fetched.
             * The default is 100, which means that the user needs to reach the very bottom of the page
             * to fetch the data.
             */
            threshold: 100,
            /**
             * Scrolling usually fires a lot of js events very rapidly.
             * In order to limit the number of events called,
             * you can add a minimum delay between two events.
             *
             * This number is specified in milliseconds.
             *
             * Default is 200.
             */
            requestDelay: 200
        }, options);
        this.listen = function (lys) {

            /**
             * var to prevent annoying repeated scrolling triggering if the user does even scroll the window,
             * but since the scroll is below the threshold, it keeps firing.
             */
            var oldScrolledDistance = null;

            $(window)
                .off('scroll.lys_threshold')
                .on('scroll.lys_threshold', function () {

                    if (false === window.lysThresholdSensorDeaf) {
                        var scrolledDistance = $(window).scrollTop();


                        if (null === oldScrolledDistance) {
                            oldScrolledDistance = scrolledDistance;
                        }
                        var maximumScrollableDistance = $(document).height() - $(window).height();


                        //screenDebug({ // https://github.com/lingtalfi/ScreenDebug
                        //    scrolledDistance: scrolledDistance,    
                        //    oldScrolledDistance: oldScrolledDistance,
                        //    maximumScrollableDistance: maximumScrollableDistance,
                        //    docHeight: $(document).height(), 
                        //    windowHeight: $(window).height()
                        //});


                        if (scrolledDistance !== oldScrolledDistance && scrolledDistance >= maximumScrollableDistance * d.threshold / 100) {

                            clearTimeout($.data(this, 'lys_threshold_timer'));
                            $.data(this, 'lys_threshold_timer', setTimeout(function () {
                                oldScrolledDistance = scrolledDistance;
                                lys.fetch();
                            }, d.requestDelay));
                        }
                    }
                });
        };
    };
})();