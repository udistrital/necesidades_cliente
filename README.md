# necesidades-cliente

En este repositorio se encuentra el cliente del modulo de necesidades.
Se hace uso de :
* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estable](https://nodejs.org/en/)

## Configuración del proyecto

* Clonar el repositorio: 
    ```shell 
        git clone https://github.com/udistrital/necesidades-cliente
    ```
* Instalar yo, grunt, bower y generator- karma y generator-oas
    ```shell 
        npm install -g grunt-cli bower yo generator-karma generator-oas
    ```
* Instalar dependencias
    ```shell 
        npm install
    ```
    ```shell 
        bower install
    ```


## Ejecución del proyecto

Para ejcutar el proyecto localmente se debe verificar en el archivo “config.js”, ubicado en la carpeta app/scripts/services/, que las apis estén correactamente configuradas y que estén deplegadas.

**conf_local**:
```
angular.module('contractualClienteApp')
    .constant('CONF', {
        GENERAL: conf_pruebas
    });

```
Ahora se puede correr el api de la siguiente manera:
    ```
        grunt serve
    ```

Para crear el build de la aplicación:
    ```
        grunt build
    ```

El cliente se depliega en el puerto [9000](http://localhost:9000). 

## Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
    ```
        grunt test
    ```
