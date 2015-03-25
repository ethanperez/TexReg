
// jQuery function to strip search string of args
// Courtesy of http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

// Get the department param, check 'em
var dept = $.urlParam('fos_fl');

// Stubborn 2 letter departments
if (dept.length == 1) {
  dept = dept + "++";
}

// Figure out what the course number is
// 
// Condition 1: the course number starts after
// either the second or third space
// 
// Condtiion 2: the course number, even it has a 
// letter at the end, can be identifed as a block,
// i.e., there are no spaces
// 
// Algo: check the 1st index from split: if number,
// proceed, else, take block 2. (This is because 
// of the two lettered depts i.e., CS == C S)

$("td.course_header h2").each(function() {
  // Get the OG text
  var ogText = $(this).text();
  // Parse it for the course number
  var spacedOgText = ogText.split(/\s+/)

  // Now, check to see where the c# starts
  var courseNumber;
  if (isNaN(spacedOgText[1].charAt(0)) == false) {
    courseNumber = spacedOgText[1];
  } else {
    courseNumber = spacedOgText[2];
  }

  // Set the link
  $(this).append('<a href="https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department=' + dept + '&course_number=' + courseNumber + '&course_title=&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search" target="_blank">View Syllabi and CVs</a>');
});