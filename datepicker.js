(function () {
  var datepicker = {}
  var monthDate;
  function format(date) {
    ret = '';
    var padding = function (num) {
      if (num<=9) {
        return '0'+num;
      }
      return num;
    }
    ret += date.getFullYear() + '-';
    ret += padding(date.getMonth() + 1) + '-';
    ret += padding(date.getDate());
    return ret;
  }
  var $wrapper = document.querySelector('ui-datepicker-warpper');
  datepicker.getMonthDate = function (year, month) {
    var ret = [];
    if(!year || !month){
      var today = new Date();
      year = today.getFullYear();
      month = today.getMonth() + 1;
    }
    var fristDay = new Date(year, month-1, 1);
    var fristWeekDay = fristDay.getDay();
    if (fristWeekDay === 0) {
      fristWeekDay = 7;
    }
    year = fristDay.getFullYear();
    month = fristDay.getMonth() + 1;
    var lastDayOfLastMonth = new Date(year, month - 1, 0);
    var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

    var preMonthDayCount = fristWeekDay - 1;

    var lastDay = new Date(year, month, 0);
    var lastDate = lastDay.getDate();

    for (var i = 0; i < 7*6; i++) {
      var date = i + 1 - preMonthDayCount;
      var showDate = date;
      var thisMonth = month;
      var except;
      //上一月
      if (date<=0) {
        thisMonth = month - 1;
        showDate = lastDateOfLastMonth + date;
      }else if (date>lastDate) {
        thisMonth = month + 1;
        showDate = showDate - lastDate;
      }

      if (thisMonth === 0) {
        thisMonth = 12;
      }
      if (thisMonth === 13) {
        thisMonth = 1
      }

      ret.push({
        month:thisMonth,
        date:date,
        showDate:showDate,
        except:except
      })
    }

    return {year:year, month:month, days:ret };
  }

  datepicker.buildUi = function (year, month) {
    monthDate = datepicker.getMonthDate(year, month);
    console.log(monthDate);
    var html ='<div class="ui-datepicker-header">'+
      '<a class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a> '+
      '<a class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a> '+
      '<span class="ui-datepicker-curr-month">'+ monthDate.year +'-'+ monthDate.month +'</span> '+
      '</div> '+
      '<div class="ui-datepicker-body"> '+
      '<table> '+
      '<thead> '+
      '<tr> '+
      '<th>一</th> '+
      '<th>二</th> '+
      '<th>三</th> '+
      '<th>四</th> '+
      '<th>五</th> '+
      '<th>六</th> '+
      '<th>日</th，l> '+
      '</tr> '+
      '</thead> '+
      '<tbody> '
      for (var i = 0; i < monthDate.days.length; i++) {
        var date = monthDate.days[i];
        if (i%7 === 0) {
        html += '<tr>'
        }
        html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
        if (i%7 === 6) {
        html += '</tr>'
        }
      }
      html += '</tbody>' +
      '</table> '+
      '</div>'
    return html;
  }

  datepicker.render = function (direction) {
    var year,month;
    if (monthDate) {
      year = monthDate.year;
      month = monthDate.month;
    }
    if (direction === 'prev') {
      month--;
      if (month === 0) {
        month = 12;
        year--
      }
    };
    if (direction === 'next') month++;
    var html = datepicker.buildUi(year, month);
    if (!$wrapper) {
      $wrapper = document.createElement('div')
      document.body.appendChild($wrapper);
      $wrapper.className = 'ui-datepicker-warpper'
    }
    $wrapper.innerHTML = html;
  };

  datepicker.init = function ($input) {
    datepicker.render()
    var $input = document.querySelector('.datepicker');
    var isOpen = false;

    $input.addEventListener('click', function(e) {
      if (isOpen) {
        $wrapper.classList.remove('ui-datepicker-warpper-show')
        isOpen = false
      }else {
        $wrapper.classList.add('ui-datepicker-warpper-show')
        var left   = $input.offsetLeft,
            top    = $input.offsetTop,
            height = $input.offsetHeight;
        $wrapper.style.top = top + height + 2 + 'px'
        $wrapper.style.left = left + 'px'
        isOpen = true
      }
    });

    $wrapper.addEventListener('click', function(e) {
      var $target = e.target;
      if (!$target.classList.contains('ui-datepicker-btn')){
        return;
      }
      if ($target.classList.contains('ui-datepicker-prev-btn')) {
        datepicker.render("prev");
      }else {
        datepicker.render("next");
      }
    });

    $wrapper.addEventListener('click', function(e) {
      var $target = e.target;
      if ($target.tagName.toLowerCase() !== 'td') return;
      var date = new Date(monthDate.year, monthDate.month - 1, $target.dataset.date);
      $input.value = format(date);
      $wrapper.classList.remove('ui-datepicker-warpper-show')
      isOpen = false
    });

  }

  window.datepicker = datepicker;
})();
