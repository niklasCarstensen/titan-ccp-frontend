FROM nginx:latest

COPY index.html /var/www/titan-ccp/index.html
COPY dist /var/www/titan-ccp/dist
COPY nginx.conf /etc/nginx/nginx.conf