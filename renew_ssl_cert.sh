#!/bin/bash

# Certbot을 사용하여 SSL 인증서 갱신
certbot renew --quiet --nginx
