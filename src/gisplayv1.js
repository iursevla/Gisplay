/**
 * This file is the entry point for the Gisplay API
 */
import { Gisplay } from './Gisplay/Gisplay';
import { BGMapMapBox } from './Gisplay/Maps/Background Maps/BGMapMapBox';

module.exports = {

    /** ######################### CHOROPLETH MAPS ################################# */
    //Choropleth
    createBGMap: function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.streets').setView([49.36855556, -81.66371667], 4);
    },

    startChoropleth: function () {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        var options = {
            /*colorScheme: ["white", "yellow", "orange", "red"],*/
            numberOfClasses: 4,
            attr: 'f3',
            legendTitle: 'Fatals'
        };

        var reader = new FileReader();
        reader.onloadend = function () {
            var data = JSON.parse(reader.result);
            gisplay.makeChoropleth(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** ######################### DOT MAPS ################################# */
    //DOT MAP Example 1
    createBGMapDotMap: function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.dark').setView([49.36855556, -81.66371667], 4);
    },

    startDotMap1: function () {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        console.log("starting Dot Map 1...");

        var options = {
            colorScheme: ["red", "green"],
            attr: 'f1',
            legendTitle: "Alcohol"
        };

        var reader = new FileReader();
        reader.onloadend = function () {
            var data = JSON.parse(reader.result);
            gisplay.makeDotMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    //DOT MAP Example 2
    startDotMap2: function () {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        console.log("starting Dot Map 2...");

        var options = {
            colorScheme: ["blue", "red"],
            maxPointSize: 100,
            numberOfClasses: 2,
            classBreaksMethod: "k-means",
            minPointSize: 1,
            attr: 'f2',
            legendTitle: "Fatals"
        };

        var reader = new FileReader();
        reader.onloadend = function () {
            var data = JSON.parse(reader.result);
            gisplay.makeDotMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** ######################### CHANGE MAPS ################################# */
    createBGMapChangeMap: function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.dark').setView([49.36855556, -81.66371667], 4);
    },

    startChangeMap: function () {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        console.log("starting Change Map...");

        var options = {
            colorScheme: ["green", "red"],
            minuend: 'f6',
            subtrahend: 'f2',
            alpha: 1,
            legendTitle: "Change between 2009 and 2013"
        };

        var reader = new FileReader();
        reader.onloadend = function () {
            var data = JSON.parse(reader.result);
            gisplay.makeChangeMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    },

    /** ######################## PROP. SYMBOLS MAPS ########################### */
    createBGPSymbols: function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.dark').setView([49.36855556, -81.66371667], 4);
    },

    startPSymbols: function () {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        console.log("starting Proportional Symbols...");

        var options = {
            maxPointSize: 100,
            minPointSize: 5,
            attr: 'f1',
            alpha: 1.0,
            numberOfLegendItems: 3,
            legendTitle: "Accidents"
        };

        var reader = new FileReader();
        reader.onloadend = function () {
            var data = JSON.parse(reader.result);
            gisplay.makeProportionalSymbolsMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }
};
