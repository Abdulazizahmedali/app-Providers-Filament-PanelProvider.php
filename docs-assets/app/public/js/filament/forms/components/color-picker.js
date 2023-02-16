var clamp = (number, min = 0, max = 1) =>
        number > max ? max : number < min ? min : number,
    round = (number, digits = 0, base = Math.pow(10, digits)) =>
        Math.round(base * number) / base
var angleUnits = { grad: 360 / 400, turn: 360, rad: 360 / (Math.PI * 2) },
    hexToHsva = (hex) => rgbaToHsva(hexToRgba(hex)),
    hexToRgba = (hex) => (
        hex[0] === '#' && (hex = hex.substr(1)),
        hex.length < 6
            ? {
                  r: parseInt(hex[0] + hex[0], 16),
                  g: parseInt(hex[1] + hex[1], 16),
                  b: parseInt(hex[2] + hex[2], 16),
                  a: 1,
              }
            : {
                  r: parseInt(hex.substr(0, 2), 16),
                  g: parseInt(hex.substr(2, 2), 16),
                  b: parseInt(hex.substr(4, 2), 16),
                  a: 1,
              }
    ),
    parseHue = (value, unit = 'deg') => Number(value) * (angleUnits[unit] || 1),
    hslaStringToHsva = (hslString) => {
        let match =
            /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(
                hslString,
            )
        return match
            ? hslaToHsva({
                  h: parseHue(match[1], match[2]),
                  s: Number(match[3]),
                  l: Number(match[4]),
                  a:
                      match[5] === void 0
                          ? 1
                          : Number(match[5]) / (match[6] ? 100 : 1),
              })
            : { h: 0, s: 0, v: 0, a: 1 }
    },
    hslStringToHsva = hslaStringToHsva,
    hslaToHsva = ({ h, s, l, a }) => (
        (s *= (l < 50 ? l : 100 - l) / 100),
        { h, s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0, v: l + s, a }
    ),
    hsvaToHex = (hsva) => rgbaToHex(hsvaToRgba(hsva)),
    hsvaToHsla = ({ h, s, v, a }) => {
        let hh = ((200 - s) * v) / 100
        return {
            h: round(h),
            s: round(
                hh > 0 && hh < 200
                    ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100
                    : 0,
            ),
            l: round(hh / 2),
            a: round(a, 2),
        }
    }
var hsvaToHslString = (hsva) => {
        let { h, s, l } = hsvaToHsla(hsva)
        return `hsl(${h}, ${s}%, ${l}%)`
    },
    hsvaToHslaString = (hsva) => {
        let { h, s, l, a } = hsvaToHsla(hsva)
        return `hsla(${h}, ${s}%, ${l}%, ${a})`
    },
    hsvaToRgba = ({ h, s, v, a }) => {
        ;(h = (h / 360) * 6), (s = s / 100), (v = v / 100)
        let hh = Math.floor(h),
            b = v * (1 - s),
            c = v * (1 - (h - hh) * s),
            d = v * (1 - (1 - h + hh) * s),
            module = hh % 6
        return {
            r: round([v, c, b, b, d, v][module] * 255),
            g: round([d, v, v, c, b, b][module] * 255),
            b: round([b, b, d, v, v, c][module] * 255),
            a: round(a, 2),
        }
    },
    hsvaToRgbString = (hsva) => {
        let { r, g, b } = hsvaToRgba(hsva)
        return `rgb(${r}, ${g}, ${b})`
    },
    hsvaToRgbaString = (hsva) => {
        let { r, g, b, a } = hsvaToRgba(hsva)
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }
var rgbaStringToHsva = (rgbaString) => {
        let match =
            /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i.exec(
                rgbaString,
            )
        return match
            ? rgbaToHsva({
                  r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
                  g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
                  b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
                  a:
                      match[7] === void 0
                          ? 1
                          : Number(match[7]) / (match[8] ? 100 : 1),
              })
            : { h: 0, s: 0, v: 0, a: 1 }
    },
    rgbStringToHsva = rgbaStringToHsva,
    format = (number) => {
        let hex = number.toString(16)
        return hex.length < 2 ? '0' + hex : hex
    },
    rgbaToHex = ({ r, g, b }) => '#' + format(r) + format(g) + format(b),
    rgbaToHsva = ({ r, g, b, a }) => {
        let max = Math.max(r, g, b),
            delta = max - Math.min(r, g, b),
            hh = delta
                ? max === r
                    ? (g - b) / delta
                    : max === g
                    ? 2 + (b - r) / delta
                    : 4 + (r - g) / delta
                : 0
        return {
            h: round(60 * (hh < 0 ? hh + 6 : hh)),
            s: round(max ? (delta / max) * 100 : 0),
            v: round((max / 255) * 100),
            a,
        }
    }
