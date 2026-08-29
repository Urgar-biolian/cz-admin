module.exports = {
  apps: [
    {
      name: 'admin-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '/www/wwwroot/cz-admin-ge-main/dist',
        PM2_SERVE_PORT: 36667,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    },
    {
      name: 'admin-backend',
      script: '/www/wwwroot/cz-admin-ge-main/cz-admin-backend/target/cz-admin-backend-1.0.0.jar',
      args: '--spring.profiles.active=prod --server.port=8080',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        SPRING_PROFILES_ACTIVE: 'prod'
      }
    }
  ]
};