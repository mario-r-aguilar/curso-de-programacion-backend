# Entregable 02 - Programación Backend

## Consigna

1. Realizar una clase de nombre **“ProductManager”**, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).

2. La clase debe contar con una variable **this.path**, el cual se inicializará desde el constructor y **debe recibir la ruta a trabajar desde el momento de generar su instancia**.

3. Debe guardar objetos con el siguiente formato:

_id_ (se debe incrementar automáticamente, no enviarse desde el cuerpo)
_title_ (nombre del producto)
_description_ (descripción del producto)
_price_ (precio)
_thumbnail_ (ruta de imagen)
_code_ (código identificador)
_stock_ (número de piezas disponibles)

4. Debe tener un método **addProduct** el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda **siempre guardarlo como un array en el archivo**).

5. Debe tener un método **getProducts**, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.

6. Debe tener un método **getProductById**, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto

7. Debe tener un método **updateProduct**, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID

8. Debe tener un método **deleteProduct**, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
