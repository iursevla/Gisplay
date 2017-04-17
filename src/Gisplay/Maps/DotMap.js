import { Map } from './Map';
import { Legend } from '../Legend';
import { ColorBrewer } from '../Helpers/ColorBrewer';

/**
 * DotMap implemenetation
 */
export class DotMap extends Map {

    /**
     * Creates an instance of DotMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf DotMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        this.loadOptions(options, bgmap);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Dot map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override
     * @memberOf DotMap
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics)
            if (aes.isEnabled())
                this.drawPoints(aes);
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one point row and then insert the Legend to the map
     * @override 
     * @memberOf DotMap
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        for (const aes of this.aesthetics)
            this.legend.insertPointRow(aes, this);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme and number of classes associated with the id given.
     * @returns {{colorScheme: string[], numberOfClasses: number}}
     * @override 
     * @memberOf DotMap
     */
    defaults() {
        const options = {};
        options.numberOfClasses = 1;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf DotMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('DotMap', numClasses, dataNature || "Sequential");
    }
}