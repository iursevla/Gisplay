//Intermediate API

/**
 * This class represents a Feature. Each feature belongs to one Aesthetic element.
 * @exports Feature
 * @class Feature
 */
export class Feature {
    /**
     * Creates an instance of Feature.
     * @example 1-> {"id":0,"properties":{"f1":"Alabama","f2":"Autauga","f3":150,"_gisplayid":0},
                     "triangles":[{"itemSize":2,"numItems":417}],"borders":[{"itemSize":2,"numItems":141}],"points":[]}
     * @param {number} id - This Feature id.
     * @param {{fx: string, _gisplayid:number}} properties - Properties associated with this Feature.  
     * @param {{itemSize: number, numItems: number}} triangles - Number of triangles associated with this Feature. 
     * @param {{itemSize: number, numItems: number}} borders - Number of borders associated with this Feature.
     * @param {number[]} points - The points that belong to this Feature.
     * 
     * @memberOf Feature
     */
    constructor(id, properties, triangles, borders, points) {
        /**
         * This Feature id.
         * @type {number} 
         */
        this._id = id;
        /**
         * Properties associated with this Feature.
         * @type {{fx: string, _gisplayid:number}}  
         */
        this._properties = properties;
        /**
         * Number of triangles associated with this Feature. The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._triangles = triangles;
        /**
         * Number of borders associated with this Feature. The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._borders = borders;
        /**
         * The points that belong to this Feature.  The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._points = points;
    }

    /**
     * Returns all triangles that belong to the Feature.
     * @returns {Feature._triangles} - All triangles that belong to the Feature.
     * @memberOf Feature
     */
    getTriangles(){
        return this._triangles;
    }

     /**
      * Returns all borders that belong to the Feature.
      * @returns {Feature._borders} - All borders that belong to the Feature.
      * @memberOf Feature
      */
    getBorders(){
        return this._borders;
    }

     /**
      * Returns all points that belong to the Feature.
      * @returns {Feature._points} - All points that belong to the Feature.
      * @memberOf Feature
      */
    getPoints(){
        return this._points;
    }

    /**
     * Returns all properties that belong to the Feature.
     * @returns {Feature._properties}
     * @memberOf Feature
     */
    getProperties(){
        return this._properties;
    }
}
