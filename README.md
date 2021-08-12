# necesidades-cliente

En este repositorio se encuentra el cliente del modulo de resoluciones.

## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones

* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* ~~[Node.js en la versión estable](https://nodejs.org/en/)~~

### Variables de Entorno

```shell
# En Pipeline
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```

### Ejecución del Proyecto

Clonar el proyecto del repositorio de git

```bash
# clone the project
git clone https://github.com/udistrital/necesidades-cliente.git
# enter the project directory
cd necesidades-cliente
```

Iniciar el servidor en local

```bash
# install dependency
npm install

# start server
npm start
```

El cliente se depliega en el 9000; : [Modulo de necesidades](http://0.0.0.0:9000/#/necesidades).

**TO-DO: Configurar npm o grunt para lint!**

<!--
Linter

```bash
# Angular linter
npm run lint
# run linter and auto fix
npm run lint:fix
# run linter on styles
npm run lint:styles
# run lint UI
npm run lint:ci
```
-->

Para crear el build de la aplicación:

```bash
npm run build
```

### Ejecución Dockerfile

```bash
# Does not apply
```

### Ejecución docker-compose

```bash
# Does not apply
```

### Ejecución Pruebas

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:

```bash
npm run test:legacy
```

**TO-DO: Revisar si vale la pena pasar a [Jest.js](https://jestjs.io/)**
<!--
Pruebas unitarias powered by Jest

```bash
# run unit test
npm run test
# Runt linter + unit test
npm run test:ui
```
-->

## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/necesidades_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/necesidades_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/necesidades_cliente/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/necesidades_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/necesidades_cliente/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/necesidades_cliente) |

## Licencia

This file is part of necesidades-cliente

necesidades-cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (atSara Sampaio your option) any later version.

necesidades-cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with necesidades-cliente. If not, see [LICENSE](LICENSE).
