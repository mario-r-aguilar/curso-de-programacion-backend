# Entregable 05 - Programación Backend

## Consigna

1. Configurar el servidor para integrar el motor de plantillas Handlebars e instalarle un servidor de socket.io

2. Crear una vista **“home.handlebars”** la cual contenga una **lista de todos los productos** agregados hasta el momento

3. Crear una vista **“realTimeProducts.handlebars”**, la cual vivirá en el **endpoint “/realtimeproducts”** en nuestro **views router**, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
   Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.

4. Se recomienda que, para la creación y eliminación de un producto, **se incluya un formulario** simple en la vista **realTimeProducts.handlebars**, para que el contenido se envíe desde websockets y no HTTP. _Sin embargo, esta no es la mejor solución, leer el siguiente punto_.

5. Si se desea hacer la conexión de socket emits con HTTP, deberás **buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST**. _¿Cómo utilizarás un emit dentro del POST?_

6. No incluir node_modules
