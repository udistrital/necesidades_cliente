'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.necesidad/necesidadService
 * @description
 * # necesidad/necesidadService
 * Service in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .service('necesidadService', function (administrativaRequest, planCuentasRequest, metasRequest, coreAmazonRequest, agoraRequest, oikosRequest, financieraRequest, $translate,) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    self.EstadoNecesidadType = {};



    administrativaRequest.get('estado_necesidad', $.param({})).then(function (response) {
      var keys = ["Solicitada", "Aprobada", "Rechazada", "Anulada", "Modificada", "Enviada", "CdpSolicitado"];
      keys.forEach(function (v, i) {
        self.EstadoNecesidadType[v] = response.data[i];
      });
    });

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

    //Obtiene todo el jefe de dependencia demendiendo del id del jefe o la dependencia, si idOrDep es true, se utilizará el id del jefe
    self.getJefeDependencia = function (idDependencia, idOrDep) {
      var out = { JefeDependencia: {}, Persona: {} }
      return new Promise(function (resolve, reject) {
        if (!idDependencia) {
          reject(out);
        }

        coreAmazonRequest.get('jefe_dependencia', $.param({
          query: (idOrDep ? "Id:" + idDependencia : "DependenciaId:" + idDependencia) + ',FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD'),
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
          title: 'Error Valor Fuentes Rubro '+codigoRubro,
          type: 'error',
          text: 'Verifique los valores de fuentes de financiamiento, la suma no puede superar el saldo del rubro.',
          showCloseButton: true,
          confirmButtonText: $translate.instant("CERRAR")
        },
        metasMayorQueProducto: {
          title: 'Error Valor Metas y actividades Rubro '+codigoRubro,
          type: 'error',
          text: 'Verifique los valores de metas y actividades, la suma no puede superar el valor de los productos.',
          showCloseButton: true,
          confirmButtonText: $translate.instant("CERRAR")
        },
        productosDiferenteAFuentes: {
          title: 'Error Valor Productos Rubro '+codigoRubro,
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

    self.getFinanciacion = function (necesidad_pc, vigencia, unidadejecutora) {
      var response = []
      if (Array.isArray(necesidad_pc.apropiaciones)) {
        necesidad_pc.apropiaciones.forEach(function (ap) {
          planCuentasRequest.get('arbol_rubro_apropiacion/' + ap.codigo + '/' + vigencia + '/' + unidadejecutora).
            then(
              function (res_apr) {
                var item = {
                  Apropiacion: _.merge(res_apr.data.Body,
                    {
                      meta: {
                        actividades: []
                      },
                      fuentes: [],
                      productos: []
                    })
                }
                var tempmetas;
                metasRequest.get('2019').then(
                  function (res) {

                    tempmetas = res.data.metas.actividades;
                    item.Apropiacion.meta.actividades = ap.metas[0].actividades.map(function (act) {
                      return tempmetas.filter(function (m) {
                        return (m.meta_id === ap.metas[0].codigo) && (m.actividad_id === act.codigo)
                      })[0] || null;
                    });
                  }
                ).catch(function (err) {
                  // console.info(err)
                });


                ap.fuentes.forEach(function (fuente) {
                  planCuentasRequest.get('fuente_financiamiento/' + fuente.codigo)
                    .then(
                      function (res_fuente) {
                        item.Apropiacion.fuentes.push(_.merge(res_fuente.data.Body, { MontoParcial: fuente.valor }))
                      }
                    )
                })
                ap.metas.forEach(function (producto) {
                  planCuentasRequest.get('producto/' + producto._id)
                    .then(
                      function (res_prod) {
                        item.Apropiacion.productos.push(_.merge(res_prod.data.Body, { MontoParcial: producto.valor }))
                      }
                    )
                })
                response.push(item)
              }
            )
        })
      }
      return response
    }

    self.initNecesidad = function (IdNecesidad) {
      var trNecesidad = {};
      var trNecesidadPC = [];
      if (IdNecesidad) {
        return Promise.all([administrativaRequest.get('necesidad'),
        planCuentasRequest.get('necesidades', $.param({
          query: "idAdministrativa:" + IdNecesidad
        }))]).then(function (response) {
          var responseMongo = response[1].data.Body[0] || {};
          response = response[0];
          trNecesidad.Necesidad = response.data.filter(
            function (e) {
              return e.Id + "" === IdNecesidad + "";
            }
          )[0];
          trNecesidadPC = self.getFinanciacion(responseMongo, trNecesidad.Necesidad.Vigencia, trNecesidad.Necesidad.UnidadEjecutora);
          return new Promise(function (resolve, reject) {
            if (trNecesidad.Necesidad.TipoContratoNecesidad.Id === 5) { // Tipo Servicio
              administrativaRequest.get('detalle_servicio_necesidad', $.param({
                query: 'Necesidad:' + IdNecesidad
              })).then(function (response) {
                trNecesidad.DetalleServicioNecesidad = response.data[0];

                return administrativaRequest.get('actividad_especifica', $.param({
                  query: 'Necesidad:' + IdNecesidad
                }))
              }).then(function (response) {
                trNecesidad.ActividadEspecifica = response.data;

                return administrativaRequest.get('actividad_economica_necesidad', $.param({
                  query: 'Necesidad:' + IdNecesidad
                }))
              }).then(function (response) {
                trNecesidad.ActividadEconomicaNecesidad = response.data;
                resolve("OK");
              });
            } else {

              resolve("Ok");
            }
          }).then(function (response) {
            return administrativaRequest.get('marco_legal_necesidad', $.param({
              query: 'Necesidad:' + IdNecesidad
            }))
              .then(function (response) {
                trNecesidad.MarcoLegalNecesidad = response.data;

                return administrativaRequest.get('dependencia_necesidad', $.param({
                  query: 'Necesidad:' + IdNecesidad
                }))
              }).then(function (response) {
                trNecesidad.DependenciaNecesidad = response.data[0];




                return coreAmazonRequest.get('jefe_dependencia', $.param({
                  query: "Id:" + trNecesidad.DependenciaNecesidad.JefeDependenciaDestino + ',FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD'),
                  limit: -1,
                }))
              }).then(function (response) {
                trNecesidad.DependenciaNecesidadDestino = response.data[0].DependenciaId;
                return coreAmazonRequest.get('jefe_dependencia', $.param({
                  query: "Id:" + trNecesidad.DependenciaNecesidad.JefeDependenciaSolicitante + ',FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD'),
                  limit: -1,
                }))
              }).then(function (response) {
                trNecesidad.DependenciaNecesidadSolicitante = response.data[0].DependenciaId;

                return coreAmazonRequest.get('jefe_dependencia', $.param({
                  query: "TerceroId:" + trNecesidad.DependenciaNecesidad.OrdenadorGasto + ',FechaInicio__lte:' + moment().format('YYYY-MM-DD') + ',FechaFin__gte:' + moment().format('YYYY-MM-DD'),
                  limit: -1
                }))
              }).then(function (response) {
                trNecesidad.RolOrdenadorGasto = response.data[0].DependenciaId;
                return new Promise(function (resolve, reject) {
                  resolve([trNecesidad, trNecesidadPC]);
                });
              }).catch(function (err) {
                return new Promise(function (resolve, reject) {
                  resolve([trNecesidad, trNecesidadPC]);
                });
              });
          });
        });


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

    return self;
  });
