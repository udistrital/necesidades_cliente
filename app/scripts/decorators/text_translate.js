"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the contractualClienteApp
 */
var text_es = {
  BTN: {
    VER: "Ver",
    SELECCIONAR: "Seleccionar",
    CANCELAR: "Cancelar",
    CONFIRMAR: "Confirmar",
    AGREGAR: "Agregar",
    REGISTRAR: "Registrar",
    SOLICITAR_RP:"Solicitar RP",
    QUITAR_RUBRO: "Quitar",
    VER_SEGUIMIENTO_FINANCIERO:"Ver seguimiento financiero",
  },
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  NECESIDADES: "Necesidades",
  NECESIDAD: "Necesidad",
  SOLICITUD: "Solicitud",
  //SOLICITUD RP
  ERROR: "Error",
  SALIR:"Salir",
  VOLVER_CONTRATOS: "Volver a contratos",
  NUMERO_SOLICITUD:"Número solicitud",
  INSERCION_RP:"Se insertó correctamente la solicitud del registro presupuestal con los siguientes datos",
  VIGENCIA_SOLICITUD: "Vigencia solicitud",
  FECHA_SOLICITUD: "Fecha solicitud",
  NUMERO_CONTRATO: "Número contrato",
  SELECCIONE_UNA_VIGENCIA:"Seleccione una vigencia diferente",
  RESPONSABLE_DOCUMENTO: "Responsable documento",
  RESPONSABLE: "Responsable",
  DATOS_APROPIACIONES: "Datos de las apropiaciones",
  MODALIDAD_SELECCION: "Modalidad Selección",
  CONTRATO: "Contrato",
  VIGENCIA_CONTRATO: "Vigencia contrato",
  FUENTE:"Fuente",
  SOLICITUD_PERSONAS:"Contratos para solicitud del registro presupuestal",
  VIGENCIA_ACTUAL:"Vigencia Actual ",
  VIGENCIA_SELECCIONADA:"Vigencia Seleccionada ",
  SELECCION_CDP:"Selección de CDP",
  UNIDAD_EJECUTORA:"Unidad ejecutora",
  ESTADO:"Estado",
  SELECCION_COMPROMISO:"Selección de Compromiso",
  SOLICITUD_RP: "Solicitud Registro Presupuestal",
  DATOS_RP:"Datos del Registro Presupuestal",
  BENEFICIARIO:"Beneficiario",
  NOMBRE_CONTRATISTA: "Nombre",
  DOCUMENTO_CONTRATISTA: "No Documento",
  NOMBRE: "Nombre",
  CONTRATO: "Contrato",
  FUENTE_FINANCIAMIENTO: "Fuente Financiamiento",
  VALOR: "Valor",
  COMPROMISO: "Compromiso",
  NUMERO:"Número",
  VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_AP:"Saldo apropiación",
  CDP:"CDP",
  CODIGO: "Codigo",
  CONSECUTIVO:"Consecutivo",
  OBJETIVO:"Objetivo",
  OBJETO:"Objeto",
  ORDENADOR:"Ordenador",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Seguimiento financiero del contrato",
  DATOS_CONTRATO:"Datos contrato",
  ORDENES_PAGO: "Ordenes pago",
  ESTADISTICAS : "Estadisticas",
  DATOS_FINANCIEROS_CONTRATO: "Datos financieros del contrato",
  DATOS_CONTRATISTA: "Datos contratista",
  APELLIDOS: "Apellidos",
  NOMBRES: "Nombres",
  TIPO_DOCUMENTO: "Tipo documento",
  NUMERO_DOCUMENTO : "No documento",
  FECHA_INICIO:"Fecha inicio",
  FECHA_FIN:"Fecha fin",
  DATOS_REGISTRO_PRESUPUESTAL:"Datos del registro presupuestal",
  NUMERO_REGISTRO_PRESUPUESTAL: "No RP",
  NOMBRE_REGISTRO_PRESUPUESTAL: "Nombre RP",
  NUMERO_DISPONIBILIDAD: "No CDP",
  NOMBRE_DISPONIBILIDAD: "Nombre CDP",
  ORDEN_PAGO: "Orden pago",
  FECHA_ORDEN: "Fecha orden",
  VALOR_BRUTO: "Valor bruto",
  LINEA_ORDEN_PAGO:"Linea del tiempo de ordenes de pago",
  ESTADISTICAS_GENERALES: "Estadisticas generales",
  VALOR_TOTAL_CONTRATO: "Valor total contrato",
  VALOR_MENSUAL: "Valor mensual",
  VALOR_TOTAL_PAGADO:"Valor total pagado",
  VALOR_RESTANTE:"Valor restante",
  PORCENTAJE_PAGADO:"Porcentaje pagado",
  PORCENTAJE_RESTANTE:"Porcentaje restante",
  GRAFICO_BARRAS_CONTRATO:"Grafico de barras del contrato",
  CARGO:"Cargo",
  NUMERO_COMPROMISO:"No compromiso" ,
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  NECESIDADES: "Needs",
  NECESIDAD: "Need",
  BTN: {
    VER: "See",
    SELECCIONAR: "Choose",
    CANCELAR: "Cancel",
    CONFIRMAR: "Confirm",
    AGREGAR: "Add",
    REGISTRAR: "Register",
    SOLICITAR_RP:"RP request",
    QUITAR_RUBRO: "Delete",
    VER_SEGUIMIENTO_FINANCIERO:"See financial monitoring"
  },
  //SOLICITUD RP
  ERROR: "Error",
  SALIR:"Exit",
  VOLVER_CONTRATOS: "Back to contracts",
  NUMERO_SOLICITUD:"Request number",
  INSERCION_RP:"The budget register request was insert correctly with the following data:",
  VIGENCIA_SOLICITUD: "Request validity",
  FECHA_SOLICITUD: "Request date",
  NUMERO_CONTRATO: "Contract number",
  RESPONSABLE_DOCUMENTO: "Person responsible identification",
  SELECCIONE_UNA_VIGENCIA:"Choose a diferente validity",
  RESPONSABLE: "Person responsible",
  DATOS_APROPIACIONES: "Appropiation data",
  MODALIDAD_SELECCION: "Selection method",
  CONTRATO: "Contract",
  VIGENCIA_CONTRATO: "Contract validity",
  FUENTE:"Source",
  SOLICITUD_PERSONAS:"Contracts for budget registers",
  VIGENCIA_ACTUAL:"Current validity",
  VIGENCIA_SELECCIONADA:"Chosen validity",
  SELECCION_CDP:"CDP choise",
  UNIDAD_EJECUTORA:"Performer unity",
  ESTADO:"State",
  SELECCION_COMPROMISO:"Agreement choose",
  SOLICITUD_RP: "Budget register request",
  DATOS_RP:"Buget register data",
  BENEFICIARIO:"Beneficiary",
  NOMBRE_CONTRATISTA: "Name",
  DOCUMENTO_CONTRATISTA: "Identification",
  NOMBRE: "Name",
  CONTRATO: "Contract",
  FUENTE_FINANCIAMIENTO: "Funding source",
  VALOR: "Value",
  COMPROMISO: "Agreement",
  NUMERO:"Number",
  VIGENCIA:"Validity",
  COMPROMISO_TIPO:"Tipe",
  VALOR_RP:"Budget register value",
  SALDO_AP:"Appropiation reminder",
  CDP:"CDP",
  CODIGO: "Code",
  CONSECUTIVO:"Consecutive",
  OBJETIVO:"Objective",
  OBJETO:"Object",
  ORDENADOR:"Authorizer",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Financial monitoring of the contract",
  DATOS_CONTRATO:"Contract data",
  ORDENES_PAGO: "Pay orders",
  ESTADISTICAS : "Statistics",
  DATOS_FINANCIEROS_CONTRATO: "Financial data of the contract",
  DATOS_CONTRATISTA: "Contractor data",
  APELLIDOS: "Surnames",
  NOMBRES: "Names",
  TIPO_DOCUMENTO: "Identification type",
  NUMERO_DOCUMENTO : "Document number",
  FECHA_INICIO:"Start date",
  FECHA_FIN:"End date",
  DATOS_REGISTRO_PRESUPUESTAL:"Budget register data",
  NUMERO_REGISTRO_PRESUPUESTAL: "Budget register number",
  NOMBRE_REGISTRO_PRESUPUESTAL: "Budget register name",
  NUMERO_DISPONIBILIDAD: "Availability number",
  NOMBRE_DISPONIBILIDAD: "Availability name",
  ORDEN_PAGO: "Pay order",
  FECHA_ORDEN: "Order date",
  VALOR_BRUTO: "Gross value",
  LINEA_ORDEN_PAGO:"Pay orders timeline",
  ESTADISTICAS_GENERALES: "General statistics",
  VALOR_TOTAL_CONTRATO: "Contract total value",
  VALOR_MENSUAL: "Monthly value",
  VALOR_TOTAL_PAGADO:"Paid total value",
  VALOR_RESTANTE:"Remaining value",
  PORCENTAJE_PAGADO:"Paid percentage",
  PORCENTAJE_RESTANTE:"Remaining percentage",
  GRAFICO_BARRAS_CONTRATO:"Contract bar graph",
  CARGO:"Post",
  NUMERO_COMPROMISO:"Compromise number" ,
};

angular.module('contractualClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
