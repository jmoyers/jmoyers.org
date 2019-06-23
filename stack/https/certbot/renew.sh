certbot renew -n --pre-hook "nginx -s stop" --post-hook "nginx -g 'daemon off'"
