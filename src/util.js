export function deg2rad(deg) {
    return deg / 180 * Math.PI;
}

export function rgba2glColor(rgba) {
    if (typeof rgba === 'string') {
        if (rgba.length === 5) {
            rgba = rgba.match(/^\#([0-9A-F])([0-9A-F])([0-9A-F])([0-9A-F])$/);
        } else if (rgba.length === 9) {
            rgba = rgba.match(/^\#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/);
        }
        if (rgba) {
            rgba = rgba.slice(1);
        }
    }

    if (rgba instanceof Array) {
        rgba = rgba.map((c, i) => {
            if (typeof c === 'string') {
                if (c.length === 1) {
                    c += c;
                }
                c = parseInt(c, '16');
                if (i === 3) {
                    c /= 255
                }
            }

            if ( i < 3) {
                return c / 255
            } else {
                return c 
            }
        });
    }

    return rgba;
}

export function glColor2rgba(color) {
    color = color.map((c, i) => {
        if ( i < 3) {
            return c * 255
        } else {
            return c
        }
    })
    return `rgba(${color.join(',')})`
}

export function obj2style(obj) {
    const style = [];
    if (obj instanceof Array) {
        for (let item of obj) {
            style.push(obj2style(item));
        }
    } else {
        for (let name in obj) {
            let value = obj[name];
            if (typeof value === 'number') {
                value += 'px';
            }
            style.push(`${name}:${value}`);
        } 
    }

    return style.join(';');
}

export function translateAxis(pos, viewportWidth, viewportHeight) {
    const ox = viewportWidth / 2;
    const oy = viewportHeight / 2;
    return [
        ox + pos[0],
        oy - pos[1],
        pos[2]
    ]
}