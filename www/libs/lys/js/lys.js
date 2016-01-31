(function ($) {

    /**
     * The fundamentals:
     *
     * The wall is where you append the new items.
     * You have sensors that listen to arbitrary events.
     * A sensor decide WHEN to fetch new data.
     *
     * Data is provided by the data provider, which probably is an ajax service.
     * You can use plugins to add functionality to this lys core,
     * like handling an overlay system that shows up when new data arrives, and pops out
     * once data is appended.
     *
     *
     */

    var pluginName = 'lys';
    window.lys = {
        sensors: {},
        plugins: {}
    };


    function devError(m) {
        alert(pluginName + ' dev error: ' + m);
    }


    $[pluginName] = function (element, options) {

        var zis = this;

        var defaults = {
            //------------------------------------------------------------------------------/
            // MAIN OPTIONS
            //------------------------------------------------------------------------------/
            /**
             * The url of the data provider
             */
            url: '/libs/lys/service/lorem.php',
            /**
             * A sensor is responsible for detecting WHEN the new data should be fetched.
             * It could be on page scroll, or on a button click, or other things...
             *
             * A sensor is an object with a listen method.
             *
             *      void        sensor.listen ( lys )
             *                          The GOAL of the method is to call the lys.fetch method at some point.
             *
             *                          // do something, then...
             *                          var params = {};
             *                          lys.fetch(params); // call this method when you need it...
             *
             *
             */
            sensors: [],
            /**
             * Plugins are objects that can add functionality to the lys core.
             * The possible methods are the following:
             *
             * - void       init ( lys )
             * - false      onFetchBefore ( lys )
             *                  If false is returned, it stops the propagation (subsequent
             *                  plugins' onFetchBefore method is not called)
             *                  and the data provider is not fetched.
             *
             * - void       onFetchAfter ( lys )
             */
            plugins: [],
            //------------------------------------------------------------------------------/
            // COUNT RELATED OPTIONS
            //------------------------------------------------------------------------------/
            /**
             * Count is a system that automatically appends an auto-incremented field to
             * the params sent to the data provider.
             * The count parameter is only incremented when the data provider is actually requested.
             *
             */
            /**
             * Whether or not to use the count system
             */
            useCount: true,
            /**
             * The name of the count parameter
             */
            countParamName: "count",
            /**
             * The default count value to start with
             */
            countValue: 1,
            //------------------------------------------------------------------------------/
            // FETCH RELATED OPTIONS
            //------------------------------------------------------------------------------/
            /**
             * This callback is fired just before the service is requested.
             * If the callback returns false, then the service is NOT requested.
             *
             * - lys is the lys instance
             * - sensorParams are the params that are sent to the service.
             */
            onFetchBefore: function (lys, sensorParams) {
            },
            /**
             * This callback is called after that the request to the service has been executed,
             * even if the request was a failure.
             *
             * It simply is called via the .always() jquery method
             * https://api.jquery.com/deferred.always/
             *
             *
             *
             */
            onFetchAfter: function (lys, sensorParams) {
            },
            /**
             * This callback is called after you receive content from a (successful) request to the server.
             * It is mainly used to append the new content to your wall.
             */
            onFetchSuccess: function (lys, content) {
                lys.jElement.append(content);
            }
        };

        var d = $.extend({}, defaults, options); // readonly
        var count = d.countValue; // this is meant as a private property

        //------------------------------------------------------------------------------/
        // PUBLIC PROPERTIES
        //------------------------------------------------------------------------------/
        this.element = element;
        this.jElement = $(element);
        this.settings = d;


        //------------------------------------------------------------------------------/
        // PRIVATE METHODS
        //------------------------------------------------------------------------------/
        /**
         * args must be an array []
         */
        function callPlugins(method, args, stopOnFalse) {
            for (var i in d.plugins) {
                if (method  in d.plugins[i]) {
                    var res = d.plugins[i][method].apply(d.plugins[i][method], args);
                    if (false === res && true === stopOnFalse) {
                        return false;
                    }
                }
            }
        }

        function getUrlParams() {
            if ('function' === typeof d.urlParams) {
                return d.urlParams();
            }
            return d.urlParams;
        }


        //------------------------------------------------------------------------------/
        // PUBLIC METHODS
        //------------------------------------------------------------------------------/
        this.fetch = function (sensorParams) {
            var zis = this;
            sensorParams = $.extend(sensorParams, getUrlParams());

            if (false !== d.onFetchBefore(zis, sensorParams)) {
                if (false !== callPlugins('onFetchBefore', [zis], true)) {


                    if (true === d.useCount) {
                        sensorParams[d.countParamName] = count++;
                    }

                    $.post(d.url, sensorParams, function (content) {


                        d.onFetchSuccess(zis, content);


                    }).always(function () {
                        d.onFetchAfter(zis, sensorParams);
                        callPlugins('onFetchAfter', [zis]);
                    });
                }
            }
        };

        this.setCountValue = function (v) {
            count = v;
        };

        //------------------------------------------------------------------------------/
        // START THE SENSORS...
        //------------------------------------------------------------------------------/
        for (var i in d.sensors) {
            d.sensors[i].listen(zis);
        }


        //------------------------------------------------------------------------------/
        // PLUGIN INIT
        //------------------------------------------------------------------------------/
        callPlugins('init', [this]);
    };


    $[pluginName].prototype = {};


    //------------------------------------------------------------------------------/
    // MAKE IT A JQUERY PLUGIN
    //------------------------------------------------------------------------------/
    $.fn[pluginName] = function (options) {

        return this.each(function () {
            if (undefined == $(this).data(pluginName)) {
                var plugin = new $[pluginName](this, options);
                $(this).data(pluginName, plugin);
            }
        });

    }

})(jQuery);