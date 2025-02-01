## Felifoodie App

Aplicación web para descubrir restaurantes, construida con Next.js 14.
Conectada a un backend en NestJS para búsquedas avanzadas y autenticación segura.

## Demo

Puedes acceder a la aplicación en vivo en el siguiente enlace:  
[Frontend - Felifoodie App](https://feli-foodie-frontend.vercel.app/)

> **Nota:** Para iniciar el backend, ya que está alojado en Render y puede estar en modo de suspensión, visita esta URL para activar el servidor:  
> [Backend - Felifoodie API]([https://todo-backend-nest-jjq1.onrender.com/](https://felifoodiebackend-1.onrender.com/docs))

## Características

🔍 Búsqueda inteligente: Filtra restaurantes por ciudad o nombre.
🌟 Recomendaciones destacadas: Top 4 de restaurantes mejor valorados.
📅 Historial personalizado: Accede a tus búsquedas recientes.
📱 Diseño responsive: Optimizado para móviles y desktop.

## Tecnologías Utilizadas

- **Frontend:** Next.js 14 (con Server Actions), React
- **Backend:** NestJS
- **Hosting:** Vercel (Frontend) y Render (Backend)

## Requisitos Especiales

Debido a que el proyecto utiliza **Server Actions** en Next.js 14, es importante habilitarlas en tu configuración. Asegúrate de tener las Server Actions activadas en tu entorno de desarrollo y producción para un funcionamiento correcto. Deben colocar `'use server'` al inicio de las acciones que requieran ejecutar en el servidor.

## Imágenes de Referencia

### Vista principal de la aplicación
![WhatsApp Image 2025-01-31 at 7 09 28 PM](https://github.com/user-attachments/assets/950fc47e-9d09-4585-83f1-3bd09753a484)

### Vista principal buscando una ciudad con el AutoCompleteSearch
![Captura de pantalla 2025-01-31 193836](https://github.com/user-attachments/assets/b9caada7-b072-4aa2-bf4a-45ce6224073b)

### Buscador de los restaurantes
![WhatsApp Image 2025-01-31 at 7 09 29 PM](https://github.com/user-attachments/assets/b37103ef-7859-4616-8a4e-feee69f4ab3a)

### Detalle de los restaurantes
![WhatsApp Image 2025-01-31 at 7 09 29 PM (2)](https://github.com/user-attachments/assets/e09d8aa7-43f0-4d3b-88a3-d9a2fd143899)

### Opiniones de los usuarios
![image](https://github.com/user-attachments/assets/cf918d64-8fd2-4b4f-8450-93783cf1951a)

### Galería de fotos
![image](https://github.com/user-attachments/assets/2acc7bce-a711-4b51-9bd9-ce9fbec40134)

### Diseño Móvil
![image](https://github.com/user-attachments/assets/587246a2-401d-4433-913b-366874796c53)


## Instalación Local

Si deseas ejecutar esta aplicación localmente, sigue los pasos a continuación.

### Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/todo-app.git
   cd todo-app
   ```
2. **Instala las dependencias:**
   ```bash
     cd frontend
    npm install
   ```
3. **Inicia el repositorio:**
  ```bash
  npm run dev

  ```
### Uso aplicativo
0. Inicia el Backend que se encuentra en mi repositorio o usa el remoto.
1. Asegúrate de configurar la variable de entorno `API_URL` en el archivo `.env.local` dentro de la carpeta `frontend`:
   ```plaintext
   API_URL=https://felifoodiebackend-1.onrender.com
   NEXT_PUBLIC_API_URL = <TU URL DE BACKEND>
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<TU_API_GOOGLE_MAPS_JAVASCRIPT_SDK>
   ```
2. Accede a http://localhost:3000 en tu navegador.
3. Crea, marca como completadas o elimina tareas según lo necesites.
