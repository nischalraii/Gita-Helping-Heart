# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1. PHP dependencies. Produces a pruned /app containing vendor/.
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
        --no-dev --no-interaction --no-progress --prefer-dist \
        --no-scripts --no-autoloader

COPY . .
RUN composer install \
        --no-dev --no-interaction --no-progress --prefer-dist \
        --optimize-autoloader

# ---------------------------------------------------------------------------
# 2. Front-end assets.
#
# This stage needs PHP as well as Node: the Wayfinder Vite plugin runs
# `php artisan wayfinder:generate` during the build and aborts it if `php`
# is missing. Debian trixie ships PHP 8.4, which satisfies the app's ^8.3.
# ---------------------------------------------------------------------------
FROM node:22-trixie-slim AS assets

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        php8.4-cli php8.4-mbstring php8.4-xml php8.4-curl php8.4-sqlite3 \
 && ln -sf /usr/bin/php8.4 /usr/local/bin/php \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Pull in the source + vendor from the previous stage (keeps npm ci cached).
COPY --from=vendor /app /app
RUN npm run build

# ---------------------------------------------------------------------------
# 3. Runtime. FrankenPHP serves HTTP and PHP from a single process, so there
#    is no nginx/PHP-FPM/supervisor to babysit.
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:1-php8.5-trixie AS runtime

# pdo_sqlite ships with the base image; add the ones we may need on a host.
RUN install-php-extensions pdo_pgsql pdo_mysql opcache

WORKDIR /app

COPY --from=vendor /app /app
COPY --from=assets /app/public/build ./public/build

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
 && ln -sfn ../storage/app/public public/storage \
 && chown -R www-data:www-data storage bootstrap/cache /config /data

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    SERVER_NAME=:8080 \
    SERVER_ROOT=/app/public

EXPOSE 8080

# The base image's entrypoint only rewrites args starting with `-` (prepending
# `frankenphp run`), so this `sh -c` command is exec'd verbatim.
# :8080 is unprivileged, so no CAP_NET_BIND_SERVICE is needed.
USER www-data

# ponytail: migrate-on-boot suits a single free instance. On a host running
# several replicas, move `migrate --force` to a one-shot release step so they
# don't race. SERVER_NAME honours $PORT so this works on Cloud Run et al.
CMD ["sh", "-c", "php artisan migrate --force && php artisan optimize && exec env SERVER_NAME=:${PORT:-8080} frankenphp run --config /etc/frankenphp/Caddyfile --adapter caddyfile"]
