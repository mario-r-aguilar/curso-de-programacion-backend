# Entregable 09 - Tercera Pre-Entrega - Programación Backend

## Consigna

1. Modificar nuestra capa de persistencia para **aplicar los conceptos de Factory, DAO y DTO**.

2. **El DAO seleccionado** (_por un parámetro en línea de comandos_) **será devuelto por una Factory** para que la capa de negocio opere con él.

3. **Implementar el patrón Repository** para trabajar con el DAO en la lógica de negocio.

4. **Modificar la ruta /current** para evitar enviar información sensible **usando un DTO** del usuario sólo con la información necesaria.

5. **Realizar un middleware** que pueda trabajar en conjunto con la estrategia “current” **para hacer un sistema de autorización y delimitar el acceso a los endpoints**:

   -  Sólo el administrador puede crear, actualizar y eliminar productos.
   -  Sólo el usuario puede enviar mensajes al chat.
   -  Sólo el usuario puede agregar productos a su carrito.

6. **Crear un modelo Ticket**, el cual contará con todas las formalizaciones de la compra. Éste tendrá los campos:

   -  **Id:** (autogenerado por mongo).
   -  **code:** String debe autogenerarse y ser único.
   -  **purchase_datetime:** Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at).
   -  **amount:** Number, total de la compra.
   -  **purchaser:** String, contendrá el correo del usuario asociado al carrito.

7. **Implementar** en el router de carts, **la ruta /:cid/purchase**, la cual permitirá **finalizar el proceso de compra** de dicho carrito.

8. **La compra debe corroborar el stock del producto** al momento de finalizarse:

   -  Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
   -  Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.

9. Utilizar el servicio de Tickets para **generar un ticket con los datos de la compra**.

10.   En caso de existir una **compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.**

11.   **Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse.** Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.
