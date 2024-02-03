# Entregable 12 - Programación Backend

## Consigna

1. Definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):

   -  debug
   -  http
   -  info
   -  warning
   -  error
   -  fatal

2. Implementar un logger para desarrollo y un logger para producción.

   -  El logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola.
   -  El logger del entorno productivo deberá loggear sólo a partir de nivel info. Además el logger enviará en un transporte de archivos a partir del nivel de error con el nombre “errors.log”.

3. Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.

4. Crear un endpoint /loggertest que permita probar todos los logs.
