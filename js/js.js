
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

if (dept.length == 1) {
  dept = dept + "++";
}

console.log(dept);
// Take out the department name from the url
// Craft the url take to the new tab
// Peace y'all 
