FROM elivz/php-dev:1.1

ARG PUBLIC
ENV WEBROOT /var/www$PUBLIC

# Set webroot directory in virtual host
RUN sed -ri -e \
        's!/var/www/html!${WEBROOT}!g' \
        /etc/apache2/sites-available/*.conf
RUN sed -ri -e \
        's!/var/www/html!${WEBROOT}!g' \
        /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set webroot
WORKDIR $WEBROOT

# Route mail through MailCatcher
RUN echo "mailhub=mail:1025\nUseTLS=NO\nFromLineOverride=YES" > /etc/ssmtp/ssmtp.conf
