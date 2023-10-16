# Entregable 04 - Primera Pre-Entrega - Programación Backend

## Consigna

1. Desarrollar el **servidor basado en Node.JS y express**, que escuche en el **puerto 8080** y disponga de **dos grupos de rutas: /products y /carts**. Dichos endpoints estarán implementados con el router de express.

2. Para el **manejo de productos**, el cual tendrá **su router en /api/products/**, configurar las siguientes rutas:

-  **La ruta raíz GET /** deberá listar todos los productos de la base. **Incluyendo la limitación ?limit** del desafío anterior
-  **La ruta GET /:pid** deberá traer sólo el producto con el id proporcionado
-  **La ruta raíz POST /** deberá agregar un nuevo producto con los campos:

_id_: Number/String, (El id NO se manda desde body, se autogenera, asegurando que NUNCA se repetirán).
_title_:String,
_description_:String
_code_:String
_price_:Number
_status_:Boolean
_stock_:Number
_category_:String
_thumbnails_:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto

Status es true por defecto.
**Todos los campos son obligatorios, a excepción de thumbnails**

-  **La ruta PUT /:pid** deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
-  **La ruta DELETE /:pid** deberá eliminar el producto con el pid indicado.

3. Para el **carrito**, el cual tendrá **su router en /api/carts/**, configurar dos rutas:

-  **La ruta raíz POST /** deberá crear un nuevo carrito con la siguiente estructura:

_Id_:Number/String, (debes asegurar que nunca se dupliquen los ids y que este se autogenere).
_products_: Array que contendrá objetos que representen cada producto

-  **La ruta GET /:cid** deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
-  **La ruta POST /:cid/product/:pid** deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:

_product_: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
_quantity_: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

**Si un producto ya existente intenta agregarse, incrementar el campo quantity de dicho producto**.

4. La persistencia de la información se implementará **utilizando el file system**, donde los archivos “products.json” y “carts.json”, respaldan la información.

5. No es necesario realizar ninguna implementación visual, **todo el flujo se puede realizar por Postman** o por el cliente de tu preferencia. Tampoco es necesario implementar multer.

6. **No olvides app.use(express.json())**
