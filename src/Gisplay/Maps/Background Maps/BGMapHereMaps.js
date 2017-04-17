import { BGMapWrapper } from './BGMapWrapper';

/**
 * Here Maps as background map provider. 
 * @export
 * @class HereMapsBGMap
 * @extends {BGMapWrapper}
 * @see https://developer.here.com/develop/javascript-api
 * @see https://developer.here.com/javascript-apis/documentation/v3/maps/topics/quick-start.html
 */
export class BGMapHereMaps extends BGMapWrapper {

    /**
     * Creates an instance of Here Maps.
     * @param {Object} bgmap - The Here Maps object.
     * @memberOf HereMapsBGMap
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getElement();
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     * @see http://stackoverflow.com/a/6862022
     */
    createCanvas(id) {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.id = `mapCanvas${id}`;
        mapCanvas.style.position = 'absolute';

        const mapDiv = this.bgMapObject.getElement();//Could be: this.getContainer();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;

        // Here Maps
        mapCanvas.style.pointerEvents = 'none';
        mapDiv.insertBefore(mapCanvas, mapDiv.firstChild.nextSibling);

        const canvas = document.getElementById(`mapCanvas${id}`);
        return canvas;
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        return this.bgMapObject.getZoom();
    }

    /**
     * Returns the longitude(X) of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     * @see https://developer.here.com/api-explorer/maps-js/v3.0/infoBubbles/position-on-mouse-click
     */
    getCenterLng() {
        return ((((180 + this.bgMapObject.getCenter().lng) % 360) + 360) % 360) - 180;
    }

    /**
     * Returns the latitude(Y) of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     * @see https://developer.here.com/api-explorer/maps-js/v3.0/infoBubbles/position-on-mouse-click
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().lat;
    }

    /**
     * Adds a listener to a specified event type.
     * @param {string} eventstr - The event type to add a listen for.
     * @param {Function} eventfunction - The function to be called when the event is fired. The listener function is called with the data object passed to  fire , extended with  target and  type properties.
     * @return {void} 
     */
    addEventListener(eventstr, eventfunction) {
        this.bgMapObject.addEventListener(eventstr, eventfunction);
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        this.addEventListener('drag', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        this.addEventListener('mapviewchange', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        this.addEventListener('tap', e => {
            let coords = this.getBackgroundMapProviderObject().screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
            const lng = coords.lng;
            const lat = coords.lat;
            map.clickEvent(lng, lat);
        });
    }
}