var $ = require('jquery');
var moment = require('moment');

function updateTimes() {
  var hoy = moment();
  $('.article time.date').each(function(){      
      var fecha = moment($(this).attr("datetime"));
      var segundos = hoy.diff(fecha, 'seconds');
      var res;
      if(segundos < 60)
      {
          res = Math.round(segundos) + ' segundos';
      }else if(segundos < 3600)
      {
          res = Math.round(segundos / 60) + ' minutos';
      }else if(segundos < 3600 * 24)
      {
          res = Math.round(segundos / 60 / 60) + ' horas'
      }else if(segundos < 3600 * 24 *7)
      {
          res = moment(fecha).format('dddd');
          
      }else{
          res = fecha.format("DD/MM/YYYY HH:mm:ss");
      }

      $(this).text(          
         res
      );

  });
};

$(document).ready(function(){
    updateTimes();
    setInterval(updateTimes, 1000);
});