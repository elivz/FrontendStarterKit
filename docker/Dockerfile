FROM php:7.0-apache

ARG PUBLIC
ENV WEBROOT /var/www$PUBLIC

COPY php-custom.ini /usr/local/etc/php/conf.d/

# Install PHP extensions
RUN apt-get update && \
    apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
        ssmtp \
    && docker-php-ext-install -j$(nproc) iconv mcrypt \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && apt-get install -y libmagickwand-dev --no-install-recommends \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "mailhub=mail:1025\nUseTLS=NO\nFromLineOverride=YES" > /etc/ssmtp/ssmtp.conf

# Set webroot directory in virtual host
RUN sed -ri \
        -e 's#DocumentRoot\s/.+$#DocumentRoot '$WEBROOT'#' \
        /etc/apache2/sites-enabled/000-default.conf

# Set webroot
WORKDIR $WEBROOT

CMD ["apache2-foreground"]
