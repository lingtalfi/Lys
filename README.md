Lys (Ling Infinite Scroll)
====================


Another infinite scroll jquery plugin.




Lys can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).





Features
---------------

- simple and lightweight
- easily extendable
- works in Chrome and Firefox: it's not designed for other browsers (I did even not test it in other browsers)



Note: depends on jquery




How does it work?
--------------------


Basically, you have three components:

- a wall, on which your items/content are appended
- a service, which is requested and generates the new items
- sensors, those are "listeners" that decide WHEN to request your service


The real modularity here is brought by the sensors.
A sensor is a callback that defines WHEN to request the service.
It can be anything: when the user reaches the bottom of the wall, or when she clicks a button, or even every 3 seconds 
if you decided so...

 
 

Water and Ball example
----------------------


This example uses a [skin](https://github.com/lingtalfi/lys/#skins).
Notice that you need a server that can serve php pages to run this example.


In this implementation, you still have the wall, but you also have a ball that falls down the wall.
This ball is your imaginary current scroll position.
 
At the bottom of the wall, you have the water, which height you can control.
When the ball reaches the water, the service is requested.


The water and ball skin was designed to provide infinite scrolling on a specific element in your page.
If you need an infinite scrolling for your whole page, you should use another skin (like threshold for instance).


This skin comes with cool css3 transitions that appears at the bottom of your wall.
 
![Water and ball css3 transition at the bottom](http://s19.postimg.org/mggqxdtyb/lys.png)

See how you would use it with the following example:

 
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="/libs/lys/js/lys.js"></script>
    <script src="/libs/lys/js/waterball1.skin.js"></script>
    <link rel="stylesheet" href="/libs/lys/css/waterball1.css">
    <title>Html page</title>
    <style>
        

        #page {
            height: 400px;
            background: #ddd;
            overflow-y: scroll;
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
                skin: "waterBallWithBottomLoader",
                skinParams: {
                    waterHeight: 10,
                    requestDelay: 200
                }
            });
        });
    })(jQuery);
</script>

</body>
</html> 
``` 
 
### Water and ball markup 


Markup is the following:

```xml
<wallContainer>         (css: {position: relative})

    <wall></wall>       (css: {height: 400px; overflow-y: scroll})

    <lys_loader_overlay>
        <lys_loader/>
    </lys_loader_overlay>

</wallContainer>
```


Apart from the wall element, which is the element on which you apply the jquery plugin,
all other elements are by default automatically generated (options.autoMarkup=true).
     
     
     
### Water and ball options

```js
{
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
    startingCount: 1
}
```



Skins
--------

Being able to create your own sensors is a good thing.
However, in the real world, you probably just want to inject an inifinite scroll to your div with one line of code.
This is the motivation behind a skin.


A skin will substantially wrap the basic lys code with useful sensors and parameters.
So much so that a skin is actually a standalone infinite scroll implementation on its own.

The following skins are available so far (based on my personal needs, pull requests are welcome):

- [water and ball](https://github.com/lingtalfi/lys/#water-and-ball-example) 
- [threshold](https://github.com/lingtalfi/lys/#threshold-skin) 


### To use a skin

Use the skin and skinParams lys options.
See the water and ball example, or the threshold example.



Threshold skin
-----------------

Threshold skin is designed to provide infinite scroll on your whole page.

### Setup


In your head, call the appropriate assets:

```html
    <script src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
    <script src="/libs/lys/js/lys.js"></script>
    <script src="/libs/lys/js/threshold.skin.js"></script>
    <link rel="stylesheet" href="/libs/lys/css/threshold.css">
```

Then in your page: 


```html
<script>
    (function ($) {
        $(document).ready(function () {
            $('#my_wall').lys({
                url: "/libs/lys/service/lorem.php",
                skin: "threshold"
            });                
        });
    })(jQuery);
</script>
```

### threshold skin: How does it work?

Threshold let you specify a threshold which represents the percentage of total available scrolling above which 
the request is triggered.

See options for more details.


### threshold skin Options

```js
{
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
}
```
  


 
 
The most basic sensor example
-------------------------
 
The example below shows a sensor that would trigger the request every 3 seconds.
Although not really useful in a real world situation, it helps understanding the concept of sensors.

The most important thing with sensors is to understand that the sole goal of a sensor is to call the lys.fetch method, which triggers the request to the service.

Notice that you need a server that can serve php pages to run this example.


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
            $('#page').lys({
                url: "/libs/lys/service/lorem.php",
                sensors: [
                    function (lys) {
                        setInterval(function () {
                            var myParams = {};
                            lys.fetch(myParams); // the goal of a sensor is to call the lys.fetch method, which triggers the request to the service.
                        }, 3000);
                    }
                ]
            });
        });
    })(jQuery);
</script>

</body>
</html>
```

If you understand the above example, then you can build your own infinite scroll behaviour from scratch.
 
 
 
 
 
Lys default options
-----------------------
 
```js
{
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
} 
``` 
 

 

History Log
------------------
    
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
    
     