import { Map } from './Map';
import { Legend } from '../Legend';
import { ColorBrewer } from '../Helpers/ColorBrewer';

/**
 * Choropleth implementation 06/03 - 23/03
 */
export class Choropleth extends Map {

    /**
     * Creates an instance of Choropleth.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} userOptions - User options to be used.
     * @memberOf Choropleth
     */
    constructor(bgmap, geometry, userOptions) {
        super(bgmap, geometry, userOptions);
        this.loadOptions(userOptions, bgmap);// this.type = 'CP'; window.maps.push(this);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Choropleth map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override  
     * @memberOf Choropleth
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics) {
            if (aes.isEnabled())
                this.drawTriangles(aes);
            this.drawBorders(aes);
        }
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one polygon row and then insert the Legend to the map. 
     * @override 
     * @memberOf Choropleth
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        for (const aes of this.aesthetics)
            this.legend.insertPolygonRow(aes, this);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme and number of classes associated with the id given.
     * @returns {{colorScheme: string[], numberOfClasses: number}} - Color scheme and number of classes associated with the id given, empty object otherwise.
     * @override 
     * @memberOf Choropleth
     */
    defaults() {
        const options = {};
        options.numberOfClasses = 4;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf Choropleth
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('Choropleth', numClasses, dataNature || "Sequential");
    }
}