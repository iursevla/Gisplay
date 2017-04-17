/**
 * This file is the entry point for the Gisplay API
 */
import { Gisplay } from './Gisplay/Gisplay';
import { BGMapGoogleMaps } from './Gisplay/Maps/Background Maps/BGMapGoogleMaps';
import { BGMapHereMaps } from './Gisplay/Maps/Background Maps/BGMapHereMaps';
import { BGMapBingMaps } from './Gisplay/Maps/Background Maps/BGMapBingMaps';

module.exports = {

    /** #############   Google Maps example   #############  */
    createGoogleMapsBGMap: function () {
        window.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 49.36855556, lng: -81.66371667 }/*,
            minZoom: 3*/
        });
    },

    startGoogleMapsChoropleth: function () {
        let gm = new BGMapGoogleMaps(window.map);
        let gisplay = new Gisplay();
    
        let options = {
            /*colorScheme: ["white", "yellow", "orange", "red"],*/
           /* numberOfClasses: 4,*/
            attr: 'f3',
            legendTitle: 'Fatals'/*,
            useCustomMapService: true*/
        };

        let reader = new FileReader();
        reader.onloadend = function () {
            let data = JSON.parse(reader.result);
            gisplay.makeChoropleth(gm, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** #############   HERE Maps example   #############  */
    createHereMapsBGMap: function () {
        let platform = new H.service.Platform({
            'app_id': '8fEgxjuheFTYKcvVQhum',
            'app_code': '5z2K0DvfXPNRLVuIaXcfgg'
        });
        let defaultLayers = platform.createDefaultLayers();
        window.map = new H.Map(
            document.getElementById('map'),
            defaultLayers.normal.map,
            {
                zoom: 3,
                center: { lat: 30, lng: -130.4 }
            });
        let mapEvents = new H.mapevents.MapEvents(map);//Enable events
        let behavior = new H.mapevents.Behavior(mapEvents);//Enable zoom and pan
    },

    startHereMapsChoropleth: function () {
        let hereMaps = new BGMapHereMaps(window.map);
        let gisplay = new Gisplay();

        let options = {
            colorScheme: ["white", "yellow", "orange", "red"],
            numberOfClasses: 4,
            attr: 'f3',
            legendTitle: 'Fatals',
            useCustomMapService: true
        };

        let reader = new FileReader();
        reader.onloadend = function () {
            let data = JSON.parse(reader.result);
            gisplay.makeChoropleth(hereMaps, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** #############   Bing Maps example   #############  */
    createBingMapsBGMap: function () {
        window.map = new Microsoft.Maps.Map(document.getElementById('map'), {
            credentials: 'tbS2WTHvuzFWMarVDedF~XGeRrWSh4JVHd1yPrfsUJQ~Al0cgZrtc-S57hQveO9iMLRlZesJBacsvRCzVNsSh5E_TzY8iPE8w_LvRjP2_51i',
            center: new Microsoft.Maps.Location(30, -130),
            zoom: 0
        });
    },

    startBingMapsChoropleth: function () {
        let hereMaps = new BGMapBingMaps(window.map);
        let gisplay = new Gisplay();

        let options = {
            colorScheme: ["white", "yellow", "orange", "red"],
            numberOfClasses: 4,
            attr: 'f3',
            legendTitle: 'Fatals',
            useCustomMapService: true
        };

        let reader = new FileReader();
        reader.onloadend = function () {
            let data = JSON.parse(reader.result);
            gisplay.makeChoropleth(hereMaps, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** #############   Google Maps Dot Map example   #############  */
    startGoogleMapsDotMap: function () {
        let gm = new BGMapGoogleMaps(window.map);
        let gisplay = new Gisplay();

          let options = {
            colorScheme: ["red", "green"],
            attr: 'f1',
            legendTitle: "Alcohol",
            useCustomMapService: true
        };
        
        let reader = new FileReader();
        reader.onloadend = function () {
            let data = JSON.parse(reader.result);
            gisplay.makeDotMap(gm, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },
    /** ######################### HEAT MAP ################################# */
};
