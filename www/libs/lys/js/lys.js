(function ($) {


    var pluginName = 'lys';
    var pluginSensorName = pluginName + 'Sensor';
    window.lysSkins = {};


    function devError(m) {
        alert(pluginName + ' dev error: ' + m);
    }


    $[pluginName] = function (element, options) {
        var zis = this;

        var defaults = {
            /**
             * The url of the service
             */
            url: '/libs/lys/service/lorem.php',
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
                $(lys.element).append(content);
            },
            /**
             * A sensor is responsible for detecting WHEN the fetch service should be called.
             * It could be on page scroll, or on a button click, or other things...
             * 
             * A sensor is just a callback, and its GOAL is to call the lys.fetch method.
             * 
             *      void        callable:sensor ( lys )
             *                          // do something, then...
             *                          var requestParams = {};
             *                          lys.fetch(requestParams); // call this method when you need it...    
             *                              
             * 
             */
            sensors: [],
            /**
             * The name of the skin you want to use.
             * A skin is like a preset of sensors and more.
             * 
             * With the power of skins, it's easy to do one liner setups...
             */
            skin: null,
            /**
             * The options of the skin you want to use
             */
            skinParams: {}
        };


        this.settings = $.extend({}, defaults, options);
        this.element = element;


        //------------------------------------------------------------------------------/
        // ATTACHING SKINS
        //------------------------------------------------------------------------------/
        if (null !== this.settings.skin) {
            if (this.settings.skin in window.lysSkins) {
                window.lysSkins[this.settings.skin](this, this.settings.skinParams);
            }
            else {
                devError("Undefined skin: " + this.settings.skin);
            }
        }


        this.attachSensor = function (sensorCb) {
            zis.settings.sensors.push(sensorCb);
        };


        //------------------------------------------------------------------------------/
        // FIRE THE SENSORS
        //------------------------------------------------------------------------------/
        for (var i in zis.settings.sensors) {
            zis.settings.sensors[i](zis);
        }
    };

    $[pluginName].prototype = {
        applySkin: function (lys) {

        },
        fetch: function (sensorParams) {
            var zis = this;
            if (false !== zis.settings.onFetchBefore(zis, sensorParams)) {
                $.post(zis.settings['url'], sensorParams, function (content) {
                    zis.settings.onFetchSuccess(zis, content);
                }).always(function () {
                    zis.settings.onFetchAfter(zis, sensorParams);
                });
            }
        }
    };


    //------------------------------------------------------------------------------/
    // MAKE IT A JQUERY PLUGIN
    //------------------------------------------------------------------------------/
    $.fn[pluginName] = function (options) {

        return this.each(function () {
            if (undefined == $(this).data(pluginName)) {
                var plugin = new $[pluginName](this, options);
                $(this).data([pluginName], plugin);
            }
        });

    }

})(jQuery);