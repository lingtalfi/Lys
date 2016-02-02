/**
 * Adds a loader to the page.
 *
 *
 * Html Markup
 * ---------------
 *
 * <body>
 *      <#lys_css_main_loader>
 *          <.loader/>
 *      </>
 * </>
 *
 *
 * Note: The idea is to append a css loader once per session (until page refresh).
 *
 *
 * Note: the markup can be auto-generated from the wall if you set
 * the autoMarkup option to true, which is the default.
 *
 *
 *
 */
lys.plugins.cssMainLoader = function (options) {
    var d = $.extend({
        /**
         * Whether or not to automatically build the necessary markup.
         * Default is true.
         */
        autoMarkup: true
    }, options);
    var jBody = $('body');
    var jOverlay;
    this.init = function (lys) {
        if (true === d.autoMarkup) {
            if (0 === jBody.find('#lys_css_main_loader').length) {
                jBody.append('<div id="lys_css_main_loader"><div class="loader"></div></div>');
            }
        }
        jOverlay = jBody.find('#lys_css_main_loader');
    };
    this.onFetchBefore = function (lys) {
        jOverlay.addClass('active');
    };
    this.onFetchAfter = function (lys) {
        setTimeout(function () {
            jOverlay.removeClass('active');
        }, 1000);
    };
};