/**
 *    Helper
 *
 *    @tableofcontent
 *      1. Dependencies
 *      2. Configuration
 *      3. Class
 *
 */

/**
 *     @section 1. Dependencies
 */

// import js dependencies

/**
 *     @section 2. Configuration
 */

// nothing yet

/**
 *     @section 3. Class
 */

export default class UserHelpers {
    static getNextElement (elem, className) {
        let sibling = elem.nextElementSibling

        // If there's no selector, return the first sibling
        if (!className) return sibling

        // If the sibling matches our selector, use it
        // If not, jump to the next sibling and continue the loop
        while (sibling) {
            if (sibling.matches(className)) return sibling
            sibling = sibling.nextElementSibling
        }
    }

    static getPreviousElement (elem, className) {
        let prev = elem.previousElementSibling
        while (prev && !prev.classList.contains(className)) {
            prev = prev.previousElementSibling
        }
        return prev
    }

    static toggle (elements, specifiedDisplay) {
        let element, index

        elements = elements.length ? elements : [elements]
        for (index = 0; index < elements.length; index++) {
            element = elements[index]

            if (isElementHidden(element)) {
                element.style.display = ''

                // If the element is still hidden after removing the inline display
                if (isElementHidden(element)) {
                    element.style.display = specifiedDisplay || 'block'
                }
            } else {
                element.style.display = 'none'
            }
        }
        function isElementHidden (element) {
            return window.getComputedStyle(element, null).getPropertyValue('display') === 'none'
        }
    }

    /**
     * Parses the (keyboard) event and returns a String that represents its key
     * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
     * @param {Event} event - the event generated by the event handler
     * @return String key - String that represents the key pressed
     */
    static parseKey (event) {
        const app = this
        const keyCodes = {
            9: 'TAB',
            13: 'ENTER',
            27: 'ESCAPE',
            32: 'SPACE',
            37: 'ARROW_LEFT',
            38: 'ARROW_UP',
            39: 'ARROW_RIGHT',
            40: 'ARROW_DOWN'
        }

        let key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase()

        // Remove un-printable characters, e.g. for `fromCharCode` calls for CTRL only events
        key = key.replace(/\W+/, '')

        if (event.shiftKey) { key = 'SHIFT_' + key }
        if (event.ctrlKey) { key = 'CTRL_' + key }
        if (event.altKey) { key = 'ALT_' + key }

        // Remove trailing underscore, in case only modifiers were used (e.g. only `CTRL_ALT`)
        key = key.replace(/_$/, '')

        return key
    }

    /**
     * Check if element visible
     * @param element - DOM object to search within
     * @return boolean
     */
    static isVisible (element) {
        // offsetParent would be null if display 'none' is set.
        // However Chrome, IE and MS Edge returns offsetParent as null for elements
        // with CSS position 'fixed'. So check whether the dimensions are zero.
        // This check would be inaccurate if position is 'fixed' AND dimensions were
        // intentionally set to zero. But..it is good enough for most cases.
        if ((!element.offsetParent && element.offsetWidth === 0 && element.offsetHeight === 0) || element.classList.contains('tippy-box')) {
            return false
        }

        return true
    }

    /**
     * Finds all focusable elements within the given `$element`
     * @param element - DOM object to search within
     * @return focusableElementsArray array
     */
    static findFocusableElements (element) {
        const app = this

        if (!element) {
            return false
        }

        const focusableElements = element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]')
        const focusableElementsArray = Array.from(focusableElements)

        // find not visible elements
        focusableElementsArray.forEach((element, index) => {
            if (!app.isVisible(element)) {
                focusableElementsArray.splice(index, 1)
            }
        })

        return focusableElementsArray
    }

    /**
     * Traps the focus in the given element.
     * @param element DOM object to trap the focus into.
     * @param focus boolean
     */
    static focusTrap (element, focus) {
        const app = this

        const trapCircle = (event) => {
            const focusableEl = app.findFocusableElements(element)
            const firstFocusableEl = focusableEl[0]
            const lastFocusableEl = focusableEl[focusableEl.length - 1]

            if (event.target === lastFocusableEl && app.parseKey(event) === 'TAB') {
                event.preventDefault()
                firstFocusableEl.focus()
            } else if (event.target === firstFocusableEl && app.parseKey(event) === 'SHIFT_TAB') {
                event.preventDefault()
                lastFocusableEl.focus()
            }
        }

        if (focus) {
            element.addEventListener('keydown', trapCircle, true)
        } else {
            element.removeEventListener('keydown', trapCircle, true)
        }
    }
}

// end of helper.js