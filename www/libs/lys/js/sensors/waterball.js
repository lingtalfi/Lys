//------------------------------------------------------------------------------/
// WATER AND BALL
//------------------------------------------------------------------------------/
/**
 * Use this if you want to scroll a wall element on its own.
 * 
 * 
 * 
 * The ball falls from a wall, down to the water...
 * When the ball reaches the water, new data is fetched.
 *
 *
 * Setup
 * ----------
 * 
 * The wall must have a (css) height, and it's overflow in y must be scroll.
 * 
 * 
 */
lys.sensors.waterball = function (options) {
    var d = $.extend({
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
         * Default is 200.
         */
        requestDelay: 200
    }, options);
    this.listen = function (lys) {
        var wallHeight = lys.jElement.height();
        
        lys.jElement.on('mousewheel.lys_waterball DOMMouseScroll.lys_waterball', function (e) {
            var zis = this;
            clearTimeout($.data(this, 'timer'));
            $.data(this, 'timer', setTimeout(function () {
                var scrollDown = $(zis).scrollTop() + wallHeight;
                var triggerValue = $(zis).prop('scrollHeight') - d.waterHeight;
                if (scrollDown >= triggerValue) {
                    lys.fetch();
                }
            }, d.requestDelay));
        });
    };
};
