'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.necesidad/necesidadService
 * @description
 * # necesidad/necesidadService
 * Service in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .service('necesidadService', function ($translate, administrativaRequest, planCuentasRequest, necesidadesCrudRequest, planCuentasMidRequest, metasRequest, coreAmazonRequest, agoraRequest, oikosRequest, financieraRequest) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    self.EstadoNecesidadType = {};



    necesidadesCrudRequest.get('estado_necesidad', $.param({})).then(function (response) {
      var keys = ["Solicitada", "Aprobada", "Rechazada", "Anulada", "Modificada", "Enviada", "CdpSolicitado", "Guardada"];
      keys.forEach(function (v, i) {
        self.EstadoNecesidadType[v] = response.data[i];
      });
    });

    self.AlertaErrorEspecificaciones = {
      Compra: {
        title: 'Error en el valor de especificaciones',
        type: 'error',
        text: 'Verifique que el valor total de la compra sea igual al valor de financiación.',
        showCloseButton: true,
        confirmButtonText: $translate.instant("CERRAR")
      },
      CPS: {
        title: 'Error en el valor de especificaciones',
        type: 'error',
        text: 'Verifique que el valor ingresado para la prestación de servicio coincida con el valor de financiación.',
        showCloseButton: true,
        confirmButtonText: $translate.instant("CERRAR")
      },
      CompraServicio: {
        title: 'Error en el valor de especificaciones',
        type: 'error',
        text: 'Verifique que la suma del valor del servicio más el total de la compra coincida con el valor de financiación.',
        showCloseButton: true,
        confirmButtonText: $translate.instant("CERRAR")
      },
      Servicio: {
        title: 'Error en el valor de especificaciones',
        type: 'error',
        text: 'Verifique que el valor ingresado para el servicio coincida con el valor de financiación.',
        showCloseButton: true,
        confirmButtonText: $translate.instant("CERRAR")
      }
    }

    self.calculo_total_dias = function (anos, meses, dias) {
      anos = anos == undefined ? 0 : anos;
      meses = meses == undefined ? 0 : meses;
      dias = dias == undefined ? 0 : dias;

      return ((parseInt(anos, 10) * 360) + (parseInt(meses, 10) * 30) + parseInt(dias, 10));
    };

    self.calculo_total_dias_rev = function (DiasDuracion) {
      var c = DiasDuracion;
      var data = { anos: 0, meses: 0, dias: 0 };
      data.anos = Math.floor(c / 360);
      c %= 360;
      data.meses = Math.floor(c / 30);
      c %= 30;
      data.dias = c;
      return data;
    };

    self.get_info_dependencia = function (id_jefe_dependencia) {
      var out = { jefe_dependencia: {}, persona: {}, dependencia: {} };
      return new Promise(function (resolve, reject) {
        if (!id_jefe_dependencia) {
          reject(out);
        }
        coreAmazonRequest.get('jefe_dependencia/' + id_jefe_dependencia).then(function (response_jefe_dependencia) {
          out.jefe_dependencia = response_jefe_dependencia.data;

          agoraRequest.get('informacion_persona_natural/' + response_jefe_dependencia.data.TerceroId).then(function (response_persona_natural) {
            out.persona = response_persona_natural.data;

            oikosRequest.get('dependencia', $.param({
              query: 'Id:' + response_jefe_dependencia.data.DependenciaId
            })).then(function (response_dependencia) {
              out.dependencia = response_dependencia.data[0];
              resolve(out);
            });
          });
        });
      });
    };

    //Obtiene todo el jefe de dependencia teniendo del id del jefe o la dependencia, si idOrDep es true, se utilizará el id del jefe
    self.getJefeDependencia = function (idDependencia, idOrDep) {
      var out = { JefeDependencia: {}, Persona: {} }
      return new Promise(function (resolve, reject) {
        if (!idDependencia) {
          reject(out);
        }

        coreAmazonRequest.get('jefe_dependencia', $.param({
          query: (idOrDep ? "Id:" + idDependencia : "DependenciaId:" + idDependencia + ',FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD')),
          limit: -1,
        })).then(function (response) {
          out.JefeDependencia = response.data[0]; //TODO: cambiar el criterio para tomar en cuenta el periodo de validez del jefe

          return agoraRequest.get('informacion_persona_natural', $.param({
            query: 'Id:' + response.data[0].TerceroId,
            limit: -1
          }))
        }).then(function (response) {
          out.Persona = response.data[0];
          resolve(out);
        }).catch(function (error) {
          // console.error(error);
        });
      });
    };


    self.getInfoPersonaNatural = function (idPersona) {
      var out = { Persona: {} }
      return new Promise(function (resolve, reject) {
          return agoraRequest.get('informacion_persona_natural', $.param({
            query: 'Id:' + idPersona,
            limit: -1
          })
        ).then(function (response) {
          out.Persona = response.data[0];
          resolve(out);
        }).catch(function (error) {
          // console.error(error);
        });
      });
    };

    self.getAllDependencias = function () {
      return new Promise(function (resolve, reject) {
        oikosRequest.get('dependencia', $.param({
          limit: -1,
          sortby: "Nombre",
          order: "asc",
        })).then(function (response) {
          resolve(response.data);
        });
      });
    };

    self.getApropiacionesData = function (Ffapropiacion) {
      var apropiaciones_data = [];
      return new Promise(function (resolve, reject) {
        if (Ffapropiacion.length === 0) {
          resolve([]);
        }
        Ffapropiacion.map(function (ap, i, arr) {
          financieraRequest.get('apropiacion', $.param({
            query: 'Id:' + ap.Apropiacion
          })).then(function (response) {
            apropiaciones_data.push(response.data[0]);
            if (i == arr.length - 1) {
              resolve(apropiaciones_data);
            }
          });
        });
      });
    };



    self.groupBy = function (list, keyGetter) {
      var map = new Map();
      list.forEach(function (item) {
        var key = keyGetter(item);
        var collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    }

    self.getAlertaFinanciacion = function (codigoRubro) {
      return {
        fuentesMayorQueRubro: {
          title: 'Error Valor Fuentes Rubro ' + codigoRubro,
          type: 'error',
          text: 'Verifique los valores de fuentes de financiamiento, la suma no puede superar el saldo del rubro.',
          showCloseButton: true,
          confirmButtonText: $translate.instant("CERRAR")
        },
        metasMayorQueProducto: {
          title: 'Error Valor Metas y actividades Rubro ' + codigoRubro,
          type: 'error',
          text: 'Verifique los valores de metas y actividades, la suma no puede superar el valor de los productos.',
          showCloseButton: true,
          confirmButtonText: $translate.instant("CERRAR")
        },
        productosDiferenteAFuentes: {
          title: 'Error Valor Productos Rubro ' + codigoRubro,
          type: 'error',
          text: 'Verifique los valores de productos, la suma debe ser igual a la suma de las fuentes.',
          showCloseButton: true,
          confirmButtonText: $translate.instant("CERRAR")
        }
      }
    }



    self.getParametroEstandar = function () {
      return agoraRequest.get('parametro_estandar', $.param({
        query: "ClaseParametro:" + 'Tipo Perfil',
        limit: -1
      }));
    }


    self.initNecesidad = function (IdNecesidad) {
      var trNecesidad = {};
      var trNecesidadPC = [];
      var t = false
      if (IdNecesidad && t) {


      } else {
        trNecesidad.Necesidad = {};
        trNecesidad.Necesidad.TipoNecesidad = { Id: 1 };
        trNecesidad.Necesidad.TipoContratoNecesidad = { Id: "" };
        trNecesidad.Necesidad.DiasDuracion = 0;
        trNecesidad.Necesidad.UnicoPago = true;
        trNecesidad.ActividadEspecifica = [];
        trNecesidad.DetalleServicioNecesidad = { NucleoConocimiento: 0 }
        trNecesidad.DependenciaNecesidad = { JefeDependenciaSolicitante: 6 };
        trNecesidad.Necesidad.AgotarPresupuesto = false;
        trNecesidad.Necesidad.Valor = 0;
        administrativaRequest.get('estado_necesidad', $.param({
          query: "Nombre:Solicitada"
        })).then(function (response) {
          trNecesidad.Necesidad.EstadoNecesidad = response.data[0];
        });

        return new Promise(function (resolve, reject) {
          resolve([trNecesidad, trNecesidadPC]);
        });
      }


    };

    //funcion que reemplaza initnecesidad usando plan cuentas mid
    self.getFullNecesidad = function (idNecesidad) {
      if (idNecesidad) {
        return planCuentasMidRequest.get('necesidad/getfullnecesidad/' + idNecesidad)
      }
      else {
        // localStorage.setItem("necesidad",JSON.stringify(self.Necesidad));
        // console.info(JSON.parse(localStorage.getItem("necesidad")))
        return new Promise(function (resolve, reject) {
          //Datos iniciales necesarios
          var EmptyNecesidad = {
            DependenciaNecesidadId: {
              InterventorId: undefined,
              JefeDepDestinoId: undefined,
              JefeDepSolicitanteId: undefined,
              SupervisorId: undefined
            },
            Vigencia: new Date().getFullYear() + "",
            Valor: 0,
            DiasDuracion: 0,

          }
          // revisar si existen objetos de necesidad guardados en el localstorage para devolverlos
          resolve({
            Necesidad: (localStorage.getItem("Necesidad") === null) ? EmptyNecesidad : JSON.parse(localStorage.getItem("Necesidad")),
            DetalleServicioNecesidad: (localStorage.getItem("DetalleServicioNecesidad") === null) ? {} : JSON.parse(localStorage.getItem("DetalleServicioNecesidad")),
            DetallePrestacionServicioNecesidad: (localStorage.getItem("DetallePrestacionServicioNecesidad") === null) ? {} : JSON.parse(localStorage.getItem("DetallePrestacionServicioNecesidad")),
            ProductosCatalogoNecesidad: (localStorage.getItem("ProductosCatalogoNecesidad") === null) ? [] : JSON.parse(localStorage.getItem("ProductosCatalogoNecesidad")),
            MarcoLegalNecesidad: (localStorage.getItem("MarcoLegalNecesidad") === null) ? [] : JSON.parse(localStorage.getItem("MarcoLegalNecesidad")),
            ActividadEspecificaNecesidad: (localStorage.getItem("ActividadEspecificaNecesidad") === null) ? [] : JSON.parse(localStorage.getItem("ActividadEspecificaNecesidad")),
            ActividadEconomicaNecesidad: (localStorage.getItem("ActividadEconomicaNecesidad") === null) ? [] : JSON.parse(localStorage.getItem("ActividadEconomicaNecesidad")),
            Rubros: (localStorage.getItem("Rubros") === null) ? [] : JSON.parse(localStorage.getItem("Rubros"))
          });
        });
      }

    }


    return self;
  });
