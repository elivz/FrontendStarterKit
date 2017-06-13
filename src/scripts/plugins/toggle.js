/**
 * Accessibly toggle hidden content
 *
 * Author: Eli Van Zoeren (eli@elivz.com)
 * License: MIT License
 * Copyright 2017 Eli Van Zoeren
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export default class Toggle {
    /**
     * Defaults for the user-configurable options
     * @type {Object}
     */
    defaultOptions = {
        assignFocus: true,
        mediaQuery: false,
    };

    /**
     * Constructor – stores references to all the DOM elements
     *               and runs the "setup" function
     * @param  {Element}    element     The toggleable content element
     * @param  {Object}     options     Configurable options
     * @return {null}
     */
    constructor(element, options = {}) {
        if (!element || !element instanceof HTMLElement) {
            console.warn('Toggle: first parameter must by an HTML element.');
            return;
        }

        this.content = element;
        this.id = element.id;
        this.buttons = Array.from(
            document.querySelectorAll(`[data-toggle='${this.id}']`)
        );
        this.firstFocusable = element.querySelector(
            'a[href], input:not([disabled]), button:not([disabled]), [tabindex]'
        );
        this.options = Object.assign(this.defaultOptions, options);

        if (this.buttons.length < 1) {
            console.warn(
                'Toggle: there are no buttons that control the toggleable element.'
            );
            return;
        }

        // Start things off
        if (this.options.mediaQuery === false) {
            // No media query – go ahead and run everything as normal
            this.setup();
        } else {
            // Check if it should be setup now, and again every time the window is resized
            this.onResize(this.testMediaQuery.bind(this));
            this.testMediaQuery();
        }
    }

    /**
     * Adds ARIA roles to all the elements and attaches event handler
     * @return {null}
     */
    setup() {
        if (!this.active) {
            this.toggleHandler = this.toggle.bind(this);

            // Button properties
            this.buttons.forEach((button, index) => {
                button.setAttribute('aria-label', 'Menu');
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-controls', this.id);
                button.setAttribute('id', `${this.id}-control-${index}`);
                button.addEventListener('click', this.toggleHandler);
            });

            // Toggleable content properties
            this.content.setAttribute('aria-hidden', 'true');
            this.content.setAttribute(
                'aria-labelledby',
                `${this.id}-control-0`
            );
        }

        this.active = true;
    }

    /**
     * Removes all ARIA roles
     * @return {null}
     */
    teardown() {
        if (this.active) {
            // Button properties
            this.buttons.forEach((button, index) => {
                button.removeAttribute('aria-label');
                button.removeAttribute('aria-expanded');
                button.removeAttribute('aria-controls');
                button.removeAttribute('id');
                button.removeEventListener('click', this.toggleHandler);
            });

            // Toggleable content properties
            this.content.removeAttribute('aria-hidden');
            this.content.removeAttribute('aria-labelledby');

            this.active = false;
        }
    }

    testMediaQuery() {
        if (window.matchMedia(this.options.mediaQuery).matches) {
            this.setup();
        } else {
            this.teardown();
        }
    }

    /**
     * Toggles visibility and ARIA roles
     * @return {null}
     */
    toggle(event) {
        event.preventDefault();

        if (this.content.getAttribute('aria-hidden') === 'true') {
            // Show
            this.content.setAttribute('aria-hidden', 'false');

            this.buttons.forEach(button => {
                button.setAttribute('aria-expanded', 'true');
            });

            // Set focus on first link
            if (this.options.assignFocus && this.firstFocusable) {
                this.firstFocusable.focus();
            }
        } else {
            // Hide
            this.content.setAttribute('aria-hidden', 'true');

            this.buttons.forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });
        }
    }

    /**
     * Debounced resize handler
     * https://github.com/louisremi/jquery-smartresize
     * @param  {Function}   callback    Function to run after window is resized
     * @return {null}
     */
    onResize(callback) {
        let timer;
        onresize = function() {
            clearTimeout(timer);
            timer = setTimeout(callback, 100);
        };
    }
}
