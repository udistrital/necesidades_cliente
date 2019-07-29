# necesidades-cliente

En este repositorio se encuentra el cliente del modulo de resoluciones.
Se hace uso de :
* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estable](https://nodejs.org/en/)

## Configuración del proyecto

* Clonar el repositorio: 
```shell
    https://github.com/udistrital/necesidades-cliente
```
* entrar a la carpeta del repositorio: 
```shell 
    cd necesidades-cliente
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

El cliente corre ejecutando la siguiente linea: 
```
    grunt serve
```

***Se recomienda ejecutar el cliente antes de abrir el proyecto de visual coda ya que a veces genera problemas.***

Para crear el build de la aplicación:
```
    grunt build
```
El cliente se depliega en el 9000; ya que este cliente no tiene menu ingrese al siguiente link: [Modulo de necesidades](http://0.0.0.0:9000/#/necesidades).

## Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
```
    grunt test
```
