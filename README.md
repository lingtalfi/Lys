Lys (Ling Infinite Scroll)
====================


Another infinite scroll jquery plugin.




Lys can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).





Features
---------------

- provide infinite scroll for the whole page (threshold sensor), or for a given element (waterball sensor)
- simple and lightweight
- easily extendable
- works in Chrome and Firefox (but probably not other browsers)



Note: depends on jquery


![Water and ball css3 transition at the bottom](http://s19.postimg.org/mggqxdtyb/lys.png)



How does it work?
--------------------


Basically, you have three components:

- a wall, on which your items/content are appended
- a data provider (or service), which provides the new items to append to the wall 
- sensors, those are "listeners" that decide WHEN to fetch new data from the data provider


A sensor is a callback that can detect anything: when the user reaches the bottom of the wall, or when she clicks a button, 
or even every 3 seconds if you decided so...


Then, you have plugins to enhance the basic behaviour of the lys plugin.
For instance there are plugins to automatically add an ajax loader on your wall while the data are being fetched.

 
 
 

How to use?
----------------------


Let's try a first example (which is in /www/libs/lys/demo/waterball.demo.html by the way).

 
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="/libs/lys/js/lys.js"></script>
	<script src="/libs/lys/js/sensors/waterball.js"></script>
	<script src="/libs/lys/js/plugins/css_wall_loader.js"></script>
	<link rel="stylesheet" href="/libs/lys/css/futurist.css_wall_loader.css">
	<title>Html page</title>
	<style>


		#page {
			height: 400px;
			overflow-y: scroll;
			background: #ddd;
			position: relative;
		}


	</style>
</head>

<body>

<div class="wall" id="page">
	<?php for ($i = 0; $i < 10; $i++): ?>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet cupiditate debitis deleniti eligendi
		impedit
		libero, molestiae officiis perspiciatis porro praesentium quaerat quia quis rem saepe sed sint
		voluptate!
		Accusantium, quis?<br>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam maxime, minima necessitatibus nemo
		repellendus sapiente sed unde vel. Alias atque cum eius esse facere iste nesciunt possimus quidem
		suscipit
		veritatis.
	</p>
	<?php endfor; ?>

</div>


<script>


	(function ($) {
		$(document).ready(function () {
			$('#page').lys({
				url: "/libs/lys/service/lorem.php",
				sensors: [new lys.sensors.waterball()],
				plugins: [new lys.plugins.cssWallLoader()],
				onFetchSuccess: function (lys, content) {
					lys.jElement.append('<p>' + content + '</p>');
				}
			});
		});
	})(jQuery);
</script>

</body>
</html> 
``` 



This example used the waterball sensor, which listens to the scrolling movement of a given element on the page.
When the unscrolled area goes down an arbitrary threshold, the sensor calls the lys.fetch method, which in turns 
appends new data to the "wall" (the element that contains all the items).

For more information about the waterball sensor, please browse the source code comments.


     

 
A mini sensor tutorial
-------------------------
 
The example below shows a (pretty useless in real life) sensor that would fetch data every 3 seconds,
and append them to the #page element.

Although not really useful in a real world situation, it helps understanding the concept of sensors.

The most important thing with sensors is to understand that the goal of a sensor is to call the lys.fetch method 
when appropriate.

Notice that you need a server that can serve php pages to run this example, because the data provider is 
the www/libs/lys/service/lorem.php php script.



```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="/libs/lys/js/lys.js"></script>
    <title>Html page</title>
    <style>


        #page {
            height: 400px;
            background: #ddd;
            overflow-y: scroll;
        }
        
    </style>
</head>

<body>

<div id="page"></div>


<script>

    (function ($) {
        $(document).ready(function () {
            
            var mySensor = function(){
                this.listen = function(lys){
                    setInterval(function () {
                        lys.fetch(); // the goal of a sensor is to call the lys.fetch method
                    }, 3000);
                };
            };
            
            
            $('#page').lys({
                url: "/libs/lys/service/lorem.php",
                sensors: [new mySensor()]
            });
        });
    })(jQuery);
</script>

</body>
</html>
```

If you understand the above example, then you can build your own infinite scroll behaviour from scratch.
 
 
 
 
 
Lys options
-----------------------
 
```js
{
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
     * Whether or not to use the tim protocol to communicate with the data provider
     */
    useTim: false,
    /**
     * A callable to call when the data provider responds with a tim failure message,
     * or null (default tim handler).
     */
    onTimError: null,
    /**
     * The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * http://api.jquery.com/jquery.post/
     */
    dataType: null,
    /**
     * The url params to start with.
     * It's a map.
     */
    urlParams: {},
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
} 
``` 
 
 
 
Lys public properties
-----------------------
 
- element, the dom element on which the lys object was called, which by convention is the wall  
- jElement, a jquery handle to the wall (by convention)
- settings, the options passed to the lys object 


Note that if lys is an instance of the lys object, $(lys.element) and lys.jElement are equivalent.


Lys public methods 
---------------------


### fetch 

```js
/**
 * This method fetches data from the service provider.
 * It is called by the sensors, or you can call it manually.
 *
 * The "parameters" parameter can be one of the following:
 * 
 * - map, a map to merge with the urlParams and, if using it, the count parameter.
 *              The resulting map will be passed to the data provider upon requesting the data.
 *              
 * - str=raw, this is a hack that allows you to call disable the onFetchBefore
 *                      and onFetchAfter hooks that otherwise always fire.
 *                      You might need this hack if you use the fetch method manually.
 *                      
 *                      The original motivation was to load the first page of data via lys.fetch,
 *                      but without having the css transition of a loader showing up (assuming the loader plugin 
 *                      is hooked to the onFetchBefore and onFetchAfter events, and that no other plugin
 *                      uses those hooks).
 *                      There might be other workarounds to this problem, but this was a simple one.
 * 
 * 
 */
void    fetch ( void|map:sensorParams )
```
   
         
### setCountValue 
 
```js 
/**
 * Sets the current count value.
 * Use this to manually control the count value.
 */
void    setCountValue ( int:newCount )
``` 


### setUrlParams

```js
/**
 * Sets the current urlParams value.
 * This value will be merged into the map that is sent to the data provider;
 * the merging occurs on every request.
 */
void    setUrlParams ( map )         
```



Related 
-------------
- [jInfiniteSlider](https://github.com/lingtalfi/jInfiniteSlider): infinite slider jquery plugin 

 

History Log
------------------
    
- 2.2.0 -- 2016-02-02

    - add deaf option for threshold sensor
    - add fnSuccess argument to lys.fetch method
    
- 2.1.0 -- 2016-02-01

    - add dataType, useTim, onTimError, urlParams options
    - add skip argument hack for fetch method
    - add setUrlParams method
    
- 2.0.0 -- 2016-01-31

    - reforged the whole plugin, lys is now better decoupled
        
- 1.4.0 -- 2016-01-31

    - waterball1: urlParams can be a function too
    - waterball1: fix bug for retrieving lys instance 
    - waterball1: enhance setCount method
        
    
- 1.3.0 -- 2016-01-30

    - add lys_waterball namespace for mousewheel event
    - add lys_waterball urlParams, autoIncrementedUrlParamName, and pluginParams options
    - fix bug for retrieving lys instance

- 1.2.0 -- 2016-01-25

    - add startingCount option for waterball and threshold skins 
    - fix loader stop placement  
    
- 1.1.0 -- 2016-01-25

    - add threshold skin 
    
    
- 1.0.0 -- 2016-01-24

    - initial commit
    
     