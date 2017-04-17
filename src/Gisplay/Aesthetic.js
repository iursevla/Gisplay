import { Feature } from './Feature';

/**
 * Class that represents an aesthetic element. There will be one Aesthetic class for each class on the Legend.
 * @export
 * @class Aesthetic
 */
export class Aesthetic {

    /**
     * Creates an instance of Aesthetic. 
     * There will be as many Aesthetic objects as the number of classes on the Legend. 
     * @example 1-> {"id":0,"attr":"f3","fcolor":[255,255,255,0.8],
     *         "stroke":[0,0,0,1],"pointsize":null,"range":[1,37]}
     * @example 2-> {"id":1,"attr":"f3","fcolor":[255,255,0,0.8],
     *         "stroke":[0,0,0,1],"pointsize":null,"range":[37,78]}
     * @param {number} id - The unique id of the Aesthetic object.
     * @param {string} attr - The attribute being mapped on this Aesthetic.
     * @param {number[]|Function} fcolor - The color to fill the Aesthetic element(RGBA).
     * @param {number[]} stroke - Stroke color values(RGBA).
     * @param {number|null} pointsize - Size of the Aesthetic point to be drawn (Used only in maps that require dots to be drawn).
     * @param {number[]} range - The range for this particular Aesthetic element.
     * 
     * @memberOf Aesthetic
     */
    constructor(id, attr, fcolor, stroke, pointsize, range) {
        /**
         * The unique id of the Aesthetic object. 
         * @type {number}
         */
        this.id = id;
        /**
         * The attribute being mapped on the Aesthetic.
         * @type {string}
         */
        this._attr = attr;
        /**
         * The color to fill the Aesthetic element(RGBA) OR a function to create this color.
         * @type {number[4]|Function}
         */
        this.fillColor = fcolor;
        /**
         * Stroke color values(RGBA).
         * @type {number[4]}
         */
        this.strokeColor = stroke;
        /**
         * The size of the Aesthetic point to be drawn (Used only in maps that require dots to be drawn).
         * @type {number|null}
         */
        this.pointSize = pointsize === null ? 1.0 : parseFloat(pointsize);
        /**
         * The range for this particular Aesthetic element.
         * @type {number[2]}
         */
        this.range = range;
        /**
         * This Array will keep track of all Features associated with this Aesthetic object.
         * @type {Array<Feature>}
         */
        this._features = new Array();
        /**
         * This Array is used for? 
         * @todo
         * @type {Array<Feature>}
         */
        this._allFeatures = new Array();
        /**
         * This particular element will be active or not in the Legend.
         * @type {boolean}
         */
        this.enabled = true;//Elemento da legenda ativo ou desativo
        /**
         * Outer is used for the last element of the Legend. Example [500, 1000]<
         * @type {boolean}
         */
        this.outer = false;
    }

    /**
     * Adds a new feature to this Aesthetic object.
     * @param {number} id - The Feature id. Each feature will have a different id inside this Aesthetic object.
     * @param {{fx: string, _gisplayid:number}} properties - Properties associated with the Feature.
     * @param {{itemSize: number, numItems: number}} triangles - Number of triangles associated with the Feature.
     * @param {{itemSize: number, numItems: number}} borders - Number of borders associated with the Feature.
     * @param {{itemSize: number, numItems: number}} points - The points that belong to the Feature.
     * 
     * @memberOf Aesthetic
     */
    addFeature(id, properties, triangles, borders, points) {
        this._features.push(new Feature(id, properties, triangles, borders, points));
    }

    /**
     * Gets this Aesthetic attribute.
     * @returns {Aesthetic._attr} - The string representing the attr of this Aesthetic.
     * 
     * @memberOf Aesthetic
     */
    getAttr() {
        return this._attr;
    }

    /**
     * Verifies the existence or not of the property Aesthethic._attr and if it fits inside this Aesthetic range.
     * @param {string} value - The attribute ?.
     * @returns {boolean} - True if there's no range or it is inside the range or ?, otherwise, false.
     * 
     * @memberOf Aesthetic
     */
    checkProperty(value) {
        if (this.range === null)
            return true;
        else {
            if (typeof value === 'number')
                return ((this.range[0] === null || value >= this.range[0]) &&
                    (this.range[1] === null || (value < this.range[1] || (value <= this.range[1] && this.isOuter()))));
            else
                return (value === this.range[0]);
        }
    }

    /**
     * Add new grouped feature. Only used for Maps with points. 
     * @todo Finish document of this method.
     * @param {number} id - The id of the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} triangles - Triangles that belong to the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} borders - Borders that belong to the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} points - Points that belong to the Feature.
     * @see Diogo's thesis page 57/58
     */
    addGroupedFeature(id, triangles, borders, points) {
        this._allFeatures.push(new Feature(id, null, triangles, borders, points));
    }

    /**
     * Inverts this Aesthetic element state in the Legend object.
     * If it was enabled it will be disabled or vice-versa.
     * @returns {boolean} Inverse of current enabled value.
     */
    enableDisable() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Returns all Features that belong to this Aesthetic object.
     * @returns {Array<Feature>} - All the Features of this Aeshtetic.
     * @memberOf Aesthetic
     */
    getFeatures() {
        return this._features;
    }

    /**
     * Returns all Features as one?
     * @returns {Array<Feature>} - All features grouped together?
     * @memberOf Aesthetic
     */
    getAllFeatures() {
        return this._allFeatures;
    }

    /**
     * Returns the stroke color for this Aesthetic object.
     * @returns {Aesthetic#strokeColor}
     * @memberOf Aesthetic
     */
    getStrokeColor() {
        return this.strokeColor;
    }

    /**
     * Returns the fill color for this Aesthetic object.
     * @returns {Aesthetic#fillColor}
     * @memberOf Aesthetic
     */
    getFillColor() {
        return this.fillColor;
    }

    /**
     * Returns the size of this Aesthetic points.
     * @returns {number} - The size of the point. 
     * @memberOf Aesthetic
     */
    getPointSize(){
        return this.pointSize;
    }

    /**
     * Returns if this Aesthetic is outer or not.
     * @returns {boolean} - true if it is outer, false, otherwise.
     * @memberOf Aesthetic
     */
    isOuter(){
        return this.outer;
    }

    /**
     * Verifies if this Aeshtetic element is enable on the Legend or not.
     * @returns {boolean} - True if it's enabled, false, otherwise.
     * @memberOf Aesthetic
     */
    isEnabled() {
        return this.enabled;
    }
}