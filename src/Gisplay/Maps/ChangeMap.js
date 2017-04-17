import { Map } from './Map';
import { Legend } from '../Legend';
import { Aesthetic } from '../Aesthetic';
import { ColorBrewer } from '../Helpers/ColorBrewer';

/**
 * ChangeMap implementation 07/03
 */
export class ChangeMap extends Map {

    /**
     * Creates an instance of ChangeMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf ChangeMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        options.attr = "change"; //window.maps.push(this);
        this.loadOptions(options, bgmap);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Change map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override 
     * @memberOf ChangeMap
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics) {
            if (aes.isEnabled())
                this.drawTriangles(aes);//this.drawContinuousPolygons(aes);
            this.drawBorders(aes);
        }
    }

    /**
     * Process data loaded by the user. This mothed overrides the parent(Map class) default processData method.
     * @param {JSON} geojson - GeoJSON object.
     * @param {number} numberOfClasses - Number of classes that the Legend will contain.
     * @param {string} classBreaksMethod - Algorithm to be used to calculate class breaks. Only used it class breaks are not given by the user.
     * @param {string[]} colorScheme - Color scheme to be used by this map.
     * @override 
     * @memberOf ChangeMap
     */
    preProcessData(geojson, numberOfClasses, classBreaksMethod, colorScheme) {
        let opts = this.gisplayOptions;
        let gjonFeatures = geojson.features;
        for (let i = 0; i < gjonFeatures.length && i < opts.maxFeatures; i++) {
            let gjsonMinuend = gjonFeatures[i].properties[opts.minuend];
            let gjsonSubtrahend = gjonFeatures[i].properties[opts.subtrahend];
            if (typeof gjsonMinuend === 'number' && typeof gjsonSubtrahend === 'number') {
                this.max = Math.max(this.max, gjsonMinuend - gjsonSubtrahend);
                this.min = Math.min(this.min, gjsonMinuend - gjsonSubtrahend);
            }
        }

        let X = Math.round(this.min + Math.abs(this.min / 3));
        let Y = Math.round(this.min + Math.abs(this.min / 3) * 2);
        let bm = -4;
        let middle = 0;
        let am = 4;
        let Z = Math.round(this.max - Math.abs(this.max / 3) * 2);
        let W = Math.round(this.max - Math.abs(this.max / 3));
        let classBreaks = [this.min, X, Y, bm, am, Z, W, this.max];//this.calcClassBreaks([this.min, X, Y, middle, Z, W, this.max], classBreaksMethod, 6);
        //let classBreaks = [this.min, X, Y, 0, Z, W, this.max];

        const aesarray = []; //Array of aesthetic objects loaded from the file
        let fcolor = this.getDefaultColors(classBreaks.length - 1);
        for (let i = 0; i < classBreaks.length - 1; i++) {
            let [r, g, b] = chroma(fcolor[i]).rgb();
            let aes;
            if (i !== classBreaks.length - 2)
                aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
            else {
                aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
                aes.outer = true;
            }
            aesarray.push(aes);
        }
        /**
         * Aesthetic object. In the case of a Change Map only one Aesthetic exists.
         * @type {Array<Aesthetic>}
         */
        this.aesthetics = aesarray;
    }

    /**
     * Method called to build the Map Legend.
     * Create a gradient and insert legend onto background map.
     * @override 
     * @memberOf ChangeMap
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
     * Defaults for ChangeMap.
     * @memberOf ChangeMap
     */
    defaults() {
        let options = { numberOfClasses: 7 };
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf ChangeMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('ChangeMap', numClasses, dataNature || "Divergent");
    }
}