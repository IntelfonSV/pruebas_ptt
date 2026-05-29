# Gestor de Pruebas PTT - Docker

## Requisitos
- Docker
- Docker Compose

## Uso

### 1. Construir e iniciar todos los servicios
```bash
docker-compose up -d --build
```

### 2. Ver logs
```bash
docker-compose logs -f app
```

### 3. Acceder a la aplicación
- App: http://localhost:8000
- Vite (dev): http://localhost:5173

### 4. Detener servicios
```bash
docker-compose down
```

### 5. Reiniciar desde cero
```bash
docker-compose down -v --remove-orphans
docker-compose up -d --build
```

## Servicios
- **app**: Laravel + PHP-FPM + Nginx
- **mysql**: Base de datos MySQL 8.0
- **redis**: Cache y colas Redis
- **npm**: Vite dev server (opcional, para desarrollo)

## Desarrollo
Para usar Vite en modo desarrollo:
```bash
docker-compose up -d npm
```

Para ejecutar comandos artisan:
```bash
docker-compose exec app php artisan <command>
```