var equalColorObjects = (first, second) => {
        if (first === second) return !0
        for (let prop in first) if (first[prop] !== second[prop]) return !1
        return !0
    },
    equalColorString = (first, second) =>
        first.replace(/\s/g, '') === second.replace(/\s/g, ''),
    equalHex = (first, second) =>
        first.toLowerCase() === second.toLowerCase()
            ? !0
            : equalColorObjects(hexToRgba(first), hexToRgba(second))
var cache = {},
    tpl = (html) => {
        let template = cache[html]
        return (
            template ||
                ((template = document.createElement('template')),
                (template.innerHTML = html),
                (cache[html] = template)),
            template
        )
    },
    fire = (target, type, detail) => {
        target.dispatchEvent(new CustomEvent(type, { bubbles: !0, detail }))
    }
var hasTouched = !1,
    isTouch = (e) => 'touches' in e,
    isValid = (event) =>
        hasTouched && !isTouch(event)
            ? !1
            : (hasTouched || (hasTouched = isTouch(event)), !0),
    pointerMove = (target, event) => {
        let pointer = isTouch(event) ? event.touches[0] : event,
            rect = target.el.getBoundingClientRect()
        fire(
            target.el,
            'move',
            target.getMove({
                x: clamp(
                    (pointer.pageX - (rect.left + window.pageXOffset)) /
                        rect.width,
                ),
                y: clamp(
                    (pointer.pageY - (rect.top + window.pageYOffset)) /
                        rect.height,
                ),
            }),
        )
    },
    keyMove = (target, event) => {
        let keyCode = event.keyCode
        keyCode > 40 ||
            (target.xy && keyCode < 37) ||
            keyCode < 33 ||
            (event.preventDefault(),
            fire(
                target.el,
                'move',
                target.getMove(
                    {
                        x:
                            keyCode === 39
                                ? 0.01
                                : keyCode === 37
                                ? -0.01
                                : keyCode === 34
                                ? 0.05
                                : keyCode === 33
                                ? -0.05
                                : keyCode === 35
                                ? 1
                                : keyCode === 36
                                ? -1
                                : 0,
                        y: keyCode === 40 ? 0.01 : keyCode === 38 ? -0.01 : 0,
                    },
                    !0,
                ),
            ))
    },
    Slider = class {
        constructor(root, part, aria, xy) {
            let template = tpl(
                `<div role="slider" tabindex="0" part="${part}" ${aria}><div part="${part}-pointer"></div></div>`,
            )
            root.appendChild(template.content.cloneNode(!0))
            let el = root.querySelector(`[part=${part}]`)
            el.addEventListener('mousedown', this),
                el.addEventListener('touchstart', this),
                el.addEventListener('keydown', this),
                (this.el = el),
                (this.xy = xy),
                (this.nodes = [el.firstChild, el])
        }
        set dragging(state) {
            let toggleEvent = state
                ? document.addEventListener
                : document.removeEventListener
            toggleEvent(hasTouched ? 'touchmove' : 'mousemove', this),
                toggleEvent(hasTouched ? 'touchend' : 'mouseup', this)
        }
        handleEvent(event) {
            switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    if (
                        (event.preventDefault(),
                        !isValid(event) || (!hasTouched && event.button != 0))
                    )
                        return
                    this.el.focus(),
                        pointerMove(this, event),
                        (this.dragging = !0)
                    break
                case 'mousemove':
                case 'touchmove':
                    event.preventDefault(), pointerMove(this, event)
                    break
                case 'mouseup':
                case 'touchend':
                    this.dragging = !1
                    break
                case 'keydown':
                    keyMove(this, event)
                    break
            }
        }
        style(styles) {
            styles.forEach((style, i) => {
                for (let p in style)
                    this.nodes[i].style.setProperty(p, style[p])
            })
        }
    }
