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
        - inline  # Store images that will eventually be inlined into the HTML here
      - js        # All custom scripts for the theme
        - modules # Individual components providing site-specific functionality
        - plugins # Self-contained generic plugins (not site-specific)
        - main.js # Entry-point for the site's JS -
                  # you should import everything else from here
      - sass      # SCSS source files
                  # Autoprefixer will add browser support as appropriate
      - sprites   # SVG image files that will be collected into a single sprite file
      - templates # HTML/PHP/Twig templates


## Installing Front-End Dependancies

We use [Yarn](https://yarnpkg.com/) to manage all front-end JavaScript dependencies. Run `yarn add [package-name]` to install a new component.


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

### Configuration

You can configure the asset source and destination paths in `config/path-config.json`. Generally they can just be left alone. You can also change lots of settings regarding which build steps are run and their options in `config/task-config.js`. Our build process is based on [Blendid](https://github.com/vigetlabs/blendid#configuration), so you can refer to the configuration reference there.

### Building Front-End Assets

While actively developing, watch source files and rebuild as needed. This command will open a new browser tab using BrowserSync, which will automatically update to reflect changes you make to the source files. Additionally, it will provide you with an "external url" that you can use to view the site from other computers or devices on the same network, again with instant updates as you make changes.

    yarn dev

To generate minified copies of all the assets without sourcemaps, run the following command:

    yarn build


## Specific Notes

Most project-specific build configuration can be accomplished in the `package.json` file.

### CSS

We run Autoprefixer on the compiled CSS files to add additional browser support wherever possible.

### Scripts

Javascript files will be compiled from the `src/js` folder. Any ES2015 features will be transcoded to their ES5 equivalent. Use ES2015-style module imports.

### SVGs

SVG files saved to `assets/src/images` will be compressed and output to `assets/dist/images`.
