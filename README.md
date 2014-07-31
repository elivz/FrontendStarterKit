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
          - plugins   # Custom-written jQuery plugins to perform specific tasks
        - css       # SASS source files
        - sprites   # Small PNG image files that will be collected into a single sprite file
        - svg       # SVG source files

## Front-End Build Process

### Initial Setup

The front-end build process required Node v0.10.0 or higher. Once Node is installed, run the following commands to install all project dependancies:

    npm install

### Building Front-End Assets

Use Gulp to compile SASS source files to CSS, minify JS and CSS, and optimize images. This command will also build a custom Modernizr script that includes all necessary tests (based on the existing CSS and JS).

    gulp

While actively developing, watch source files and rebuild as needed:

    gulp watch