var Hue = class extends Slider {
    constructor(root) {
        super(
            root,
            'hue',
            'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',
            !1,
        )
    }
    update({ h }) {
        ;(this.h = h),
            this.style([
                {
                    left: `${(h / 360) * 100}%`,
                    color: hsvaToHslString({ h, s: 100, v: 100, a: 1 }),
                },
            ]),
            this.el.setAttribute('aria-valuenow', `${round(h)}`)
    }
    getMove(offset, key) {
        return {
            h: key ? clamp(this.h + offset.x * 360, 0, 360) : 360 * offset.x,
        }
    }
}
var Saturation = class extends Slider {
    constructor(root) {
        super(root, 'saturation', 'aria-label="Color"', !0)
    }
    update(hsva) {
        ;(this.hsva = hsva),
            this.style([
                {
                    top: `${100 - hsva.v}%`,
                    left: `${hsva.s}%`,
                    color: hsvaToHslString(hsva),
                },
                {
                    'background-color': hsvaToHslString({
                        h: hsva.h,
                        s: 100,
                        v: 100,
                        a: 1,
                    }),
                },
            ]),
            this.el.setAttribute(
                'aria-valuetext',
                `Saturation ${round(hsva.s)}%, Brightness ${round(hsva.v)}%`,
            )
    }
    getMove(offset, key) {
        return {
            s: key
                ? clamp(this.hsva.s + offset.x * 100, 0, 100)
                : offset.x * 100,
            v: key
                ? clamp(this.hsva.v - offset.y * 100, 0, 100)
                : Math.round(100 - offset.y * 100),
        }
    }
}
var color_picker_default =
    ":host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{display:block;content:'';position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}"
var hue_default =
    '[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}'
var saturation_default =
    '[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}'
var $isSame = Symbol('same'),
    $color = Symbol('color'),
    $hsva = Symbol('hsva'),
    $change = Symbol('change'),
    $update = Symbol('update'),
    $parts = Symbol('parts'),
    $css = Symbol('css'),
    $sliders = Symbol('sliders'),
    ColorPicker = class extends HTMLElement {
        static get observedAttributes() {
            return ['color']
        }
        get [$css]() {
            return [color_picker_default, hue_default, saturation_default]
        }
        get [$sliders]() {
            return [Saturation, Hue]
        }
        get color() {
            return this[$color]
        }
        set color(newColor) {
            if (!this[$isSame](newColor)) {
                let newHsva = this.colorModel.toHsva(newColor)
                this[$update](newHsva), this[$change](newColor)
            }
        }
        constructor() {
            super()
            let template = tpl(`<style>${this[$css].join('')}</style>`),
                root = this.attachShadow({ mode: 'open' })
            root.appendChild(template.content.cloneNode(!0)),
                root.addEventListener('move', this),
                (this[$parts] = this[$sliders].map(
                    (slider) => new slider(root),
                ))
        }
        connectedCallback() {
            if (this.hasOwnProperty('color')) {
                let value = this.color
                delete this.color, (this.color = value)
            } else this.color || (this.color = this.colorModel.defaultColor)
        }
        attributeChangedCallback(_attr, _oldVal, newVal) {
            let color = this.colorModel.fromAttr(newVal)
            this[$isSame](color) || (this.color = color)
        }
        handleEvent(event) {
            let oldHsva = this[$hsva],
                newHsva = { ...oldHsva, ...event.detail }
            this[$update](newHsva)
            let newColor
            !equalColorObjects(newHsva, oldHsva) &&
                !this[$isSame](
                    (newColor = this.colorModel.fromHsva(newHsva)),
                ) &&
                this[$change](newColor)
        }
        [$isSame](color) {
            return this.color && this.colorModel.equal(color, this.color)
        }
        [$update](hsva) {
            ;(this[$hsva] = hsva),
                this[$parts].forEach((part) => part.update(hsva))
        }
        [$change](value) {
            ;(this[$color] = value), fire(this, 'color-changed', { value })
        }
    }
