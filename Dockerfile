FROM nginx:alpine

COPY index.html /var/www/titan-ccp/index.html
COPY dist /var/www/titan-ccp/dist
COPY nginx.conf /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]