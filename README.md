# Front-End Code Overview

## Project Tree

    assets
      - dist
        - css       # The compiled CSS files, both expanded and minified
        - images    # Optimized image files
        - fonts     # Locally-hosted webfont files
        - js        # Concatenated Javascript files, both expanded and minified
      - src
        - components # Third-party components, installed via Bower
        - images    # Unoptimized image files, as exported from Photoshop, etc.
        - js        # All custom scripts for the theme - files with a .coffee extension will be automatically compiled from CoffeeScript
          - compatibility   # JS files that need to run in the head, before the DOM is parsed
          - plugins         # Custom-written jQuery plugins to perform specific tasks
        - css       # SCSS source files
        - sprites   # PNG and SVG image files that will be collected into two sprite files
        - svg       # SVG source files

## Installing Front-End Dependancies

We use [Bower](http://bower.io) to manage front-end components like JS libraries & plugins. Add the dependancy to the `bower.json` file and then run `bower install` from the command line. 


## Front-End Build Process

### Initial Setup

The front-end build process required Node v0.10.0 or higher. Once Node is installed, run the following commands to install all project dependancies:

    npm install

### Building Front-End Assets

Use Gulp to compile SASS source files to CSS, minify JS and CSS, and optimize images. This command will also build a custom Modernizr script that includes all necessary tests (based on the existing CSS and JS).

    gulp

While actively developing, watch source files and rebuild as needed:

    gulp watch

To regenerate a custom Modernizr build with support for all the tests you are using, run:

    gulp modernizr; gulp scripts


## Specific Notes

### Scripts

Both plain Javascript and CoffeeScript files will be compiled from the `assets/src/js` folder. Files saved in the `plugins` sub-folder will be placed first in the final file - these should be reusable plugins and libraries.

### Image Sprites

All PNGs in the `assets/src/sprites` folder will be combined into a single sprite sheet, and a set of mix-ins will be generated in `assets/src/css/utilities/sprites.scss`. Those mix-ins can be used in your CSS to access a paticular image, like: `@include sprite($sprite-filename);`.

### SVGs

SVG files saved to `assets/src/images` will be compressed and output to `assets/dist/images`, along with a PNG fallback.

SVG files saved in `assets/src/sprites` will be compiled into a single SVG sprite sheet, and a fallback PNG sprite will be generated as well. CSS classes are automatically generated in `assets/src/css/utilities/_svg_sprites.scss`. You can apply an SVG sprite to an element like: `<span class="svg filename"></span>`.