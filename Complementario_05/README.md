# Entregable-Complementario 05 - Programación Backend

## Consigna

1. **Mover la ruta /api/users/premium/:uid** a un router específico para usuarios en /api/sessions/

2. **Modificar el modelo de User para que cuente con una nueva propiedad “documents”**, la cual será un array que contenga los objetos con las siguientes propiedades:

   -  name: String (Nombre del documento).
   -  reference: String (link al documento).

**No es necesario crear un nuevo modelo de Mongoose.**

3. **Agregar una propiedad al usuario llamada “last_connection”**, la cual deberá modificarse cada vez que el usuario realice un proceso de login y logout.

4. **Crear un endpoint en el router de usuarios api/sessions/:uid/documents** con el método POST que permita subir uno o múltiples archivos. **Utilizar el middleware de Multer para poder recibir los documentos** que se carguen y **actualizar en el usuario su status** para hacer saber que ya subió algún documento en particular.

5. **El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas** los diferentes archivos que se suban:

   -  Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles.
   -  En caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products.
   -  Mientras que al cargar un documento, multer los guardará en una carpeta documents.

6. **Modificar el endpoint /api/sessions/premium/:uid** para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:

   -  Identificación.
   -  Comprobante de domicilio.
   -  Comprobante de estado de cuenta.

7. **En caso de llamar al endpoint /api/sessions/premium/:uid, si no se ha terminado de cargar la documentación, devolver un error** indicando que el usuario no ha terminado de procesar su documentación (sólo si quiere pasar de user a premium, no al revés).

## Sugerencia

-  Corrobora que los usuarios que hayan pasado a premium tengan mayores privilegios de acceso que un usuario normal.
