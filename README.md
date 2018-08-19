# Front-End Starter Kit

This is [my](https://github.com/elivz) starting point for most projects. It was created primarily for my own personal use and may or may not be useful to anyone else, but you are welcome to use it, fork it, or ignore it.

## Usage

### Getting Set Up

First you need to install [Docker for Mac](https://www.docker.com/docker-mac) or [for Windows](https://www.docker.com/docker-windows). The default settings should be fine, but feel free to poke around and tweak things.

The development server and all build commands are run inside Docker, so you don't have to have Node, PHP, or MySQL running on your development computer (and, conversely, it won't hurt anything if you have the wrong version of any of them).

To start, run the following command in the project folder to finish setting things up:

    ./run init

### Installing & Managing Dependencies

We use [Yarn](https://yarnpkg.com/en/docs) for front-end dependency management, which you can access like this:

    ./run yarn add flickity
    ./run yarn remove flickity

If you make manual changes to `package.json` (or, optionally, `composer.json`), you will need to run `./run update`.

### Start Developing!

To start the local server and begin watching for file changes, run:

    ./run start
    ./run watch

The web address to see your website will be displayed in the terminal. Since it uses [Browsersync](https://www.browsersync.io) & [xip.io](http://xip.io), you will be able to open that link on any device connected to your local network, making mobile testing easy.

You can connect to the database using an app such as [Sequel Pro](http://sequelpro.com). Use the following settings:

    Host:     127.0.0.1
    Username: app
    Password: 123
    Database: app

When you are finished working for the day, shut down the server with:

    ./run stop

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
      - scripts   # All custom scripts for the theme
        - components  # Individual components providing site-specific functionality
        - plugins     # Self-contained generic plugins (not site-specific)
      - static    # Favicons, htaccess file, and anything else that should go in the site root
      - styles    # SCSS source files
      - templates # HTML/PHP/Twig templates

## Front-End Build Process

## Specific Notes

Most project-specific build configuration can be accomplished in the `package.json` file.

### CSS

We run Autoprefixer on the compiled CSS files to add additional browser support wherever possible.

### Scripts

Any ES2015 features will be transcoded to their ES5 equivalent. Use ES2015-style module imports.
