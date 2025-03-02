FROM nginx

# Remove the default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom nginx.conf into the container
COPY nginx.conf /etc/nginx/nginx.conf
