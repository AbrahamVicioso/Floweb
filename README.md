# Floria

Tienda floral de demostración construida con React, Vite y Lucide. Inspirada en https://floria-landing-page.vercel.app/ y desarrollada usando impeccable.

## Desarrollo

`npm install` y `npm run dev`. Abrir la URL que imprime Vite.

`npm run build` genera `dist/`. `npm run preview` permite revisar esa compilación.

## Incluye

Catálogo por categoría, orden por precio, búsqueda, detalles de producto, favoritos, carrito con cantidades y persistencia local, formulario de compra de muestra, parallax y soporte de movimiento reducido. Diseño adaptable con navegación móvil y diálogos con control de foco y Escape.

## Antes de vender

Confirmar nombre, moneda, catálogo, precios, ubicación, disponibilidad, entregas e impuestos. Conectar backend, inventario, proveedor de pagos y correo. El formulario de compra no procesa pagos ni envía pedidos. La suscripción solo confirma la interacción dentro de la sesión; no guarda correos.

## Imágenes

Cuatro fotografías originales generadas con la herramienta integrada image_gen; archivos en `public/images/`. Prompts en `ASSETS.md`.

## Verificación

`npx playwright test` verifica catálogo, favoritos, persistencia del carrito, compra de demostración, imágenes, anchura móvil y movimiento reducido. Usa Microsoft Edge instalado. Capturas en `.playwright/`.
