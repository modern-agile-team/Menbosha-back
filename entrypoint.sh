#!/bin/bash

# Start Nginx
nginx

# certbot으로 ssl 인증서 발급 -(초기)
certbot --nginx -n -d $CERTBOT_DOMAINS --agree-tos --email $CERTBOT_EMAIL --redirect

# Keep container running
tail -f /dev/null
