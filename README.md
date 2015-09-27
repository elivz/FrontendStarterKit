# Front-End Code Overview

## Project Tree

    dist/public_html # This will be your webroot
      - assets   
        - css     # The compiled CSS files
        - images  # Optimized image files
        - fonts   # Locally-hosted webfont files
        - js      # Concatenated Javascript files
    src
      - fonts     # Any webfont files here will be copied verbatim to the dist folder
      - images    # Unoptimized image files, as exported from Photoshop, etc.
      - js        # All custom scripts for the theme
        - header  # Scripts that should be included in the header of the document
        - ie8     # Scripts that are only needed for IE8 compatibility
        - main    # Everything in here will be compiled into the main script and included at the bottom of the document
          - libs    # JS files that should be included first, as other scripts depend on them
          - plugins # Custom-written plugins to perform specific tasks
      - sass      # SCSS source files
                  # Autoprefixer will add browser support as appropriate
      - sprites   # SVG image files that will be collected into a single sprite file
      - templates # HTML/PHP/Twig templates
      - vendor    # Third-party components, installed via Bower


## Installing Front-End Dependancies

We use [Bower](http://bower.io) to manage front-end components like JS libraries & plugins. Run `bower install --save-dev [package-name]` to install a new component.


## Front-End Build Process

### Initial Setup

The front-end build process required Node v0.10.0 or higher. Once Node is installed, run the following commands to install all project dependancies:

    npm install
    bower install

### Building Front-End Assets

Use Gulp to compile SASS source files to CSS, minify JS and CSS, and optimize images. This command will also build a custom jQuery script, with only the modules you specify.

    gulp

While actively developing, watch source files and rebuild as needed. This command will open a new browser tab using BrowserSync, which will automatically update to reflect changes you make to the source files. Additionally, it will provide you with an "external url" that you can use to view the site from other computers or devices on the same network, again with instant updates as you make changes.

    gulp watch

To generate minified copies of all the assets without sourcemaps, run the following command:

    gulp --production


## Specific Notes

Most project-specific configuration can be accomplished via the `gulpfile.babel.js/config.js` file.

### CSS

We run Autoprefixer on the compiled CSS files to add additional browser support wherever possible.

### Scripts

Javascript files will be compiled from the `src/js` folder. Any ES6 features will be transcoded to their ES5 equivalent. Files saved in the `libs` sub-folder will be placed first in the final file - these should be reusable plugins and libraries.

Files in the `src/js/header` folder will be loaded in the head of the document.

### SVGs

SVG files saved to `assets/src/images` will be compressed and output to `assets/dist/images`, along with a PNG fallback.

### Sprites

SVG files saved in `src/sprites` will be compiled into a single SVG sprite sheet, and a fallback PNG sprite will be generated as well. CSS classes are automatically generated in `src/sass/generated/_sprites.scss`. You can apply an SVG sprite to an element like: `<span class="svg filename"></span>`.
