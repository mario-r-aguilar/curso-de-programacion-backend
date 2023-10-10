# Entregable 03 - Programación Backend

## Consigna

1. Desarrollar un **Servidor Express** que en su archivo app.js importe al archivo de **ProductManager** que actualmente tenemos.

2. El servidor debe contar con los siguientes endpoints:

-  Ruta **‘/products’**, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para **recibir por query param el valor ?limit=** el cual recibirá un límite de resultados. Si no se recibe query de límite, se devolverán todos los productos, mientras que si se recibe un límite, sólo devolver el número de productos solicitados.

-  Ruta **‘/products/:pid’**, la cual debe **recibir por req.params el pid** (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.

3. Debe incluir:

-  **Carpeta src** con app.js y tu ProductManager dentro.
-  **Package.json** con la info del proyecto.

4. Recuerda **usar async/await** en tus endpoints.

5. **Utiliza un archivo que ya tenga productos**, pues el desafío sólo es para gets.
