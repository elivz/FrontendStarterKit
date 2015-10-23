FROM php:5-fpm

# Custom configuration
COPY php-custom.ini /usr/local/etc/php/conf.d/

# Install packages
RUN apt-get update && apt-get install -y \
      libfreetype6-dev \
      libjpeg62-turbo-dev \
      libmcrypt-dev \
      libpng12-dev \
    && docker-php-ext-install iconv mbstring mcrypt mysqli pdo_mysql \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd

# Install Xdebug
RUN pecl install xdebug \
    && echo "zend_extension=xdebug.so" >> "/usr/local/etc/php/conf.d/xdebug.ini"

# Set webroot
WORKDIR /var/www/public_html

CMD ["php-fpm"]
