FROM php:7-fpm

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

# Install ImageMagick
RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends \
    && pecl install imagick-beta \
    && echo "extension=imagick.so" > /usr/local/etc/php/conf.d/ext-imagick.ini

# Install Xdebug
RUN pecl install xdebug-beta \
    && echo "zend_extension=xdebug.so" >> "/usr/local/etc/php/conf.d/xdebug.ini"

# Install sSMTP to send email to MailCatcher container
RUN apt-get install -y ssmtp \
    && echo "mailhub=mail:1025\nUseTLS=NO\nFromLineOverride=YES" > /etc/ssmtp/ssmtp.conf

# Set webroot
WORKDIR /var/www/public_html

# Let PHP write to the filesystem
RUN usermod -u 1000 www-data

CMD ["php-fpm"]
