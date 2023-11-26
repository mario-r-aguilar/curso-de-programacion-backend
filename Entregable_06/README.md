# Entregable 06 - Programación Backend

## Consignas

1. **Modificar el método GET /** para que pueda recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)

   _limit_: permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.

   _page_: permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1

   _query_: el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general. Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.

   _sort_: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento

2. **El método GET** deberá devolver un objeto con el siguiente formato:

`{`
`status:success/error,`
`payload: Resultado de los productos solicitados`
`totalPages: Total de páginas`
`prevPage: Página anterior`
`nextPage: Página siguiente`
`page: Página actual`
`hasPrevPage: Indicador para saber si la página previa existe`
`hasNextPage: Indicador para saber si la página siguiente existe`
`prevLink: Link directo a la página previa (null si hasPrevPage=false)`
`nextLink: Link directo a la página siguiente (null si hasNextPage=false)`
`}`

3. Además, agregar al router de carts los siguientes endpoints:

   **DELETE** _api/carts/:cid/products/:pid_ deberá eliminar del carrito el producto seleccionado.

   **PUT** _api/carts/:cid_ deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.

   **PUT** _api/carts/:cid/products/:pid_ deberá poder actualizar **sólo la cantidad** de ejemplares del producto desde _req.body_

   **DELETE** _api/carts/:cid_ deberá eliminar todos los productos del carrito

4. El modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. **Modificar la ruta /:cid** para que al traer todos los productos, los traiga completos **mediante un “populate”**. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.

5. Crear una **vista en el router de views ‘/products’** para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:

   -  Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.

   -  Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.

6. Agregar una **vista en ‘/carts/:cid** (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.

7. Contarás con Mongo como sistema de persistencia principal y tendrás definidos todos los endpoints para poder trabajar con productos y carritos.

## Sugerencias

-  La lógica del negocio que ya tienes hecha no debería cambiar, sólo su persistencia.
-  Los nuevos endpoints deben seguir la misma estructura y lógica que hemos seguido.
-  No incluir la carpeta de node_modules
