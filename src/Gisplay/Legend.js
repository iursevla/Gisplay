/**
 * This class represents the Map Legend. 15/03
 * @see Diogo's thesis page 66/67 + 58/59 + 69(Figures)
 */
export class Legend {
    /**
     * Creates an instance of Legend class.
     * @param {number} id -  The id of the legend.
     * @param {string} title - The title for the legend.
     * 
     * @memberOf Legend
     */
    constructor(id, title) {
        /**
         * Title of the Gisplay map Legend.
         * @type {string}
         */
        this.title = title;
        /**
         * The div that contains the Legend.
         * @type {HTMLDivElement}
         */
        this.legendDiv = null;
        /**
         * The table element where the legend elements will be apppended.
         * @type {HTMLTableElement}
         */
        this.table = null;
        /**
         * Class name for the Legend? Not used?
         * @type {string}
         */
        this.className = null;
        /**
         * The last div to insert in the legend. Only for PSymbol Maps.
         * @type {HTMLDivElement}
         */
        this.lastdiv = undefined;
        /**
         * If it is the first insertion or not. Only for PSymbol Maps.
         * @type {boolean}
         */
        this.firstInsertion = false;
        /**
         * Constant to use when it's a Polygon.
         * @constant {number} POLYGON
         */
        this.POLYGON = 1;
         /**
         * Constant to use when it's a Point.
         * @constant {number} POLYGON
         */
        this.POINT = 2;

        this.init(id, null);
    }

    /**
     * Initialise Legend. Creates a table element and appends title, color element and value element.
     * @param {number} id - The id of this Legend.
     * @param {string} classname - The class name to be usde by the Legend.
     * @memberOf Legend
     */
    init(id, classname) {
        //const mapCanvas = document.getElementById(`mapCanvas${id}`); //@TODO: Remove
        this.legendDiv = document.createElement('div');
        if (classname != undefined && classname != null)
            this.legendDiv.className = classname;
        else
            this.legendDiv.className = '_gisplaylegendBR';

        this.legendDiv.id = `legendDiv${id}`;

        this.table = document.createElement('table');
        this.table.style.zIndex = "2000";
        const thvalue = document.createElement('th');
        const thcolor = document.createElement('th');
        thcolor.style.align = "center";

        this.table.appendChild(thcolor);
        this.table.appendChild(thvalue);

        const titlerow = document.createElement('tr');
        const titletd = document.createElement('td');
        titletd.colSpan = 2;
        titletd.style.textAlign = 'center';
        titletd.style.width = 100;
        const titletext = document.createTextNode(this.title);
        titletd.appendChild(titletext);
        titlerow.appendChild(titletd);
        this.table.appendChild(titlerow);
    }

    /**
     * Inserts one row for the Aesthetic object.
     * Used in Dot Maps.
     * @param {Aesthetic} currentaes - The Aesthetic object 
     * @param {Map} mapobj - The Map object where the point row will be added. 
     * @see Diogo's thesis Page 69 5.1c
     * @memberOf Legend
     */
    insertPointRow(currentaes, mapobj) {
        this.insertRow(currentaes, mapobj, this.POINT);
    }

    /**
     * Inserts one polygon row into the Legend. Used for area based Maps (Choropleth and Chorocromatic).
     * @param {Aesthetic} currentaes  - The Aesthetic object 
     * @param {Map} mapobj - The map where to insert a polygon row.
     * @see Diogo's thesis Page 69 5.1b
     * @memberOf Legend
     */
    insertPolygonRow(currentaes, mapobj) {
        this.insertRow(currentaes, mapobj, this.POLYGON);
    }