var colorModel = {
        defaultColor: '#000',
        toHsva: hexToHsva,
        fromHsva: hsvaToHex,
        equal: equalHex,
        fromAttr: (color) => color,
    },
    HexBase = class extends ColorPicker {
        get colorModel() {
            return colorModel
        }
    }
var HexColorPicker = class extends HexBase {}
customElements.define('hex-color-picker', HexColorPicker)
var colorModel2 = {
        defaultColor: 'hsl(0, 0%, 0%)',
        toHsva: hslStringToHsva,
        fromHsva: hsvaToHslString,
        equal: equalColorString,
        fromAttr: (color) => color,
    },
    HslStringBase = class extends ColorPicker {
        get colorModel() {
            return colorModel2
        }
    }
var HslStringColorPicker = class extends HslStringBase {}
customElements.define('hsl-string-color-picker', HslStringColorPicker)
var colorModel3 = {
        defaultColor: 'rgb(0, 0, 0)',
        toHsva: rgbStringToHsva,
        fromHsva: hsvaToRgbString,
        equal: equalColorString,
        fromAttr: (color) => color,
    },
    RgbStringBase = class extends ColorPicker {
        get colorModel() {
            return colorModel3
        }
    }
var RgbStringColorPicker = class extends RgbStringBase {}
customElements.define('rgb-string-color-picker', RgbStringColorPicker)
var Alpha = class extends Slider {
    constructor(root) {
        super(
            root,
            'alpha',
            'aria-label="Alpha" aria-valuemin="0" aria-valuemax="1"',
            !1,
        )
    }
    update(hsva) {
        this.hsva = hsva
        let colorFrom = hsvaToHslaString({ ...hsva, a: 0 }),
            colorTo = hsvaToHslaString({ ...hsva, a: 1 }),
            value = hsva.a * 100
        this.style([
            { left: `${value}%`, color: hsvaToHslaString(hsva) },
            { '--gradient': `linear-gradient(90deg, ${colorFrom}, ${colorTo}` },
        ])
        let v = round(value)
        this.el.setAttribute('aria-valuenow', `${v}`),
            this.el.setAttribute('aria-valuetext', `${v}%`)
    }
    getMove(offset, key) {
        return { a: key ? clamp(this.hsva.a + offset.x) : offset.x }
    }
}
var alpha_default = `[part=alpha]{flex:0 0 24px}[part=alpha]::after{display:block;content:'';position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;background-image:var(--gradient);box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part^=alpha]{background-color:#fff;background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')}[part=alpha-pointer]{top:50%}`
var AlphaColorPicker = class extends ColorPicker {
    get [$css]() {
        return [...super[$css], alpha_default]
    }
    get [$sliders]() {
        return [...super[$sliders], Alpha]
    }
}
var colorModel4 = {
        defaultColor: 'rgba(0, 0, 0, 1)',
        toHsva: rgbaStringToHsva,
        fromHsva: hsvaToRgbaString,
        equal: equalColorString,
        fromAttr: (color) => color,
    },
    RgbaStringBase = class extends AlphaColorPicker {
        get colorModel() {
            return colorModel4
        }
    }
var RgbaStringColorPicker = class extends RgbaStringBase {}
customElements.define('rgba-string-color-picker', RgbaStringColorPicker)
function colorPickerFormComponent({ isAutofocused, isDisabled, state }) {
    return {
        state,
        init: function () {
            this.state === null ||
                this.state === '' ||
                this.setState(this.state),
                isAutofocused && this.togglePanelVisibility(this.$refs.input),
                this.$refs.input.addEventListener('change', (event) => {
                    this.setState(event.target.value)
                }),
                this.$refs.panel.addEventListener('color-changed', (event) => {
                    this.setState(event.detail.value)
                })
        },
        togglePanelVisibility: function () {
            isDisabled || this.$refs.panel.toggle(this.$refs.input)
        },
        setState: function (value) {
            ;(this.state = value),
                (this.$refs.input.value = value),
                (this.$refs.panel.color = value)
        },
        isOpen: function () {
            return this.$refs.panel.style.display === 'block'
        },
    }
}
export { colorPickerFormComponent as default }