# Entregable-Complementario 03 - Programación Backend

## Consigna

1. Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla).

   -  El link del correo debe expirar después de 1 hora de enviado.
   -  Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña.
   -  Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.

2. Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos.

3. Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto.

   -  Si un producto se crea sin owner, se debe colocar por defecto “admin”.
   -  El campo owner deberá guardar sólo el correo electrónico del usuario que lo haya creado (sólo podrá recibir usuarios premium)

4. Modificar los permisos de modificación y eliminación de productos para que:

   -  Un usuario premium sólo pueda borrar los productos que le pertenecen.
   -  El admin pueda borrar cualquier producto, aún si es de un owner.

5. **Cambiar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece.**

6. **Implementar una nueva ruta en el router de api/sessions, la cual será /api/sessions/premium/:uid la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.**

## Sugerencia

-  Testear muy bien todas las políticas de acceso.
