# Demos

Here you can find Demos and the distribution code for the Gisplay API. 

1. ```ChangeMapHere.html``` - Change Map with Here Maps as background provider.  Paper fig 2.d
1. ```ChangeMapMapBox.html``` - Change Map with MapBox as background provider.
1. ```ChoroplethGoogle.html``` - Choropleth with Google Maps as background provider. Paper fig 2.a
1. ```ChoroplethMapbox.html``` - Choropleth with MapBox as background provider.
2. ```DotMap.html``` - Dot Map with Mapbox as background provider.  Paper fig 2.c
3. ```PSymbols.html``` - Proportional Symbols with MapBox as background provider.  Paper fig 2.b


# Usage

To use the Gisplay API just create a html file with 

```<script type="text/javascript" src="Gisplay.js"></script>```

and 

```
    <input type="file" id="file" name="files">
    <button id="submit" onclick="GisplayLibrary.startChoropleth();">Ok</button>
    <div id="map"></div>
   
    <script>
        window.onload = function () {
            GisplayLibrary.createBGMap();
        };
    </script>
```

Where ```createBGMap()``` is the method inside the class GisplayLibrary that creates the background map  and  ```startChoropleth()``` is the method to call when the user loads a dataset and clicks "Ok".

See [Documentation](https://iursevla.github.io/gisplayv2Demos/esdoc/source.html) in case you need help.
