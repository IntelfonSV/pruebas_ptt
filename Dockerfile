FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libgmp-dev \
    libtidy-dev \
    ca-certificates \
    gnupg \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        pdo_mysql \
        zip \
        intl \
        bcmath \
        soap \
        gd \
        gmp \
        tidy \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

CMD bash -lc '\
    echo "== PHP version ==" && php -v && \
    echo "== Composer install ==" && composer install && \
    if [ -f package.json ]; then \
        echo "== NPM install ==" && npm install && \
        echo "== NPM build ==" && npm run build; \
    else \
        echo "== No package.json found, skipping npm =="; \
    fi && \
    if [ ! -f .env ] && [ -f .env.example ]; then \
        echo "== Creating .env from .env.example ==" && cp .env.example .env; \
    else \
        echo "== .env already exists or .env.example missing =="; \
    fi && \
    if [ -f artisan ]; then \
        echo "== Laravel setup ==" && \
        if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then \
            php artisan key:generate; \
        else \
            echo "== APP_KEY already exists =="; \
        fi && \
        php artisan config:clear && \
        php artisan cache:clear && \
        php artisan route:clear || true && \
        php artisan view:clear || true && \
        echo "== Running migrations ==" && \
        php artisan migrate --force && \
        echo "== Starting Laravel server ==" && \
        php artisan serve --host=0.0.0.0 --port=8000; \
    else \
        echo "ERROR: artisan file not found"; \
        exit 1; \
    fi \
'