    /**
     * Adds one row to the Legend and attaches an on click event to said row.
     * @param {Aesthetic} currentaes  - The Aesthetic object.
     * @param {Map} mapobj - The map where to insert a polygon row.
     * @param {number} type - The type of row to insert. 1=Polygon, 2=Point. @TODO: Should be constant
     * @memberOf Legend
     */
    insertRow(currentaes, mapobj, type) {
        const row = document.createElement('tr');
        const value = document.createElement('td');
        const color = document.createElement('td');
        let text;
        if (typeof currentaes.range[0] === 'number') {
            const mininput = currentaes.range[0] != null ? currentaes.range[0] : mapobj.min;
            const maxinput = currentaes.range[1] != null ? currentaes.range[1] : mapobj.max;
            if (!currentaes.isOuter())
                text = document.createTextNode(`[${mininput}, ${maxinput}[`);
            else
                text = document.createTextNode(`[${mininput}, ${maxinput}]`);
        }
        else
            text = document.createTextNode(currentaes.range[0]);

        value.appendChild(text);
        const colorDiv = document.createElement('div');
        colorDiv.style.position = 'relative';

        const [r, g, b, a] = currentaes.getFillColor();
        const rgba = `rgba(${r},${g},${b},${a})`;
        colorDiv.style['backgroundColor'] = rgba;
        if (type === this.POLYGON) {//polygon
            colorDiv.style.height = 25;
            colorDiv.style.width = 80;
            if (currentaes.getStrokeColor() != null) {//&& currentaes != undefined
                const [r, g, b, a] = currentaes.getStrokeColor();
                colorDiv.style['borderColor'] = `rgba(${r},${g},${b},${a})`;
            }
            colorDiv.className = '_gisplayrectangle';
        }
        else if (type === this.POINT) {//point
            let size;
            if (currentaes.getPointSize() != null)
                size = Math.max(currentaes.getPointSize(), 5);
            else
                size = 25;
            colorDiv.style.height = size;
            colorDiv.style.width = size;
            colorDiv.className = '_gisplaycircle';
        }

        color.appendChild(colorDiv);
        row.appendChild(color);
        row.appendChild(value);

        row.onclick = function () {
            if (mapobj.gisplayOptions.legendToggle) {
                const toFade = !currentaes.enableDisable();
                if (toFade)
                    this.className += " _gisplayfade";
                else
                    this.className = this.className.replace(/(?:^|\s)_gisplayfade(?!\S)/g, '');
            }
            if (mapobj.gisplayOptions.legendOnClickFunction != null && mapobj.gisplayOptions.legendOnClickFunction != undefined)
                mapobj.gisplayOptions.legendOnClickFunction(currentaes);
            mapobj.draw();
        };
        this.table.appendChild(row);
    }

    /**
     * Inserts one Proportional symbols legend element.
     * Used by PSymbols Maps.
     * @param {Aesthetic} currentaes  - The Aesthetic object.
     * @param {Map} mapobj - The map where to insert the proportion symbols element.
     * @param {number} numLegendItems - Number of items to be created.
     * @see Diogo's thesis Page 69 5.1a
     * @memberOf Legend
     */
    insertProportionalSymbols(currentaes, mapobj, numLegendItems) {
        if (this.lastdiv === undefined) {//First insertion
            var row = document.createElement('tr');
            var value = document.createElement('td');
            value.colSpan = 2;
            value.style.textAlign = 'center';
            this.firstInsertion = true;
        }
        else
            this.firstInsertion = false;

        let strokecolor;
        let [sr, sg, sb, sa] = currentaes.getStrokeColor();//console.log("PropSymbols Insert >>>", sr, sg, sb, sa);
        let [r, g, b, a] = currentaes.getFillColor(); //console.log("PropSymbols Insert >>>", r, g, b, a);
        const rgba = `rgba(${r},${g},${b},${a})`;// const rgbc = `rgba(${currentaes.fillColor[0]},${currentaes.fillColor[1]},${currentaes.fillColor[2]},${1})`;

        if (currentaes.getStrokeColor() != null && currentaes != undefined) //TODO: Remove && curr..
            strokecolor = `rgba(${sr},${sg},${sb},${sa})`;
        else
            strokecolor = `rgba(${0},${0},${0},${1})`;

        for (let i = numLegendItems - 1; i >= 0; i--) {
            const current = document.createElement('div');
            let propvalue;
            if (!this.firstInsertion && i === (numLegendItems - 1) || numLegendItems === 1)
                propvalue = currentaes.range[1];
            else
                propvalue = mapobj.min + i / (numLegendItems - 1) * (mapobj.max - mapobj.min);

            const text = document.createTextNode(Math.round(propvalue)); //TODO: this.round(propValue) ?
            current.appendChild(text);
            const colorDiv = document.createElement('div');
            colorDiv.style.position = 'relative';
            colorDiv.style.backgroundColor = rgba;
            colorDiv.className = '_gisplayproportionalcircle';
            colorDiv.style.borderColor = strokecolor;
            const temppointsize = ((mapobj.gisplayOptions.maxPointSize - mapobj.gisplayOptions.minPointSize) / (mapobj.max - mapobj.min)) * (propvalue - mapobj.min);
            const size = Math.max(temppointsize, 7.5);
            colorDiv.style.height = size;
            colorDiv.style.width = size;
            colorDiv.style.inherit = false;

            colorDiv.onclick = function (e) {
                if (mapobj.gisplayOptions.legendToggle) {
                    const toFade = !currentaes.enableDisable();
                    if (toFade)
                        this.className += " _gisplayfade";
                    else
                        this.className = this.className.replace(/(?:^|\s)_gisplayfade(?!\S)/g, '');
                }
                if (mapobj.gisplayOptions.legendOnClickFunction != null && mapobj.gisplayOptions.legendOnClickFunction != undefined)
                    mapobj.gisplayOptions.legendOnClickFunction(currentaes);
                mapobj.draw();

                /*if (!e)
                    var e = window.event; //TODO: Remove??*/
                e.cancelBubble = true;
                if (e.stopPropagation)
                    e.stopPropagation();
            };

            current.appendChild(colorDiv);
            if (this.lastdiv != undefined) {
                this.lastdiv.appendChild(current);
                this.lastdiv = colorDiv;
            }
            else {//1st insertion
                value.appendChild(current);
                this.lastdiv = colorDiv;
            }
        }

        if (this.firstInsertion) {//1st insertion
            row.appendChild(value);
            this.table.appendChild(row);
        }
    }

