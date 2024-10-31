jQuery(document).ready(function($){
    function formatTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ampm;
        return strTime;
    }

    $month = [];
	$month[0]="Jan";
	$month[1]="Feb";
	$month[2]="Mar";
	$month[3]="Apr";
	$month[4]="May";
	$month[5]="Jun";
	$month[6]="Jul";
	$month[7]="Aug";
	$month[8]="Sep";
	$month[9]="Oct";
	$month[10]="Nov";
	$month[11]="Dec";
    window.json = new Array();
    window.showfacebook = new Array();
    window.showtwitter = new Array();
    window.showlinkedin = new Array();
    $('.planaby_widget').each(function(i){
        var widget = $(this);
        var lengthi = i;
        var account = widget.find('.planaby-account').val();
        var numPlans = widget.find('.planaby-num_plans').val();
        var showAddress = widget.find('.planaby-show_address').val();
        var showCity = widget.find('.planaby-show_city').val();
        var showVenueName = widget.find('.planaby-show_venue_name').val();
        var showDateTime = widget.find('.planaby-show_dateTime').val();
        var showPlanTitle = widget.find('.planaby-show_planTitle').val();
        showfacebook[lengthi] = widget.find('.planaby-include_facebook').val();
        showtwitter[lengthi] = widget.find('.planaby-include_twitter').val();
        showlinkedin[lengthi] = widget.find('.planaby-include_linkedin').val();
        var event_popup = widget.find('.planaby-event_popup').val();
        /*console.log(showfacebook);
        console.log(showtwitter);
        console.log(showlinkedin);*/
        var showThumbnails = widget.find('.planaby-thumbnails').val();
        window.url = 'https://ec.planaby.com/woman/ra/Person/queryUsers.json?searchString=' + account;
       
        $.ajax({
            type: 'GET',
            cache: false,
            url: 'https://ec.planaby.com/woman/ra/Person/queryUsers.json?searchString=' + account,
            success: function (data) {

                var authorID = data[0].id;
                var imageID = data[0].posterId;
                $.ajax({
                    type: 'GET',
                    url: 'https://ec.planaby.com/woman/ra/Person/' + authorID + '/upcoming.json',
                    success: function (data) {
                        
                       
                        json[lengthi] = data;
                        var maxPlans = 0;
                        if (data.length < numPlans) {
                            maxPlans = data.length;
                        } else {
                            maxPlans = numPlans;
                        }
                        
                        if (data.length == 0){
                        	//no plans returned
                        	widget.find('.plan-list').append("<li>No upcoming events</li>");                      	
                        }else{
	                        for (var i = 0; i < maxPlans; i++) {
                                if (event_popup == 1) {
                                  
                                    var plan = $("<li class='clickable' onclick='fetchEvent(" + lengthi + ',' + i + ")'></li>");
                                }else{
	                               var plan = $("<li></li>");
                                }
	                            var title = data[i].title;
	                            if (title && showPlanTitle == 1) {
	                                plan.append("<div class='planaby-title'>" + title + "</div>");
	                            }


	                            if (data[i].startDate !== undefined && data[i].startDate !== null && showDateTime == 1) {                                
	                                
                                    var now = new Date();
                                    var nowDay = now.getDate();
                                    var nowMonth = $month[now.getUTCMonth()];
                                    var nowYear = now.getUTCFullYear();

                                    var startDate = new Date(data[i].startDate);
                                    var time = formatTime(startDate);
                                    var day = startDate.getDate();
                                    var month = $month[startDate.getUTCMonth()];
                                    var year = startDate.getUTCFullYear();

                                    var date = null;
                                    if (nowMonth == month && nowDay == day){
                                        date = "Today";
                                    }else{
                                        date = day + " " + month;
                                    }

                                    var formattedDateTime = time + ' - ' + date;
                                    
                                    if (data[i].startDate !== data[i].endDate){
                                        var endDate = new Date(data[i].endDate);
                                        var endTime = formatTime(endDate);
                                        var endDay = endDate.getDate();
                                        var endMonth = $month[endDate.getUTCMonth()];
                                        var endYear = endDate.getUTCFullYear();

                                        var startingDay = null;
                                        var endingDay = null;
                                        if (nowMonth == month && nowDay == day){
                                            startingDay = "Today";
                                        }else{
                                            startingDay = day + " " + month;
                                        }
                                        if (nowMonth == endMonth && nowDay == endDay){
                                            endingDay = "Today";
                                        }else{
                                            endingDay = endDay + " " + endMonth;
                                        }     

                                        //formattedDateTime = time + ' - ' + startingDay + ", " + endTime + ' - ' + endingDay;                                  
                                        formattedDateTime = startingDay + ' ' + time + " - " + endTime;                                  
                                    }
	                                plan.append("<div class='planaby-startDate'>" + formattedDateTime + "</div>");
	                            }
	                            var venue = data[i].venue.title;
	                            if (venue && showVenueName == 1) {
	                                plan.append("<div class='planaby-venue'>" + venue + "</div>");
	                            }
	                            var address = data[i].venue.address
	                            if (address && showAddress == 1) {
	                                plan.append("<div class='planaby-address'>" + address + "</div>");
	                            }
	                            var city = data[i].venue.city;
	                            if (city && showCity == 1) {
	                                plan.append("<div class='planaby-city'>" + city + "</div>");
	                            }

	                            widget.find('.plan-list').append(plan);
	                        }

                        }
                        if (showThumbnails == 1){
                    		var image = $("<img class='planaby-thumb'/>");
                    		image.error(function() {
                        		$(this).attr("src", "https://s3.amazonaws.com/mtly/nouser-200.png");
						    });
                        	if (imageID !== null){
                        		thumbSRC = "https://s3.amazonaws.com/mtly/" + imageID + "-200.png";
                        		image.attr('src',thumbSRC);         			               			
                        	}else{
                        		image.attr("src", "https://s3.amazonaws.com/mtly/nouser-200.png");
                        	} 
                        	widget.find('.plan-list').before(image);  					     
                        }
                    },
                    error : function(){
                    	widget.find('.plan-list').append("<li>Oops! No plans found.</li>");
                    	return true;  	
                    }
                });
            },
            error: function (data) {
            	widget.find('.plan-list').append("<li>Oops! No plans found.</li>");  
            }

        });

    });
});

