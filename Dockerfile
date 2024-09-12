FROM node:18.20.3

WORKDIR /app
COPY . .

ARG TEST

ENV author=${TEST}

RUN wget https://github.com/prometheus/prometheus/releases/download/v2.41.0/prometheus-2.41.0.linux-amd64.tar.gz \
    && tar -xvf prometheus-2.41.0.linux-amd64.tar.gz \
    && mv prometheus-2.41.0.linux-amd64/prometheus /usr/local/bin/ \
    && mv prometheus-2.41.0.linux-amd64/promtool /usr/local/bin/ \
    && mkdir -p /etc/prometheus /var/lib/prometheus \
    && mv prometheus-2.41.0.linux-amd64/prometheus.yml /etc/prometheus/ \
    && mv prometheus-2.41.0.linux-amd64/consoles /etc/prometheus/ \
    && mv prometheus-2.41.0.linux-amd64/console_libraries /etc/prometheus/ \
    && rm -rf prometheus-2.41.0.linux-amd64* 
RUN npm i pm2 -g && npm install -g bun
RUN npm i

RUN chown -R nobody:nogroup /var/lib/prometheus \
    && chmod -R 775 /var/lib/prometheus

EXPOSE 1234
EXPOSE 4001
EXPOSE 9090
EXPOSE 3000

CMD ["sh", "-c", "pm2 start index.ts && pm2 --no-daemon start prometheus -- --config.file='prometheus.yml'"]