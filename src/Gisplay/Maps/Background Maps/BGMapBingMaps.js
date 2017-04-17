import { BGMapWrapper } from './BGMapWrapper';

/**
 * Bing Maps as background map provider. 
 * @export
 * @class BGMapBingMaps
 * @extends {BGMapWrapper}
 * @see https://msdn.microsoft.com/en-us/library/mt712542.aspx
 */
export class BGMapBingMaps extends BGMapWrapper {

    /**
     * Creates an instance of Bing Maps.
     * @param {Object} bgmap - The Bing Maps object.
     * @memberOf BGMapBingMaps
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getRootElement();
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

        const mapDiv = this.bgMapObject.getRootElement();//Could be: this.getContainer();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;

        // Bing Maps
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
     * @see 
     */
    getCenterLng() {
        return this.bgMapObject.getCenter().longitude;
    }

    /**
     * Returns the latitude(Y) of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     * @see 
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().latitude;
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'mousewheel', fun);
        // this.addEventListener('move', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'viewchange', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'click', (e) => {
            let point = new Microsoft.Maps.Point(e.getX(), e.getY());
            let loc = e.target.tryPixelToLocation(point);
            const lng = loc.longitude;
            const lat = loc.latitude;
            map.clickEvent(lng, lat);
        });
        /* this.addEventListener('click', e => {
             const lng = ((((180 + e.latlng.lng) % 360) + 360) % 360) - 180;
             const lat = e.latlng.lat;
             map.clickEvent(lng, lat);
         });*/
    }
}