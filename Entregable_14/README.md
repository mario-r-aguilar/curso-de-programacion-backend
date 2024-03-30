# Entregable 14 - Programación Backend

## Consigna

1. Desde el router de /api/sessions, **crear las siguientes rutas**:

   -  **GET / deberá obtener todos los usuarios,** éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)

   -  **DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días.** (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad

2. **Crear una vista para poder visualizar, modificar el rol y eliminar un usuario.** Esta vista únicamente será accesible para el administrador del ecommerce

3. **Modificar el endpoint que elimina productos,** para que, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado.

4. **Finalizar las vistas pendientes para la realización de flujo completo de compra.** NO ES NECESARIO tener una estructura específica de vistas, sólo las que tú consideres necesarias para poder llevar a cabo el proceso de compra.

5. **No es necesario desarrollar vistas para módulos que no influyan en el proceso de compra** (Como vistas de usuarios premium para crear productos, o vistas de panel de admin para updates de productos, etc)

6. **Realizar el despliegue de tu aplicativo en la plataforma de tu elección** (preferentemente Railway.app, pues es la abarcada en el curso) y corroborar que se puede llevar a cabo un proceso de compra completo. De ser necesario crear un nuevo repositorio para que este solo el proyecto final, sin los desafíos anteriores.
