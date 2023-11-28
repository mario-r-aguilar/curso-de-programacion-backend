# Entregable-Complementario 01 - Programación Backend

## Consigna

1. Agregar el modelo de persistencia de **Mongo y mongoose** a tu proyecto.

2. Crear una **base de datos llamada “ecommerce”** dentro de tu Atlas, crear sus **colecciones “carts”, “messages”, “products”** y sus respectivos schemas.

3. **Separar los Managers** de fileSystem de los managers de MongoDb **en una sola carpeta llamada “dao”**.

4. Dentro de dao, **agregar también una carpeta “models”** donde vivirán los esquemas de MongoDB.

5. Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem
   **NO ELIMINAR FileSystem de tu proyecto**.

6. Implementar una **vista nueva en handlebars llamada chat.handlebars**, la cual permita incluir un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es: {user:correoDelUsuario, message: mensaje del usuario}

7. **Corroborar la integridad** del proyecto para que todo funcione como lo ha hecho hasta ahora. **No incluir node_modules**.
