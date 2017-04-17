import { Map } from './Map';
import { Legend } from '../Legend';
import { ColorBrewer } from '../Helpers/ColorBrewer';

/**
 * Proportional Symbols Map implementation.
 */
export class ProportionalSymbolsMap extends Map {

    /**
     * Creates an instance of ProportionalSymbolsMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf ProportionalSymbolsMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        this.loadOptions(options, bgmap);
        this.gisplayOptions.isDynamic = !options.sizeByClass;
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw ProportionalSymbols map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    draw() {
        this.clear();
        if (!this.gisplayOptions.isDynamic) {
            for (let i = this.aesthetics.length - 1; i >= 0; i--)
                if (this.aesthetics[i].isEnabled())
                    this.drawPoints(this.aesthetics[i]);
        }
        else {
            for (let i = this.aesthetics.length - 1; i >= 0; i--)
                if (this.aesthetics[i].isEnabled())
                    this.drawProportionalPoints(this.aesthetics[i]);
        }
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one proportional symbol row and then insert the Legend to the map. 
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        if (this.aesthetics.length === 1)
            this.legend.insertProportionalSymbols(this.aesthetics[0], this, this.gisplayOptions.numberOfLegendItems);
        else
            for (let i = this.aesthetics.length - 1; i >= 0; i--) {
                if (i === 0)
                    this.legend.insertProportionalSymbols(this.aesthetics[i], this, 2);
                else
                    this.legend.insertProportionalSymbols(this.aesthetics[i], this, 1);
            }
        // i == 0 ? this.legend.insertProportionalSymbols(this.aesthetics[i], this, 2) : this.legend.insertProportionalSymbols(this.aesthetics[i], this, 1);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme, number of classes, minimum point size and max point size associated with the id given.
     * @returns {{maxPointSize: number, minPointSize: number, colorScheme: string[], numberOfClasses: number}}
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    defaults() {
        const options = {};
        options.maxPointSize = 60;
        options.minPointSize = 5;
        options.numberOfClasses = 1;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('ProportionalSymbols', numClasses, dataNature || "Sequential");
    }
}