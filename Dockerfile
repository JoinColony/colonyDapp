FROM nginx
COPY ./dist/* /usr/share/nginx/html/
COPY defaultNginx.conf /etc/nginx/conf.d/default.conf
