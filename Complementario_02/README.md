# Entregable-Complementario 02 - Programación Backend

## Consigna

Continuar sobre el proyecto que has trabajado para tu e-commerce y configurar los siguientes elementos:

1. Crear un **modelo User** el cual contará con los campos:

   -  name: String,
   -  lastname: String,
   -  email: String (único),
   -  age: Number,
   -  password: String (hash),
   -  _cart: Id con referencia a Carts,_
   -  role: String (default:'user')

2. Desarrollar las estrategias de Passport para que funcionen con este modelo de usuarios

3. Modificar el sistema de login del usuario para poder trabajar con session o con jwt (a tu elección).

   **Sólo para jwt:** desarrollar una **estrategia “current”** para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, **utilizar un extractor de cookie**.

4. **Agregar** al router /api/sessions/ **la ruta /current**, la cual utilizará el modelo de sesión que estés usando, **para poder devolver en una respuesta el usuario actual**.
