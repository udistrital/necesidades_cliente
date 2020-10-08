'use strict';
/**
 * @ngdoc function
 * @name core.controller:menuaplicacionesCtrl
 * @description
 * # menuaplicacionesCtrl
 * Controller of the core
 */
angular.module('core')
    .controller('menuaplicacionesCtrl',
        function (configuracionRequest, $scope, behaviorTheme) {
            var categorias = [
                {
                    nombre: 'GAIA - Gestión Administrativa',
                    color: '#8E2825',
                    aplicaciones: [
                        {
                            nombre: 'AGORA',
                            url: 'https://www.google.com',
                            estilo: 'agora',
                            descripcion: 'Banco de proveedores que apoya procesos de cotización y contratación',
                        },
                        {
                            nombre: 'ARGO',
                            url: 'https://www.google.com',
                            estilo: 'argo',
                            descripcion: 'Apoyo en la gestión de procesos precontractuales, contractuales y de compras',
                        },
                        {
                            nombre: 'ARKA',
                            url: 'https://www.google.com',
                            estilo: 'arka',
                            descripcion: 'Gestión de los movimientos de almacén e inventarios apoyando los procesos relacionados a bienes',
                        },
                        {
                            nombre: 'CUMPLIDOS',
                            url: 'https://pruebascumplidos.portaloas.udistrital.edu.co',
                            estilo: 'cumplidos',
                            descripcion: 'Apoyo de procesos postcontractuales tanto para docentes de vinculacion especial como CPS',
                        },
                        {
                            nombre: 'RESOLUCIONES',
                            url: 'https://pruebasresoluciones.portaloas.udistrital.edu.co',
                            estilo: 'resoluciones',
                            descripcion: 'Gestión del vinculo contractual de los docentes de vinculación especial apoyando procesos de RRHH',
                        },
                        {
                            nombre: 'OIKOS',
                            url: 'https://www.google.com',
                            estilo: 'oikos',
                            descripcion: 'Registro y definición de las dependencias y espacios físicos de la universidad distrital',
                        },
                        {
                            nombre: 'SISIFO',
                            url: 'https://www.google.com',
                            estilo: 'sisifo',
                            descripcion: 'Sistema de gestion de planes de mejoramiento para los procesos académico administrativos',
                        },
                        {
                            nombre: 'TEMIS',
                            url: 'https://www.google.com',
                            estilo: 'temis',
                            descripcion: 'Apoyo en la definición y cálculo de las cuotas partes pensionales con entidades externas',
                        },
                        {
                            nombre: 'PERSEO',
                            url: 'https://www.google.com',
                            estilo: 'perseo',
                            descripcion: 'Permitir el desarrollo de procesos electorales dentro de la universidad de forma digital',
                        },
                    ],
                },
                {
                    nombre: 'URANO - Gestión Académica',
                    color: '#15485E',
                    aplicaciones: [
                        {
                            nombre: 'JANO',
                            url: 'https://www.google.com',
                            estilo: 'jano',
                            descripcion: 'Apoyo en el desarrollo de concursos de mérito para ocupar plazas de planta docente',
                        },
                        {
                            nombre: 'KYRON',
                            url: 'https://www.google.com',
                            estilo: 'kyron',
                            descripcion: 'Registro y consolidación de información de producción académica de docentes de planta',
                        },
                        {
                            nombre: 'POLUX',
                            url: 'https://www.google.com',
                            estilo: 'polux',
                            descripcion: 'Apoya la gestion de trabajos de grado'
                        },
                        {
                            nombre: 'SGA',
                            url: 'https://pruebassga.portaloas.udistrital.edu.co',
                            estilo: 'sga',
                            descripcion: 'Apoya el desarrollo de la misión de la universidad, así como diversos procesos administrativos',
                        },
                        {
                            nombre: 'CAMPUS',
                            url: 'https://www.google.com',
                            estilo: 'campus',
                            descripcion: 'Campus Virtual para postgrados',
                        },
                        {
                            nombre: 'SICIUD',
                            url: 'https://www.google.com',
                            estilo: 'siciud',
                            descripcion: 'Una breve descripción acerca de sisiud',
                        },
                    ],
                },
                {
                    nombre: 'NIX - Gestión Financiera',
                    color: '#DE9E0F',
                    aplicaciones: [
                        {
                            nombre: 'KRONOS',
                            url: 'https://pruebaspresupuesto.portaloas.udistrital.edu.co',
                            estilo: 'kronos',
                            descripcion: 'Apoyar el libre desarrollo de los procesos financieros y reporte de información a entes de control',
                        },
                        {
                            nombre: 'TITAN',
                            url: 'https://www.google.com',
                            estilo: 'titan',
                            descripcion: 'Construir las diferentes nóminas y pago de honorarios de los compromisos contractuales',
                        },
                    ],
                },
                {
                    nombre: 'ATHENEA - Analíticos',
                    color: '#397A18',
                    aplicaciones: [
                        {
                            nombre: 'SPAGOBI',
                            url: 'https://www.google.com',
                            estilo: 'spagobi',
                            descripcion: 'Una breve descripción acerca de spagobi',
                        },
                        {
                            nombre: 'CIRENE',
                            url: 'https://www.google.com',
                            estilo: 'cirene',
                            descripcion: 'Una breve descripción acerca de cirene',
                        },
                        {
                            nombre: 'APEA',
                            url: 'https://www.google.com',
                            estilo: 'apea',
                            descripcion: 'Una breve descripción acerca de apea',
                        },
                    ],
                },
            ];
            $scope.claseAppContainer = behaviorTheme.aplicacion;
            var getRoles = function () {

                var data = [];
                if (window.localStorage.getItem('id_token') !== null) {
                    //isLogin = true;
                    // tslint:disable-next-line: variable-name
                    var id_token = window.localStorage.getItem('id_token').split('.');
                    var payload = JSON.parse(atob(id_token[1]));
                    return payload.role.map(function (element) {
                        return { Nombre: element }
                    });
                } else {
                    //this.isLogin = false;
                    //this.dataFilterSubject.next(this.categorias);
                }
            }

            var container_aplicativos = document.getElementById("menu-aplicaciones");
            
            var existe = function (nombre, array) {

                var filtro = array.filter(function (data) {
                    return (nombre.toLowerCase() === data.Nombre.toLowerCase())
                });
                return filtro.length > 0;
            }

            configuracionRequest.post('aplicacion_rol/aplicacion_rol', getRoles())
                .then(function (response) {

                     var nuevasAplicaciones = categorias.map(function (categoria) {

                        categoria.aplicaciones = categoria.aplicaciones.filter(function (aplicacion) {
                            return existe(aplicacion.nombre, response.data)
                        })
                        return categoria
                    })
                    nuevasAplicaciones = nuevasAplicaciones.filter(function (categoria) { return (categoria.aplicaciones.length > 0) });  
                        $scope.categorias = nuevasAplicaciones;
                    
                }).catch(function (error) {console.log(error)});
        });