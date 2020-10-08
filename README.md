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

***Se recomienda ejecutar el cliente antes de abrir el proyecto de visual code ya que a veces genera problemas.***

Para crear el build de la aplicación:
```
    grunt build
```
El cliente se depliega en el 9000; : [Modulo de necesidades](http://0.0.0.0:9000/#/necesidades).

## Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
```
    grunt test
```

## Licencia

[licencia](LICENSE)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
