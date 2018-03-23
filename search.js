 var srvLiveState = false; // <-----------  TURN SERVER LIVE STATE ON/OFF = true/false.    Added by THAN 20-01-2017
 var url = window.location.href;
 var srvLiveState = ((url.indexOf('localhost:8080') === -1) &&  (url.indexOf('127.0.0.1:8080') === -1)) ? true : false;


 console.log('##############################################################\n' +
     '\n' +
     '               search.js er: ' + ((srvLiveState) ? 'LIVE!' : 'OFF LINE!') + '\n' +
     '\n' +
     '##############################################################');


 var active_tn;

 $(document).ready(function() {

     build_topmenu();
     //build_tn_grid();

     $(".btn-search").click(function() {
         perform_search();
     });

     $(".closeinput").click(function() {
         $(".search_textfield").val("");
     });

     $(".btn-fag").click(function() {
         click_fag($(this));
     });

     $(".col-md-1").hide();

     var clipboard = new Clipboard('.btn-get_link', {
         text: function() {
             UserMsgBox("body", "<div class ='content_wrapper'><h4>Du har kopieret linket</h4><p>Linket <b>" + jsonData[active_tn].meta_objUrl + "</b> er nu kopieret til din udklipsholderen.</p><br/>Du kan nu indsætte linket, der hvor du skal bruge det.</div>");
             return jsonData[active_tn].meta_objUrl;

         }
     });
     var clipboard_embed = new Clipboard('.btn-get_embed', {
         text: function() {
             var embedlink = '  <iframe height="570" width="100%" frameborder="0" src="' + jsonData[active_tn].meta_objUrl + '"> </iframe>';
             var help_moodle = '<a class="MetaDataLink" target="_blank" href="https://www.youtube.com/watch?v=0cKkCRRTC_c">Hjælp til indlejring i Moodle </a>';
             var help_fronter = '<a class="MetaDataLink" target="_blank" href="https://www.youtube.com/watch?v=kUsW0vEXeF4">Hjælp til indlejring i Fronter </a>'


             UserMsgBox("body", "<div class ='content_wrapper'><h4>Du har kopieret linket til LMS</h4><p>Indlejringskoden er nu kopieret til din udklipsholder, og du kan indsætte linket i dit LMS eller på din webside.<br/></p><br/>" + help_moodle + "<br/>" + help_fronter + "</div>");
             return embedlink;

         }
     });

     $(document).on("keypress", function(e) {
         // use e.which
         if (e.keyCode == 13) {
             perform_search();
         }
     });

     getRequestedObjectsByUrl(); // Set all visual perameters according to URL perameters and performs search. Added by THAN 06-02-2017.

     //$(".input_text").focus();

     microhint($(".thumbnail").eq(0).find("p").eq(1), "Herunder finder du en oversigt over alle de digitale materialer, der er udviklet af vucdigital.dk. Materialerne er udviklet i tæt samarbejde med fagredaktører, og kvaliteten er sikret med hjælp fra de deltagende VUCer.")
     $("body").click(function() {
         $(".microhint").fadeOut();
     })
 });


 function perform_search() {

     $(".result_container").css("height", "0px");
     $(".footer_search").hide();

     UserMsgBox("body", "<div class='search_loader'><img src='../library/img/vid_preloader.gif'><br/><br/><p><span class='src_text'>Søger læringsobjekter</span></p></div>");
     $(".CloseClass").hide();
     $(".MsgBox_bgr").off("click");
     $(".MsgBox_bgr").css("background-color", "rgba(0,0,0,0)");
     $("#UserMsgBox").css("background-color", "rgba(0,0,0,0)").css("margin-top", "10%");


     $(".container-fluid").addClass("blurred");
     //$(".tn_container").html("<div class='col-xs-3'></div><div class='col-xs-2'><img class='img-responsive' src='../library/img/vid_preloader.gif'><br/><span class='search_info'>Søger læringsobjekter</span></div></div>");

     var obj = new Object();
     var fag_Array = [];
     var search_string = $(".search_textfield").val();

     for (var i = 0; i < $(".btn-fag").length; i++) {
         if ($(".btn-fag").eq(i).hasClass("btn-primary")) {
             //fag_valgt += " " + ;
             fag_Array.push($(".btn-fag").eq(i).text());
         }
     }

     var fag_Array_string = fag_Array.join(", ");

     console.log(fag_Array_string);
     var insertpoint = fag_Array_string.lastIndexOf(",");
     console.log("IP: " + insertpoint);
     var insert = "og";

     //fag_Array_string.splice(insertpoint, " og");
     if (insertpoint > -1) {
         fag_Array_string = fag_Array_string.slice(0, insertpoint) + " og" + fag_Array_string.slice(insertpoint + 1);
     }
     console.log("FAS:" + fag_Array_string);

     // obj.sogeord = fag_Array;                 // Commented out by THAN 17-01-2017
     obj.fag = fag_Array; // Added by THAN 17-01-2017
     obj.streng = search_string;

     var jsonString = JSON.stringify(obj);
     console.log("Søgestrengen er: " + jsonString);


     //==============================================================================================================
     //                      THANs CODE:
     //==============================================================================================================

     if (srvLiveState) {

         var cc = Object.create(core_CLASS);

         successCallBack = function(result) {
             //$(".MsgBox_bgr").fadeOut(200);
             $(".MsgBox_bgr").remove();
             $(".result_container").html("");
             $(".container-fluid").removeClass("blurred");

             var json = JSON.parse(cc.ajaxUnwrap(result));
             console.log('perform_search - successCallBack - json: ' + JSON.stringify(json));

             jsonData = json;

             console.log("JDL: " + jsonData.length);

             $("#vucCarousel").hide();
             $(".eks_header").hide();

             if (jsonData.length < 1) {
                 $(".no_result_container").show();
                 $(".tn_container").show();

                 //$("#vucCarousel").show();
                 var soegefeedback = "";
                 if (search_string != "" && fag_Array.length > 0) {
                     soegefeedback += "<b>Din søgning på '" + search_string + "' i " + fag_Array_string + " gav ikke noget resultat.</b><br/><br/>";
                 } else if (search_string != "" && fag_Array.length < 1) {
                     soegefeedback += "<b>Din søgning på '" + search_string + "' gav ikke noget resultat.</b><br/><br/>";
                 } else if (search_string == "" && fag_Array.length > 0) {

                     fag_Array_string = fag_Array_string.replace("og", "eller");
                     soegefeedback += "<b>Der er ingen objekter i " + fag_Array_string + ". Prøv at vælge andre fag.</b><br/><br/>";
                 } else if (search_string == "" && fag_Array.length < 1) {
                     soegefeedback += "<b>Ingen resultat. Skriv i søgefeltet eller vælg et fag at søge i.</b><br/><br/>";
                 }
                 soegefeedback += "<p>Forslag som måske kan forbedre din søgning:</p>";
                 soegefeedback += "<ul><li>Vær sikker på, at alle ord er stavet rigtigt</li>";

                 soegefeedback += "<li>Prøv forskellige søgeord - brug synonymer</li>";
                 soegefeedback += "<li>Prøv at søge bredere - i mere generelle termer</li>";
                 soegefeedback += "<li>eller med færre ord</li></ul>";

                 //80$('.result_container').masonry('destroy');
                 $(".no_result_container").html(soegefeedback);


             } else {

                 build_tn_grid(); // Insert new objects   

                 //$(".no_result_container").hide();
                 $(".tn_container").hide();

             }



         }
         errorCallBack = function(result) {
             // alert('FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');

             console.log('searchObject: FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');
         }

         console.log('srvCall - jsonString: ' + jsonString);
         cc.srvCall('../objectSearch/index.php', { searchObject: jsonString }, successCallBack, errorCallBack, 'html'); // <-----  OK
         // cc.srvCall('../objectSearch/index.php', {searchObject: JSON.stringify({fag:["PSYKOLOGI","TYSK"], streng: 'hej med dig'}) }, successCallBack, errorCallBack, 'html');   // <-----  TEST

     } else {
         build_tn_grid();
     }

     //==============================================================================================================


     // build_tn_grid();

 }

 function click_fag(obj) {
     var indeks = obj.index(".btn-fag");
     //hent_fag(indeks);
     console.log(indeks);
     if (obj.hasClass("btn-primary")) {
         console.log("has Class")
         obj.removeClass("btn-primary");
         obj.addClass("btn-info");
     } else {
         obj.addClass("btn-primary");
         obj.removeClass("btn-info");
     }

     //console.log($(".search_textfield").val());

     perform_search();

 }

 function build_tn_grid() {



     $(".materiale_container").hide();

     console.log("build_tn_grid");

     var headerHTML = '<h2>Søgeresultater</h2>';
     if (jsonData.length < 2) {
         headerHTML += 'Din søgning gav et resultat på et undervisningsobjekt.';
     } else if (jsonData.length > 1) {
         headerHTML += 'Din søgning gav et resultat på ' + jsonData.length + ' undervisningsobjekter.';
     }
     $(".no_result_container").html(headerHTML);

     var HTML = "";

     for (var i = 0; i < jsonData.length; i++) {
         var jd = jsonData[i];
         console.log(jsonData[i].meta_imgUrl);

         console.log("I: " + i + ", " + jsonData[i].meta_imgUrl);


         // var HTML = '<div class="post-box col-sm-12 col-md-6 col-lg-4">'; //' ">';                            // Commented out by THAN 20-01-2017
         HTML += '<div id="objId_' + jd.objId + '" class="post-box col-sm-12 col-md-6 col-lg-4">'; //' ">';       // Added by THAN 20-01-2017
         HTML += '<div class="thumbnail col-xs-12">';
         HTML += '<div class="thumb_img_container col-xs-9">';
         //HTML += '';
         if (jd.meta_imgUrl != null) {
             HTML += '<a target="_blank" href="' + jd.meta_objUrl + '"><img class="img-responsive" src="' + jd.meta_imgUrl + '" alt="..."></a></div>';
         } else {
             HTML += '<a target="_blank" href="' + jd.meta_objUrl + '"></a></div>';
         }
         if (jd.meta_subject != null && jd.meta_subject.length < 3) {
             if (jd.meta_subject == "Samfundsfag") {
                 HTML += '<div class="col-xs-3 fag_label_container"><span class="label_btn btn btn-info">Samf.</span></div>';
             } else {
                 HTML += '<div class="col-xs-3 fag_label_container"><span class="label_btn btn btn-info">' + jd.meta_subject + '</span></div>';
             }
         }
         HTML += '<div class="col-xs-12">';
         HTML += '<h3>' + jd.meta_objTitel + '</h3>';

         HTML += '<div class="link_container"><div class="big_link"><span class="btn btn-lg btn-default btn-link_kat"><a id="copy_href" target="_blank" href="' + jd.meta_objUrl + '">Åbn objekt </a></span> </div><div class="small_link"><a class="btn-get_link btn-link_kat"> Hent link </a><br/> <a class="btn-get_embed btn-link_kat"> Indsæt i LMS</a> </div></div>';

         if (jd.meta_objType != null) {
             HTML += '<div class="row"></div><p><b>Objekttype: </b>';
             for (var o = 0; o < jd.meta_objType.length; o++) {
                 HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
             }
             HTML += '</p>';
         }

         if (jd.meta_studentPurpose != null) {
             HTML += '<p><b>Kursistformål: </b>  ' + jd.meta_studentPurpose + '</p>';
         }
         if (jd.meta_tags != null) {
             HTML += "<div class='col-xs-4 tag_label_container'>"
             for (var u = 0; u < jd.meta_tags.length; u++) {
                 HTML += "<span class='btn btn-info btn-sm tag_label'>#" + jd.meta_tags[u] + "</span>";
             }
         }
         HTML += "</div><div class='btn btn-primary btn_overblik'><span class='glyphicon'></span>Læs om objektet</div></div>";
         HTML += '</div> </div> </div>';

         //console.log(HTML);

         $(".footer_search").show();

     }

     $(".result_container").append(HTML);

     // $(".tag_label").click(function() {       // Commented out by THAN 20-01-2017
     //     console.log($(this).html());
     //     //click_tag($(this));
     // });

     //==============================================================================================================
     //                      THANs CODE:
     //==============================================================================================================

     $(document).on('click', ".tag_label", function(event) { // Added by THAN 20-01-2017

         if (srvLiveState) {

             var cc = Object.create(core_CLASS);

             var tag = $(this).text().replace('#', '').trim();;
             console.log('tag_label - tag 1: ' + tag);

             successCallBack = function(result) {
                 // alert('result: SUCCESS');

                 var json = JSON.parse(cc.ajaxUnwrap(result));
                 console.log('tag_label - successCallBack - json: ' + JSON.stringify(json));

                 jsonData = json;

                 $('.result_container').html(''); // Clear container

                 $(".btn-fag").removeClass("btn-primary").addClass("btn-info");

                 $(".search_textfield").val(tag);

                 build_tn_grid(); // Insert new objects

             }
             errorCallBack = function(result) {
                 // alert('FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');

                 console.log('searchObject_byTag: FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');
             }

             // cc.srvCall('../objectSearch/index.php', {searchObject: jsonString}, successCallBack, errorCallBack, 'html');   // <-----  OK
             cc.srvCall('../objectSearch/index.php', { searchObject_byTag: JSON.stringify({ tag: tag }) }, successCallBack, errorCallBack, 'html'); // <-----  TEST
         }

     });

     //==============================================================================================================

     $(".btn_overblik").click(function() {
         var num = $(this).index(".btn_overblik");
         build_overview(num);
     });

     $(".label_btn").click(function() {
         console.log("Clicked label");
         $(".search_textfield").val("");
         $(".btn-fag").removeClass("btn-primary").addClass("btn-info");





         var thisHTML = $(this).html().toUpperCase();

         // EN LILLE EXCEPTION VED SAMFUNDSFAG (for langt ord:
         if (thisHTML == "SAMF.") {
             thisHTML = "SAMFUNDSFAG";
         }
         // 



         console.log("THISHTML: " + thisHTML);


         $(".btn-fag").each(function(index) {
             var btn_HTML = $(this).html().toUpperCase();

             console.log("btn_HTML: " + btn_HTML);

             if (btn_HTML == thisHTML) {
                 console.log("MATCH!");
                 $(".btn-fag").eq(index).addClass("btn-primary");

             }
         });
         perform_search();
     });

     $(".thumbnail").click(function() {
         active_tn = $(this).index(".thumbnail");
         console.log(active_tn);
     });



     console.log($('.result_container').masonry());

     $(".result_container").fadeOut(0);

     setTimeout(function() {
         //your code to be executed after 1 second
         $(".result_container").fadeIn(200);

         $('.result_container').masonry('destroy');

         $('.result_container').masonry({
             itemSelector: '.post-box',
             columnWidth: '.post-box',
             transitionDuration: 200,
             gutter: 1
         });
     }, 500);








     // init Masonry after all images have loaded





 }

 function build_topmenu() {

     var fag_Array;

     // if (srvLiveState) {   // <------------------   Commented out 20/2-2017: For some strange reason the this code block is back: strange behavior of git/sourcetree?
     //     var cc = Object.create(core_CLASS);
     //     successCallBack = function(result) {
     //         // alert('result: SUCCESS');

     //         var json = JSON.parse(cc.ajaxUnwrap(result));
     //         console.log('tag_label - successCallBack - json: ' + JSON.stringify(json));

     //         fag_Array = json;

     //         for (var i = 0; i < fag_Array.length; i++) {
     //             $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
     //         }

     //         $(".btn-fag").click(function() { // We need to set event-listeners after we add btn-fag:
     //             click_fag($(this));
     //         });
     //     }
     //     errorCallBack = function(result) {
     //         alert('FEJL: Serveren kunne ikke hente fag fra databasen!');
     //     }

     //     cc.srvCall('../objectSearch/index.php', { searchObject_getAllSubjects: 1 }, successCallBack, errorCallBack, 'html');
     // } else {
     fag_Array = ["BIOLOGI", "DANSK", "ENGELSK", "FYSIK", "GEOGRAFI", "HISTORIE", "KS", "KEMI", "MATEMATIK", "NATURFAG", "SAMFUNDSFAG", "SSO", "TYSK", "PSYKOLOGI", "RELIGION"];

     for (var i = 0; i < fag_Array.length; i++) {
         $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
     }
     // }

     // IMPORTANT: 
     // The following has been commented out since Safari (and some versions of IE11, perhaps due to some individual browser settings) does not fetch the subjects from DB correctly
     // ===============================
     // if (srvLiveState) {
     //     var cc = Object.create(core_CLASS);
     //     successCallBack = function(result) {
     //         // alert('result: SUCCESS');

     //         var json = JSON.parse(cc.ajaxUnwrap(result));
     //         console.log('tag_label - successCallBack - json: ' + JSON.stringify(json));

     //         fag_Array = json;

     //         for (var i = 0; i < fag_Array.length; i++) {
     //             $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
     //         }

     //         $(".btn-fag").click(function() {  // We need to set event-listeners after we add btn-fag:
     //             click_fag($(this));
     //         });
     //     }
     //     errorCallBack = function(result) {
     //         alert('FEJL: Serveren kunne ikke hente fag fra databasen!');
     //     }

     //     cc.srvCall('../objectSearch/index.php', { searchObject_getAllSubjects: 1 }, successCallBack, errorCallBack, 'html'); 
     // } else {
     //     // fag_Array = ["BIOLOGI", "DANSK", "ENGELSK", "GEOGRAFI", "HISTORIE", "KS", "KEMI", "MATEMATIK", "NATURVIDENSKAB", "PSYKOLOGI", "RELIGION", "SAMFUNDSFAG", "SPANSK", "TYSK"]; // Commented out by THAN 30/1-2017
     // fag_Array = ["Biologi","Dansk","Engelsk","Geografi","Kemi","KS"]; // Current subjects - Added by THAN 30/1-2017

     // for (var i = 0; i < fag_Array.length; i++) {
     //     $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
     // }
     // }


 }


 function build_overview(indeks) {
     var jd = jsonData[indeks];

     var HTML = "<div class='content_wrapper'><h2>" + jd.meta_objTitel + "</h2>";
     HTML += "<img src='" + jd.meta_imgUrl + "' class='img-responsive cropped'/>";
     if (jd.meta_objType.length > 0) {
         HTML += '<p class="objektinfo"><b>Objekttype: </b>';
         for (var o = 0; o < jd.meta_objType.length; o++) {
             if (o > 0) {
                 HTML += jd.meta_objType[o].toLowerCase() + ((o == jd.meta_objType.length - 1) ? '' : ', ');
             } else {
                 HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
             }
         }
         HTML += '</p>';
     }
     if (jd.meta_studentPurpose != null) {
         HTML += "<p class='objektinfo'><b>Kursistformål: </b>" + jd.meta_studentPurpose + "</p>";
     }
     if (jd.meta_studentPrerequisites != null) {
         HTML += "<p class='objektinfo'><b>Kursistforudsætninger: </b>" + jd.meta_studentPrerequisites + "</p>";
     }
     if (jd.meta_workMethod != null) {
         HTML += "<p class='objektinfo'><b>Arbejdsmetode: </b>" + jd.meta_workMethod + "</p>";
     }
     if (jd.meta_teachingPurpose.length > 0) {
         HTML += '<p class="objektinfo"><b>Læringsmål: </b><ul>';
     }
     for (var p = 0; p < jd.meta_teachingPurpose.length; p++) {
         HTML += '<li>' + jd.meta_teachingPurpose[p] + ((p == jd.meta_teachingPurpose.length - 1) ? '' : '</li>');
     }
     HTML += '</ul></p>';
     if (jd.meta_activityForm.length > 0) {
         HTML += '<p class="objektinfo"><b>Aktivitetsform: </b>';
         for (var o = 0; o < jd.meta_activityForm.length; o++) {
             if (o > 0) {
                 HTML += jd.meta_activityForm[o].toLowerCase() + ((o == jd.meta_activityForm.length - 1) ? '' : ', ');
             } else {
                 HTML += jd.meta_activityForm[o] + ((o == jd.meta_activityForm.length - 1) ? '' : ', ');
             }
         }
         HTML += '</p>';
     }
     if (jd.meta_tags.length > 0) {
         HTML += '<p class="objektinfo"><b>Tags: </b>';
         for (var o = 0; o < jd.meta_tags.length; o++) {
             HTML += '#' + jd.meta_tags[o] + ((o == jd.meta_tags.length - 1) ? '' : ' ');
         }
     }
     HTML += '</p>';
     if (jd.meta_level.length > 0) {
         HTML += '<p class="objektinfo"><b>Niveau: </b>';
         for (var o = 0; o < jd.meta_level.length; o++) {
             HTML += jd.meta_level[o] + ((o == jd.meta_level.length - 1) ? '' : ', ');
         }
         HTML += '</p>';
     }
     if (jd.meta_theme.length > 0) {
         HTML += '<p class="objektinfo"><b>Tema: </b>';
         for (var o = 0; o < jd.meta_theme.length; o++) {
             HTML += jd.meta_theme[o] + ((o == jd.meta_theme.length - 1) ? '' : ', ');
         }
         HTML += '</p>';
     }
     if (jd.meta_duration != null) {
         HTML += "<p class='objektinfo'><b>Varighed: </b>" + jd.meta_duration + "</p>";
     }
     if (jd.meta_difficulty != null) {
         HTML += "<p class='objektinfo'><b>Sværhedsgrad: </b>" + jd.meta_difficulty + "</p>";
     }

     if (jd.meta_form.length > 0) {
         HTML += '<p class="objektinfo"><b>Form: </b>';
         for (var o = 0; o < jd.meta_form.length; o++) {
             HTML += jd.meta_form[o] + ((o == jd.meta_form.length - 1) ? '' : ', ');
         }
         HTML += '</p>';
     }
     if (jd.meta_media_type.length > 0) {
         HTML += '<p class="objektinfo"><b>Type: </b>';
         for (var o = 0; o < jd.meta_media_type.length; o++) {
             if (o > 0) {
                 HTML += jd.meta_media_type[o].toLowerCase() + ((o == jd.meta_media_type.length - 1) ? '' : ', ');
             } else {
                 HTML += jd.meta_media_type[o] + ((o == jd.meta_media_type.length - 1) ? '' : ', ');
             }
         }
     }
     if (jd.meta_author.length > 0) {
         HTML += '<p class="objektinfo"><b>Forfattere: </b><br/>';
         for (var o = 0; o < jd.meta_author.length; o++) {
             console.log(jd.meta_author[o].firstname);
             HTML += jd.meta_author[o].titel + " " + jd.meta_author[o].firstname + " " + jd.meta_author[o].lastname + " - ";
             HTML += jd.meta_author[o].institution + " email: " + jd.meta_author[o].email + "</p>"

         }
     }
     HTML += '</p></div>';


     UserMsgBox("body", HTML);
 }


 function getRequestedObjectsByUrl() {

     var UlrVarObj = {}; // Define UlrVarObj
     UlrVarObj = ReturnURLPerameters(UlrVarObj); // Get URL file perameter. 
     console.log('search - URL check - UlrVarObj 1: ' + JSON.stringify(UlrVarObj));

     // If the script is on the live server AND "fag" OR "q" is set, then.... 
     if ((typeof(oneTimeUrlCheck) === 'undefined') && (srvLiveState) && ((typeof(UlrVarObj.fag) !== 'undefined') ||  (typeof(UlrVarObj.q) !== 'undefined'))) {

         window.oneTimeUrlCheck = 1;

         console.log('search - URL check - getUrlVars: ' + JSON.stringify(getUrlVars())); // <----- Check af getUrlVars() fra shared functions: denne giver kun navnet på variablerne, og ikke de tilhørende værdier også.

         console.log('search - URL check - UlrVarObj 2: ' + JSON.stringify(UlrVarObj));

         // .fag_btn_container
         if (typeof(UlrVarObj.fag) !== 'undefined') {
             $(".btn-fag").each(function(index, element) {
                 if (UlrVarObj.fag.toLowerCase().indexOf($(element).text().toLowerCase()) !== -1) {
                     $(element).addClass("btn-primary").removeClass("btn-info");
                 }
             });
         }

         if (typeof(UlrVarObj.q) !== 'undefined') {
             $(".search_textfield").val(UlrVarObj.q.replace(/\+/g, ' '));
         }

         perform_search();
     }
 }


 function ReturnURLPerameters(UlrVarObj) {
     var UrlVarStr = window.location.search.substring(1);
     console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
     var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&"); // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
     console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
     for (var i in UrlVarPairArray) {
         var UrlVarSubPairArray = UrlVarPairArray[i].split("="); // & = %3D
         if (UrlVarSubPairArray.length == 2) {
             UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
         }
     }
     console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify(UlrVarObj));
     return UlrVarObj;
 }



 /*objId: null, // "objekt id",             TYPE: integer, objektets id ift. tabellen over alle objekter.
     meta_objType: [], // "objekt type",           TYPE: array of strings, feks: ["Markeringsøvelse", "Interaktiv model", ...]
     meta_subject: [], // "Fag",                   TYPE: array of strings, feks: ["Dansk", "Engelsk", ...]       
     meta_objUrl: null, // "URL til objektet"       TYPE: string, feks: "danA_bevaegelser/bevaegelser.html"
     meta_studentPurpose: null, // "Kursistformål"          TYPE: string, feks: "En tekst bevæger sig både gennem forskellige faser..."
     meta_studentPrerequisites: null, // "Kursistforudsætninger", TYPE: string, feks: "Objektet forusætter kendskab til ..."
     meta_workMethod: null, // "Arbejdsmetode"          TYPE: string, feks: "Placer tekststykkerne, så de står i den rigtige..."
     meta_teachingPurpose: [], // "Læringsmål"             TYPE: array of strings, feks: ["Navigere og udvælge...", "Forholde sig til..."]
     meta_activityForm: [], // "Aktivitetsform"         TYPE: array of strings, feks: ["Egnet til selvstændigt arbejde", "Kræver høretelefoner"]
     meta_tags: [], // "Tags"                   TYPE: array of strings, feks: ["sproglig bevidsthed", "skriftlighed", ...]
     meta_level: [], // "Niveau"                 TYPE: array of strings, feks: ["A", "B"]
     meta_theme: [], // "Tema"                   TYPE: array of strings, feks: ["Sproglighed", "Skriftlighed", ...]
     meta_duration: null, // "Varighed"               TYPE: string, feks: "10 - 15 min"
     meta_difficulty: null, // "Sværhedsgrad"           TYPE: string, feks: "Svær"
     meta_form: [], // "Form"                   TYPE: array of strings, feks: [Opgave/træning", "Formidling"]
     meta_media_type: [], // "Medietype"              TYPE: array of strings, feks: ["Billeder", "Lyd", ...]
     meta_author: [] // "Forfatter"              TYPE: array of objects, feks: [forfatter_1, forfatter_2, ...]
 }


 /*
     <div class="col-xs-12 col-sm-6 col-md-4 post-box">
         <div class="thumbnail col-xs-12">
         <div class="thumb_img_container col-xs-8">
         <img class="img-responsive"
     src="img/1_hvad_er_ks.jpg"
     alt="...">
         <a target="_blank"
     href="../ks_film/hvad_er_ks.html">
         </a> </div> <div class="col-xs-4 fag_label_container">
         <h4 class="fag_label_h4"> <span class="label label-primary fag_label"> Dansk B </span></h
     4 >
         </div> <div class="col-xs-12">
         <h3>Politikeres brug af videomediet </h3> <div class="link_container">
         <span class="btn btn-sm btn-info"> Se </span> <span class="btn btn-sm btn-info"> Hent link </span> <span class="btn btn-sm btn-info"> Indsæt i LMS </span> </div> <p >
         <b>Hvad </b> er fællesfaglighed, og hvordan arbejder man i kulturfag? </p> <div class="col-xs-7 hr_container">
         <hr >
         </div> <div class="col-xs-5 readmore_container"> <span class="glyphicon glyphicon-play"> </span> <span class="readmore">LÆS MERE<span></div >
         </div> </div> </div>
 }*/
