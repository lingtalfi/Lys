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

        $(window)
            .off('scroll.lys_threshold')
            .on('scroll.lys_threshold', function () {
                
                var scrolledDistance = $(window).scrollTop();
                var maximumScrollableDistance = $(document).height() - $(window).height();
                if (scrolledDistance >= maximumScrollableDistance * d.threshold / 100) {
                    clearTimeout($.data(this, 'lys_threshold_timer'));
                    $.data(this, 'lys_threshold_timer', setTimeout(function () {
                        lys.fetch();
                    }, d.requestDelay));
                }
            });
    };


};
