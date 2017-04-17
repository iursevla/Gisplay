import { Choropleth } from './Maps/Choropleth';
import { DotMap } from './Maps/DotMap';
import { ChangeMap } from './Maps/ChangeMap';
import { ProportionalSymbolsMap } from './Maps/ProportionalSymbolsMap';

/**
 * Gisplay API entry point with one method for each map available.
 */
export class Gisplay {

    /**
     * Creates an instance of the Gisplay API.
     * @memberOf Gisplay
     */
    constructor() {
        /**
         * @type {Array} - Array of maps. @WHY?
         */
        window.maps = new Array();
        /**
         * @type {number} - The number of maps. Used to mark each one with a different id.
         */
        window.mapcount = 0;

        //WebGL API
        /**
         * @type {number} - The number of vertices produced. @WHY?
         * @deprecated
         */
        window._vertexcount = 0;
        /**
         * @type {number} - The number of triangles. @WHY?
         * @deprecated
         */
        window._tricount = 0;
    }

    /**
     * Creates a map of type Choropleth.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).- Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChoropleth(bgmap, geometry, options) {
        const gismap = new Choropleth(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Dot Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeDotMap(bgmap, geometry, options) {
        const gismap = new DotMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Change Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChangeMap(bgmap, geometry, options) {
        const gismap = new ChangeMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Proportional Symbols Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeProportionalSymbolsMap(bgmap, geometry, options) {
        const gismap = new ProportionalSymbolsMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Chorocromatic Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChorochromaticMap(bgmap, geometry, options) {
        const gismap = new ChorochromaticMap(bgmap, geometry, options);
        gismap.makeMap();
    }
}