    /**
     * Appends the legend div element to the map container. Used by all Maps.
     * @param {BGMapWrapper} bgMap - The background map where the legend will be appended to. 
     */
    insertLegend(bgMap) {
        this.legendDiv.appendChild(this.table);
        bgMap.getContainer().appendChild(this.legendDiv);
    }

    /**
     * Inserts in the Legend one gradient according to the Aesthetic object.
     * Use in Change Maps. 
     * @param {Map} mapobj - The map where to insert the gradient row.
     * @param {number} left - Left value of the Legend (minimum change).
     * @param {number} middle - Value at the center of the change(aka break point).
     * @param {number} right - Right value of the legend (maximum value).
     * @see Diogo's thesis page 69 Figure 5.1d
     * @deprecated Not used, since now Change Maps use classes instead of gradient.
     * @memberOf Legend
     */
    insertGradient(mapobj, left, middle, right) {
        const row = document.createElement('tr');
        const value = document.createElement('td');
        const valueDiv = document.createElement('div');
        value.colSpan = 2;
        value.style.textAlign = 'center';
        let numberofAesthetics = 5;
        if (mapobj.aesthetics.length > 5)
            numberofAesthetics = mapobj.aesthetics.length;

        let strcolor = '';
        for (let i = 0; i < numberofAesthetics; i++) {
            let [r, g, b] = mapobj.fcolor(i / numberofAesthetics).rgb();
            let [roundR, roundG, roundB] = [Math.round(r), Math.round(g), Math.round(b)];
            strcolor += `,rgba(${roundR},${roundG},${roundB},${mapobj.gisplayOptions.alpha})`;
        }
        valueDiv.style.background = `-webkit-linear-gradient(left${strcolor})`;

        valueDiv.style.height = 25;
        valueDiv.style.width = 130;

        const row2 = document.createElement('tr');
        const value2 = document.createElement('td');
        const divleft = document.createElement('div');

        value2.colSpan = 2;
        divleft.style.textAlign = 'left';
        divleft.style.width = '33%';
        divleft.style.display = "inline-block";
        const lefttext = document.createTextNode(left);
        const divmid = document.createElement('div');
        divmid.style.textAlign = 'center';
        divmid.style.width = '33%';
        divmid.style.display = "inline-block";
        const text = document.createTextNode(middle);
        const divright = document.createElement('div');
        divright.style.textAlign = 'right';
        divright.style.width = '33%';
        divright.style.display = "inline-block";
        const righttext = document.createTextNode(right);

        divleft.appendChild(lefttext);
        divmid.appendChild(text);
        divright.appendChild(righttext);
        value2.appendChild(divleft);
        value2.appendChild(divmid);
        value2.appendChild(divright);
        value.appendChild(valueDiv);
        row2.appendChild(value2);
        row.appendChild(value);
        this.table.appendChild(row);
        this.table.appendChild(row2);
    }

}