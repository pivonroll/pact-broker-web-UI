# syntax=docker/dockerfile:1
from node:14 as builder
WORKDIR /src
COPY . .
RUN yarn
RUN yarn build

from nginx
WORKDIR /app
RUN mkdir dist
COPY --from=builder /src/dist/* ./dist/
COPY --from=builder /src/config/docker/nginx.conf /etc/nginx/nginx.conf
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
