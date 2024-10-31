jQuery(function () {
  if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
  if (window.ifaddtocalendar == undefined) { window.ifaddtocalendar = 1;
    var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
    s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
    s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
    var h = d[g]('body')[0];h.appendChild(s); 
  }
});
  function fetchEvent(user_index, index) {
    //console.log(showlinkedin[user_index]);
    newjson = json[user_index];
        event = newjson[index];
        console.log(newjson);
        var div = document.createElement('div');
        var divshare = document.createElement('divshare');
        var detailsDiv = document.getElementById('event-details');
        var shareDiv = document.getElementById('share-social');
        
        var loc = { lat: event.venue.lat, lng: event.venue.lon };
        
        var eDes = "<div class=\"event-title\">" + event.title + "</div>"
          "<div  class='event-date'>" + tempRenderEventDate(event) + 
          "</div><div class='row'><p id='date'></div>";
          
        var addToCalendarButton = "<button type=\"button\" class=\"event-btn\"><a href=\"http://calendar.google.com/calendar/event?" +
          "action=TEMPLATE" +
          "&text=" + event.title +
          "&dates=" + (new Date(event.startDate)).toISOString().replace(/-|:|\.\d\d\d/g,"") + "/" + (new Date(event.endDate)).toISOString().replace(/-|:|\.\d\d\d/g,"") +
          "&location=" + event.venue.title + ", " + event.venue.address + ", " + event.venue.city +
          "&ctz=America/New_York\" " +
          "target=\"_blank\" rel=\"nofollow\">Add to Calendar</a></button>";

        var eLoc = "<div class='event-place'>" + event.venue.title + ", " +
        event.venue.address + ", " + event.venue.city + "</div>";

        var dirButton = "<button type=\"button\" class=\"event-btn\"><a href=\"https://maps.google.com/?q="+loc.lat+","+loc.lng+"&amp;key=AIzaSyAZl-cqNJCePpOCKKzIyVNKC06lHiKqv98\"" + "target=\"_blank\" rel=\"nofollow\">Directions</a></button>";

        var moreButton = "<button type=\"button\" class=\"more-btn\"><a href=\"" + event.website + "\" " + "target=\"_blank\" rel=\"nofollow\">More Info</a></button>";
	if (event.website == null) {
		moreButton = "";
	}
        var newCalendarButton = "<span class=\"addtocalendar atc-style-blue event-btn\"> <a class=\"atcb-link\">Add to Calendar</a><var class=\"atc_event\"> <var class=\"atc_date_start\">"+event.startDate+"</var> <var class=\"atc_date_end\">"+event.endDate+"</var> <var class=\"atc_title\">"+event.title+"</var> <var class=\"atc_location\">"+event.venue.title+"</var> <var class=\"atc_timezone\">America/New_York</var> </var></span>";

        //var sharesocialfacebook = "<div class=\"share_socials\">" +"<a href=\'#'\ onclick="window.open(\"http://www.facebook.com/sharer.php?u=\http://fontawesome.io/icon/facebook/\&amp;t="+ event.title +" \); \"><button type=\"button\" class=\"btn btn-primary share-btn\">Share</button></a>" + "</div>";
       	if(showfacebook[user_index] == 1){

        var sharesocialfacebook = '<a target="popup" href="#" onclick="window.open(\'http://www.facebook.com/sharer.php?u=' + 'http://planaby.com/event/' + event.id + '.html' + '\&amp;t='+ event.title +'\',\'popup\',\'width=600,height=350\'); return false;"><i class="fa fa-facebook" aria-hidden="true"></i></a>';
       	}else{
          var sharesocialfacebook = '';
        }

        
        if(showtwitter[user_index] == 1){
       		
        var sharesocialtwitter = '<a target="popup" href="#" onclick="window.open(\'http://twitter.com/home/?status='+ event.title +' - ' + 'http://planaby.com/event/' + event.id + '.html' + '\', \'popup\',\'width=600,height=350\'); return false;"><i class="fa fa-twitter" aria-hidden="true"></i></a>';
       	}else{
          var sharesocialtwitter = '';
        }


        if(showlinkedin[user_index] == 1){
        var sharesociallinkedin = '<a target="popup" href="#" onclick="window.open(\'http://www.linkedin.com/shareArticle?mini=true&amp;title='+ event.title +' &amp;url=http://planaby.com/event/' + event.id + '.html' + '\', \'popup\',\'width=600,height=350\'); return false;"><i class="fa fa-linkedin" aria-hidden="true"></i></a>';
       		
       	}else{
          var sharesociallinkedin = ''
        }

        div.innerHTML = eDes + newCalendarButton + moreButton + dirButton + eLoc;
        detailsDiv.innerHTML = "";
        detailsDiv.appendChild(div);

        divshare.innerHTML = sharesocialfacebook + sharesocialtwitter + sharesociallinkedin;
         shareDiv.innerHTML = "";
          shareDiv.appendChild(divshare);

        addtocalendar.load();
        
        jQuery("#eventModal").modal();
        
        // Clear old markers
        initMap();
        
        var marker = new google.maps.Marker({
          position: loc,
          map: map
        });

        
        map.setCenter(loc);
        map.setZoom(15);
        
      }
      
      
      function initMap() {
        var loc = {lat: 41.850033, lng: -87.6500523};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: loc
        });
      }

      function preRender (planbyRes, fn) {
          var a = planbyRes
              .map( function( x ){
                  x.sqrUrl = "https://api.foursquare.com/v2/venues/"
                      + x.venue.href
                      + "/photos?client_id="
                      + "3VP3I5GBBN2QYD3BOYR51TP23Y3AKLXZVJD0V5I3BDTB5F1Y" 
                      + "&client_secret=" 
                      + "K0O3U1CXVASLSIZZKG4OPQK4J5OJR3AM1LVYOKIVQXRTCYZF" 
                      + "&v=20160731";
                  return x
              })
              .map( function (x, index, a) {
                  jQuery.ajax({
                      type: "GET",
                      url: x.sqrUrl,
                      dataType: 'json',
                      success: function(result){
                          x.imgsPath = result.response.photos.items.map(function(i){
                              return i.prefix + '640x640' + i.suffix
                          })
                          fn(x, index, a.length);
                      },
                      error: function(whatever){}
                  })
                  return 'whatever';
              });
      }


      function renderPage(result) {
          result.map(function(event){
              renderTotalEvent(event);
              jQuery('#bodyarea').append(jQuery('.hidden').html());     
          }); 
      }

      function renderTotalEvent(value) {
          //console.log(value);
          renderevent-div(value);
          renderEventPhotos(value);
      }

      function renderEventPhotos(result) {
          if(result.imgsPath.length === 0){
              jQuery('#bigImg').attr('src', src = null);
              jQuery('#img0').attr('src', src = null);
              jQuery('#img1').attr('src', src = null);
              jQuery('#img2').attr('src', src = null);
              jQuery('#img3').attr('src', src = null);
              jQuery('#img4').attr('src', src = null);
          }else{
              jQuery('#bigImg').attr('src', src = result.imgsPath[0]);
              jQuery('#img0').attr('src', src = result.imgsPath[1]);
              jQuery('#img1').attr('src', src = result.imgsPath[2]);
              jQuery('#img2').attr('src', src = result.imgsPath[3]);
              jQuery('#img3').attr('src', src = result.imgsPath[4]);
              jQuery('#img4').attr('src', src = result.imgsPath[5]);
              
          }
          
          jQuery('#postlink').attr('href', href= '/event/' + result.id);
      }

      var todaySpent = false;
      var tomorrowSpent = false;
      var weekendSpent = false;
      var nextWeekendSpent = false;

      function renderEventDetails(value) {
          jQuery('#detailLink').data('eventID', value.id);
          jQuery('#title').html(value.title);
          jQuery('#daymark').html("");

          if (isToday(value.startDate) && !todaySpent){
          	jQuery('#daymark').html("Today");
          	todaySpent = true;
          }
          else if (isTomorrow(value.startDate) && !tomorrowSpent){
          	jQuery('#daymark').html("Tomorrow");
          	tomorrowSpent = true;
          }
          else if (isThisWeekend(value.startDate) && !weekendSpent){
          	jQuery('#daymark').html("This Weekend");
          	weekendSpent = true;
          }
          else if (isNextWeekend(value.startDate) && !nextWeekendSpent){
              jQuery('#daymark').html("Next Weekend");
              nextWeekendSpent = true;
          }
          //jQuery('#daymark').html(dateDiffInDays(value.startDate)); //FOR TESTING
          var addy = "";
          if (value.venue && value.venue.address) {
              addy = ' ' + value.venue.address;
              jQuery('#address').html('<strong>' + value.venue.title + addy + '</strong>');
          jQuery("a.addressLink").attr("href", "https://www.google.com/maps/dir/+/"+ value.venue.title + addy +"/");
          }

          


          renderEventDate(value);
          jQuery('#status').html(justTime(value.startDate, value.endDate));
      }



      function renderEventDate(value) {
           
          //dateDiffInDays(value.startDate);
           
          if (isOver(value)){
              jQuery('#date').html("Ended :-(").css({
                  "color": "red"
              });
          }
          else if (isToday(value.startDate)) {

              if(isOngoing(value)){
                  jQuery('#date').html("Now until ").append(endTime(value.endDate)).css({
                      "color": "green"
                  });
               }else{/////////////its happening later today///////////

                  if(isTonight(value)){
                      jQuery('#date').html("Tonight").css({
                      "color": "green"
                      }).append(" ").append(justTime(value.startDate, value.endDate));
                  }
                  else{
                      jQuery('#date').html("Today").css({
                      "color": "green"
                      }).append(" ").append(justTime(value.startDate, value.endDate));
                  }
                  
              }

          } 
          else if (isTomorrow(value.startDate)) {
              jQuery('#date').html("Tomorrow  ").css({
                  "color": "gray"
              }).append(justTime(value.startDate, value.endDate));
          }
          else if (isLessThanOneWeek(value.startDate)) {   /////////////Within the week but not today or tommrow///////////
              var dayOfWeek = getDayName(value.startDate);
              jQuery('#date').html(dayOfWeek + " " + justTime(value.startDate, value.endDate)).css({
                  "color": "gray"
              });
          }
          else if (MoreThanOrEqualToOneWeekLessThanTwoWeeks(value.startDate)){ //LongestFunctionNameEver!
              var dayOfWeek = getDayName(value.startDate);
              jQuery('#date').html("Next " + dayOfWeek + " " + justTime(value.startDate, value.endDate)).css({
                  "color": "gray"
              });
          }
          else if (InLessThanSixMonth(value.startDate)){ /////////////More than a week but within the next month///////////
              var dayOfWeek = getDayName(value.startDate);
              jQuery('#date').html(dayOfWeek + ", " +OneDay(value.startDate)+" at "+ justTime(value.startDate, value.endDate)).css({
                  "color": "black"
              });
          }
          else {                                       /////////////More than a month///////////
              //This still needs to be done
              var dayOfWeek = getDayName(value.startDate);
              jQuery('#date').html(dayOfWeek + ", " + OneDay(value.startDate) + ", " + justYear(value.startDate) + ", at "+ justTime(value.startDate, value.endDate)).css({
                  "color": "black"
              });
          }


      }

      function tempRenderEventDate(value){
          
          if (isOver(value)){
              return "ended";
          }
          else if (isToday(value.startDate)) {

              if(isOngoing(value)){
                  return ("Now until ") + (endTime(value.endDate));
               }else{/////////////its happening later today///////////

                  if(isTonight(value)){
                      return ("Tonight ") + (justTime(value.startDate, value.endDate));
                  }
                  else{
                      return ("Today ") + (justTime(value.startDate, value.endDate));
                  }
                  
              }

          } 
          else if (isTomorrow(value.startDate)) {
              return ("Tomorrow ") + justTime(value.startDate, value.endDate);
          }
          else if (isLessThanOneWeek(value.startDate)) {   /////////////Within the week but not today or tommrow///////////
              var dayOfWeek = getDayName(value.startDate);
              return (dayOfWeek + " " + justTime(value.startDate, value.endDate))
          }
          else if (MoreThanOrEqualToOneWeekLessThanTwoWeeks(value.startDate)){ //LongestFunctionNameEver!
              var dayOfWeek = getDayName(value.startDate);
              return ("Next " + dayOfWeek + " " + justTime(value.startDate, value.endDate));
          }
          else if (InLessThanSixMonth(value.startDate)){ /////////////More than a week but within the next month///////////
              var dayOfWeek = getDayName(value.startDate);
              return (dayOfWeek + ", " +OneDay(value.startDate)+" at "+ justTime(value.startDate, value.endDate));
          }
          else {                                       /////////////More than a month///////////
              //This still needs to be done
              var dayOfWeek = getDayName(value.startDate);
              return (dayOfWeek + ", " + OneDay(value.startDate) + ", " + justYear(value.startDate) + ", at "+ justTime(value.startDate, value.endDate));
          }
      }
      //Function to check if its an all day event
      function isAllDayEvent(result) {
        return result.allDay;
      }

      //Function to check if event is over
      function isOverEvent(result) {
        var eventEndDate = new Date(result.endDate);
        var todaysDate = new Date();
        return eventEndDate < todaysDate;
      }

      //Function to check if event is ongoiong
      function isOngoing(result){
        var todaysDate = Date.parse(new Date(), "yyyy-MM-dd");
        var eventStartDate = Date.parse(result.startDate, "yyyy-MM-dd");
        var eventEndDate = Date.parse(result.endDate, "yyyy-MM-dd");
        return eventStartDate <= todaysDate && eventEndDate >= todaysDate;
      }

      function isOver(result){
        var todaysDate = Date.parse(new Date(), "yyyy-MM-dd");
        var eventStartDate = Date.parse(result.startDate, "yyyy-MM-dd");
        var eventEndDate = Date.parse(result.endDate, "yyyy-MM-dd");
        var eventEndTime = 0;
        var nowTime = 0;
        return  (eventEndDate < todaysDate) || (eventEndDate === todaysDate && (eventEndTime<nowTime));
      }

      function OneDayEvent(result) {
          if (result.startDate == result.endDate) {
              return true;
          }
          return false;
      }

      //Function to get event date
      function getDate(date){
        var d = new Date(date);
        return d.toLocaleDateString();
      }
      //prettify date
      function writeDate(resultDate) {
          var date = new Date(resultDate);
          var month = getMonthName(date);
          var dayOfMonth = date.getDate();
          var full = month + ' ' + dayOfMonth;
          full += writeYear(date);
          return full;
      }
      //if event is in a year or more, specify year
      function writeYear(date) {
          var today = new Date();
          var yearString = '';
          var year = new Date();
          year.setMonth(year.getMonth() + 11);
          console.log('in a year:  ' + year);
          if (date >= year) {
              var year = date.getFullYear();
              yearString += ', ' + year;
          }
          return yearString;
      }
      function getTime(date){
        var t = new Date(date);
        return t.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      }
      function getMonthName(date){
        var d = new Date(date);
        var month = new Array();
        month[0] = "Jan.";
        month[1] = "Feb.";
        month[2] = "Mar.";
        month[3] = "Apr.";
        month[4] = "May";
        month[5] = "Jun.";
        month[6] = "Jul.";
        month[7] = "Aug.";
        month[8] = "Sep.";
        month[9] = "Oct.";
        month[10] = "Nov.";
        month[11] = "Dec.";
        return month[d.getMonth()];
      }
      function getDayName(date){
        var d = new Date(date);
        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[d.getDay()];
      }

      function TodayIsFriday(){
        var today = new Date();
        var todaysName = getDayName(today);
        return (todaysName==="Friday");
      }
      function TodayIsSaturday(){
        var today = new Date();
        var todaysName = getDayName(today);
        return (todaysName==="Saturday");
      }
      function TodayIsSunday(){
        var today = new Date();
        var todaysName = getDayName(today);
        return (todaysName==="Sunday");
      }

      function TodayIsAWeekend(){
        return (TodayIsSaturday()||TodayIsSunday()||TodayIsFriday());
      }
      function TodayIsAWeekday(){
        return !(TodayIsAWeekend());
      }

      function EventIsOnAFriday(date){
        var eventDay = new Date(date);
        var eventDayName = getDayName(eventDay);
        return (eventDayName==="Friday");
      }
      function EventIsOnASaturday(date){
        var eventDay = new Date(date);
        var eventDayName = getDayName(eventDay);
        return (eventDayName==="Saturday");
      }
      function EventIsOnASunday(date){
        var eventDay = new Date(date);
        var eventDayName = getDayName(eventDay);
        return (eventDayName==="Sunday");
      }

      function EventIsOnAWeekend(date){
        return (EventIsOnASaturday(date)||EventIsOnASunday(date)||EventIsOnAFriday(date));
      }
      function EventIsOnAWeekday(date){
        return !(EventIsOnAWeekend());
      }

      var _MS_PER_DAY = 1000 * 60 * 60 * 24;
      function dateDiffInDays(date) {
        var a = new Date();
        var b = new Date(date);
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        //alert(Math.floor((utc2 - utc1) / _MS_PER_DAY));
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
      }
      function InFiveDaysOrLess(date) {
        if (dateDiffInDays(date) <= 4) {
          return true;
        }
        return false;
      }
      function isLessThanOneWeek(date) { 
        if (dateDiffInDays(date) < 7) {
          return true;
        }
        return false;
      }
      function MoreThanOrEqualToOneWeekLessThanTwoWeeks(date){  
        if (dateDiffInDays(date) < 14 && dateDiffInDays(date) >= 5 ) {
          return true;
        }
        return false;
      }
      function InLessThanSixMonth(date){
        if (dateDiffInDays(date) < 180) {
          return true;
        }
        return false;
      }

      //Function to check if event is today
      function isToday(date) {
        var todaysDate = new Date();
        var eventDate = new Date(date);
        todaysDate = todaysDate.toLocaleDateString();
        eventDate = eventDate.toLocaleDateString();
        return eventDate === todaysDate;
      }
      //Function to check if event is tonight
      function isTonight(result){
          var eventDate = new Date(result.startDate);
          var hour = eventDate.getHours();
          return hour >= 18;
      }
      //Function to check if event is tomorrow
      function isTomorrow(date) {
        var todaysDate = new Date();
        var tomorrowsDate = new Date();
        tomorrowsDate.setDate(todaysDate.getDate() + 1);
        var eventDate = new Date(date);
        eventDate = eventDate.toLocaleDateString();
        tomorrowsDate = tomorrowsDate.toLocaleDateString();
        return eventDate === tomorrowsDate ;
      }

      //Function to check if event is this weekend
      function isThisWeekend(date) {
        return EventIsOnAWeekend(date) && InFiveDaysOrLess(date) && TodayIsAWeekday();
      }

      //Function to check if event is this weekend
      function isNextWeekend(date) {
        return EventIsOnAWeekend(date)  &&  MoreThanOrEqualToOneWeekLessThanTwoWeeks(date);
      }

      function getFakeTestResults(result){

        var today =  new Date();

        jQuery.each(result, function(key, value) {
              alert(value.startDate);

        });

        return result;

      }

      //Function to return start and end time of event 
      function justTime(startDate, endDate){
      	var start = getTime(startDate).replace(" EDT", "").replace("12:00 PM","Noon").replace("12:00 AM","Midnight").replace(":00","");
      	var end = getTime(endDate).replace(" EDT", "").replace("12:00 PM","Noon").replace("12:00 AM","Midnight").replace(":00","");
      	return start + " to " + end;
      }

      function endTime(endDate){
      	var end = getTime(endDate).replace(" EDT", "").replace("12:00 PM","Noon").replace("12:00 AM","Midnight").replace(":00","");
      	return end;
      }

      //Function to return start and end date of event
      function justDate(startDate, endDate){
      	//var start = getDate(startDate);
          //var end = getDate(endDate);
          var start = writeDate(startDate);
          var end = writeDate(endDate);
      	return start + " - " + end;
      }

      function OneDay(startDate) {
          var start = writeDate(startDate);
          return start;
      }

      function justYear(startDate) {
      	var d = new Date(startDate);
          var start = d.getFullYear();
          //alert(start);
          return start;

      }

      jQuery(document).ready(function() {
            jQuery(location).attr('href');
            window.durl = window.location.pathname;
            
        });