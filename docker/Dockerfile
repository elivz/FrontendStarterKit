FROM elivz/php-dev

ARG PUBLIC
ENV WEBROOT /var/www$PUBLIC

# Set webroot directory in virtual host
RUN sed -ri \
        -e 's#DocumentRoot\s/.+$#DocumentRoot '$WEBROOT'#' \
        /etc/apache2/sites-enabled/000-default.conf

# Set webroot
WORKDIR $WEBROOT

# Route mail through MailCatcher
RUN echo "mailhub=mail:1025\nUseTLS=NO\nFromLineOverride=YES" > /etc/ssmtp/ssmtp.conf
