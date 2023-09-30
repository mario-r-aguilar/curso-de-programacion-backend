# Entregable 01 - Programación Backend

## Consigna

1. Realizar una clase **“ProductManager”** que gestione un conjunto de productos.
   Debe crearse desde su constructor con el elemento **products**, el cual será un arreglo vacío.

2. Cada producto que gestione debe contar con las propiedades:

-  title (nombre del producto)
-  description (descripción del producto)
-  price (precio)
-  thumbnail (ruta de imagen)
-  code (código identificador)
-  stock (número de piezas disponibles)

3. Debe contar con un método **“addProduct”** el cual agregará un producto al arreglo de productos inicial.
   Validar que no se repita el campo **“code”** y que **todos los campos sean obligatorios**
   Al agregarlo, **debe crearse con un id autoincrementable**

4. Debe contar con un método **“getProducts”** el cual debe devolver el arreglo con todos los productos creados hasta ese momento

5. Debe contar con un método **“getProductById”** el cual debe buscar en el arreglo el producto que coincida con el id. **En caso de no coincidir** con ningún id, **mostrar** en consola **un error _“Not found”_**
