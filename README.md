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
        - jspm_modules # 3rd-party vendor script libraries
        - modules # Individual components providing site-specific functionality
        - plugins # Self-contained generic plugins (not site-specific)
        - main.js # Entry-point for the site's JS -
                  # you should import everything else from here
      - sass      # SCSS source files
                  # Autoprefixer will add browser support as appropriate
      - sprites   # SVG image files that will be collected into a single sprite file
      - templates # HTML/PHP/Twig templates


## Installing Front-End Dependancies

We use [JSPM](http://jspm.io) to manage all front-end JavaScript dependencies. Run `jspm install [package-name]` to install a new component. Please [read the docs](https://github.com/jspm/jspm-cli/blob/master/docs/installing-packages.md) for details on getting a particular version or installing from various sources.


## Starting a Docker server

The local server uses [Docker Compose](http://docs.docker.com/compose/). Once you have that set up, run the following commands to control the server:

    docker-compose up -d  # Start the server
    docker-compose kill   # Stop the server

If you are using Docker for Mac, the website will now be accessible at [localhost:8080](http://localhost:8080).

You can connect to the database using an app such as [Sequel Pro](http://sequelpro.com). Use the following settings:

    Host:     127.0.0.1
    Username: app
    Password: 123
    Database: app

## Front-End Build Process

### Initial Setup

The front-end build process requires Node v4.6.0 or higher. Once Node is installed, run the following command from the project root to install all the build-process dependancies:

    yarn

### Building Front-End Assets

Use Gulp to compile SASS source files to CSS, minify JS and CSS, and optimize images. This command will also build a custom jQuery script, with only the modules you specify.

    gulp

While actively developing, watch source files and rebuild as needed. This command will open a new browser tab using BrowserSync, which will automatically update to reflect changes you make to the source files. Additionally, it will provide you with an "external url" that you can use to view the site from other computers or devices on the same network, again with instant updates as you make changes.

    gulp watch

To generate minified copies of all the assets without sourcemaps, run the following command:

    gulp --production


## Specific Notes

Most project-specific build configuration can be accomplished in the `package.json` file.

### CSS

We run Autoprefixer on the compiled CSS files to add additional browser support wherever possible.

### Scripts

Javascript files will be compiled from the `src/js` folder. Any ES6 features will be transcoded to their ES5 equivalent. Use ES2015-style module imports.

### SVGs

SVG files saved to `assets/src/images` will be compressed and output to `assets/dist/images`.

### Sprites

SVG files saved in `src/sprites` will be compiled into a single SVG sprite sheet. You can use a sprite image in your HTML like so: `<svg class="sprite" width="18" height="18"><use xlink:href="/assets/images/sprites.svg#s-[filename]"/></svg>` (where `[filename]` is replaced by the original name of the sprite you want to include).
