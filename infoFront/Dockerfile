# Используем официальный образ Node.js
FROM node:lts-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Собираем приложение
RUN npm run build

# Используем легковесный сервер для обслуживания статических файлов
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Указываем порт, который будет прослушиваться
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
