#!/bin/sh
# CAREFUL: they rate limit to 5 certs per week
# can ONLY be run on dev.opencourse.app
certbot certonly -n --agree-tos -m jmoyers@gmail.com -d jmoyers.org --standalone
