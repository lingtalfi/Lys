/**
 * Adds a loader to the wall.
 *
 * Html Markup
 * ---------------
 *
 * <.lys .wall_container (.active) (+options)>
 *      <wall/>
 *      <.overlay>
 *          <.loader/>
 *      </>
 * </>
 *
 *
 * Note: The idea is that the wall container wraps the wall and have
 * the exact same dimensions.
 * The wall container is css positioned, so that the overlay can expand and give
 * the illusion of overlaying the whole wall, but only the wall.
 *
 * The loader is placed inside at the css implementor discretion.
 * Since this is a general mechanism (paradigm?) that applies to any element,
 * I would suggest creating different css stylesheets of it.
 *
 *
 * Note: the markup can be auto-generated from the wall if you set
 * the autoMarkup option to true, which is the default.
 *
 *
 * Note: the lys class on the .wall_container element is used to help prevent css conflicts.
 *
 *
 * Html markup options
 * ------------------------
 *
 * Some stylesheet might provide options.
 *
 *
 *
 *
 */
lys.plugins.cssWallLoader = function (options) {

    var d = $.extend({
        /**
         * Whether or not to automatically build the necessary markup.
         * Default is true.
         */
        autoMarkup: true
    }, options);


    var jWallContainer;


    this.init = function (lys) {
        var jWall = lys.jElement;
        if (true === d.autoMarkup) {
            jWall.wrap('<div class="lys wall_container"></div>');
            jWall.after('<div class="overlay"><div class="loader"></div></div>');
        }
        
        jWallContainer = jWall.closest('.wall_container');
    };

    this.onFetchBefore = function (lys) {
        jWallContainer.addClass('active');
    };
    
    this.onFetchAfter = function (lys) {
        setTimeout(function () {
            jWallContainer.removeClass('active');
        }, 1000);
    };
};