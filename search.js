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
             UserMsgBox("body", "<h4>Link kopieret </h4>Linket: <b>" + jsonData[active_tn].meta_objUrl + "</b> er kopieret til udklipsholderen!");
             return jsonData[active_tn].meta_objUrl;

         }
     });
     var clipboard_embed = new Clipboard('.btn-get_embed', {
         text: function() {
             var embedlink = '<iframe height="570" width="100%" frameborder="0" src="' + jsonData[active_tn].meta_objUrl + '"></iframe>'
             var help_moodle = '<a class="MetaDataLink" target="_blank" href="https://www.youtube.com/watch?v=0cKkCRRTC_c">Hjælp til indlejring i Moodle </a>';
             UserMsgBox("body", "<h4>Link kopieret til udklipsholderen!</h4>Indlejringskoden er nu kopieret til din udklipsholder, og du kan indsætte linket i dit LMS eller på din webside.<br/>" + help_moodle);
             return embedlink;

         }
     });

     $(document).on("keypress", function(e) {
         // use e.which
         if (e.keyCode == 13) {
             perform_search();
         }
     });

 });


 function perform_search() {

     $(".tn_container").css("height", "0px");

     UserMsgBox("body", "<div class='search_loader'><img src='../library/img/vid_preloader.gif'><br/><br/><p><span class='src_text'>Søger læringsobjekter</span></p></div>");
     $(".CloseClass").hide();
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
             $(".tn_container").html("");
             $(".container-fluid").removeClass("blurred");

             var json = JSON.parse(cc.ajaxUnwrap(result));
             console.log('perform_search - successCallBack - json: ' + JSON.stringify(json));

             jsonData = json;

             console.log("JDL: " + jsonData.length);

             $("#vucCarousel").hide();
             $(".eks_header").hide();

             if (jsonData.length < 1) {
                 //$("#vucCarousel").show();
                 var soegefeedback = "";
                 if (search_string != "" && fag_Array.length > 0) {
                     soegefeedback += "Din søgning på '" + search_string + "' i " + fag_Array_string + " gav ikke noget resultat.";
                 } else if (search_string != "" && fag_Array.length < 1) {
                     soegefeedback += "Din søgning på '" + search_string + "' gav ikke noget resultat.";
                 } else if (search_string == "" && fag_Array.length > 0) {

                     fag_Array_string = fag_Array_string.replace("og", "eller");
                     soegefeedback += "Der er ingen objekter i " + fag_Array_string + ". Prøv at vælge andre fag.";
                 } else if (search_string == "" && fag_Array.length < 1) {
                     soegefeedback += "Ingen resultat. Skriv i søgefeltet eller vælg et fag at søge i.";
                 }
                 soegefeedback += "<p>Forslag som måske kan forbedre din søgning:</p>";
                 soegefeedback += "<ul><li>Vær sikker på, at alle ord er stavet rigtigt</li>";

                 soegefeedback += "<li>Prøv forskellige søgeord - brug synonymer</li>";
                 soegefeedback += "<li>Prøv at søge bredere - i mere generelle termer</li>";
                 soegefeedback += "<li>eller med færre ord</li></ul>";

                 $(".tn_container").html(soegefeedback);

             } else {

                 build_tn_grid(); // Insert new objects   
             }



         }
         errorCallBack = function(result) {
             alert('FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');
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

     perform_search();

 }

 function build_tn_grid() {

     console.log("build_tn_grid");



     for (var i = 0; i < jsonData.length; i++) {
         var jd = jsonData[i];
         console.log(jsonData[i].meta_imgUrl);


         // var HTML = '<div class="post-box col-sm-12 col-md-6 col-lg-4">'; //' ">';                            // Commented out by THAN 20-01-2017
         var HTML = '<div id="objId_' + jd.objId + '" class="post-box col-sm-12 col-md-6 col-lg-4">'; //' ">';       // Added by THAN 20-01-2017
         HTML += '<div class="thumbnail col-xs-12">';
         HTML += '<div class="thumb_img_container col-xs-9">';
         //HTML += '';
         HTML += '<a target="_blank" href="' + jd.meta_objUrl + '"><img class="img-responsive" src="' + jd.meta_imgUrl + '" alt="..."></a></div>';
         HTML += '<div class="col-xs-3 fag_label_container"><span class="label_btn btn btn-primary">' + jd.meta_subject + '</span></div>';
         HTML += '<div class="col-xs-12">';
         HTML += '<h3>' + jd.meta_objTitel + '</h3>';

         HTML += '<div class="link_container"><span class="btn btn-sm btn-info btn-link_kat"><a id="copy_href" href="' + jd.meta_objUrl + '">Åbn objekt </a></span> <span class="btn btn-sm btn-info btn-get_link btn-link_kat"> Hent link </span> <span class="btn btn-sm btn-info btn-get_embed btn-link_kat"> Indsæt i LMS </span> </div>';
         HTML += '<p><b>Objekttype: </b>';
         for (var o = 0; o < jd.meta_objType.length; o++) {
             HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
         }
         HTML += '</p>';
         HTML += '<p><b>Kursistformål: </b>  ' + jd.meta_studentPurpose + '</p>';
         HTML += "<div class='col-xs-4 tag_label_container'>"
         for (var u = 0; u < jd.meta_tags.length; u++) {
             HTML += "<span class='btn btn-info btn-sm tag_label'>#" + jd.meta_tags[u] + "</span>";
         }
         HTML += "</div><div class='btn btn-primary btn_overblik'><span class='glyphicon '></span>Læs om objektet</div></div>";
         HTML += '</div> </div> </div>';

         //console.log(HTML);
         $(".tn_container").append(HTML);

     }

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

                 $('.tn_container').html(''); // Clear container

                 build_tn_grid(); // Insert new objects

             }
             errorCallBack = function(result) {
                 alert('FEJL: Serveren kunne ikke indsætte det indtastede data i databasen!');
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

         console.log("THISHTML: " + thisHTML);


         $(".btn-fag").each(function(index) {
             var btn_HTML = $(this).html();

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



     console.log($('.tn_container').masonry());

     $('.tn_container').masonry('destroy');

     $('.tn_container').masonry({
         itemSelector: '.post-box',
         columnWidth: '.post-box',
         transitionDuration: 200
     });









     // init Masonry after all images have loaded





 }

    function build_topmenu() {

        var fag_Array;

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
            fag_Array = ["Biologi","Dansk","Engelsk","Geografi","Kemi","KS"]; // Current subjects - Added by THAN 30/1-2017

            for (var i = 0; i < fag_Array.length; i++) {
                $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
            }
        // }

        

    }


 function build_overview(indeks) {
     var jd = jsonData[indeks];

     var HTML = "<div class='content_wrapper'><h2>" + jd.meta_objTitel + "</h2>";
     HTML += "<img src='" + jd.meta_imgUrl + "' class='img-responsive cropped'/>";
     HTML += '<p class="objektinfo"><b>Objekttype: </b>';
     for (var o = 0; o < jd.meta_objType.length; o++) {
         if (o > 0) {
             HTML += jd.meta_objType[o].toLowerCase() + ((o == jd.meta_objType.length - 1) ? '' : ', ');
         } else {
             HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
         }
     }
     HTML += '</p>';
     HTML += "<p class='objektinfo'><b>Kursistformål: </b>" + jd.meta_studentPurpose + "</p>";

     HTML += "<p class='objektinfo'><b>Kursistforudsætninger: </b>" + jd.meta_studentPrerequisites + "</p>";
     HTML += "<p class='objektinfo'><b>Arbejdsmetode: </b>" + jd.meta_workMethod + "</p>";
     HTML += '<p class="objektinfo"><b>Læringsmål: </b><ul>';
     for (var p = 0; p < jd.meta_teachingPurpose.length; p++) {
         HTML += '<li>' + jd.meta_teachingPurpose[p] + ((p == jd.meta_teachingPurpose.length - 1) ? '' : '</li>');
     }
     HTML += '</ul></p>';
     HTML += '<p class="objektinfo"><b>Aktivitetsform: </b>';
     for (var o = 0; o < jd.meta_activityForm.length; o++) {
         if (o > 0) {
             HTML += jd.meta_activityForm[o].toLowerCase() + ((o == jd.meta_activityForm.length - 1) ? '' : ', ');
         } else {
             HTML += jd.meta_activityForm[o] + ((o == jd.meta_activityForm.length - 1) ? '' : ', ');
         }
     }
     HTML += '</p>';

     HTML += '<p class="objektinfo"><b>Tags: </b>';
     for (var o = 0; o < jd.meta_tags.length; o++) {
         HTML += '#' + jd.meta_tags[o] + ((o == jd.meta_tags.length - 1) ? '' : ' ');
     }
     HTML += '</p>';

     HTML += '<p class="objektinfo"><b>Niveau: </b>';
     for (var o = 0; o < jd.meta_level.length; o++) {
         HTML += jd.meta_level[o] + ((o == jd.meta_level.length - 1) ? '' : ', ');
     }
     HTML += '</p>';

     HTML += '<p class="objektinfo"><b>Tema: </b>';
     for (var o = 0; o < jd.meta_theme.length; o++) {
         HTML += jd.meta_theme[o] + ((o == jd.meta_theme.length - 1) ? '' : ', ');
     }
     HTML += '</p>';
     HTML += "<p class='objektinfo'><b>Varighed: </b>" + jd.meta_duration + "</p>";
     HTML += "<p class='objektinfo'><b>Sværhedsgrad: </b>" + jd.meta_difficulty + "</p>";
     HTML += '<p class="objektinfo"><b>Form: </b>';
     for (var o = 0; o < jd.meta_form.length; o++) {
         HTML += jd.meta_form[o] + ((o == jd.meta_form.length - 1) ? '' : ', ');
     }
     HTML += '</p>';
     HTML += '<p class="objektinfo"><b>Type: </b>';
     for (var o = 0; o < jd.meta_media_type.length; o++) {
         if (o > 0) {
             HTML += jd.meta_media_type[o].toLowerCase() + ((o == jd.meta_media_type.length - 1) ? '' : ', ');
         } else {
             HTML += jd.meta_media_type[o] + ((o == jd.meta_media_type.length - 1) ? '' : ', ');
         }
     }

     HTML += '<p class="objektinfo"><b>Forfattere: </b><br/>';
     for (var o = 0; o < jd.meta_author.length; o++) {
         console.log(jd.meta_author[o].firstname);
         HTML += jd.meta_author[o].titel + " " + jd.meta_author[o].firstname + " " + jd.meta_author[o].lastname + " - ";
         HTML += jd.meta_author[o].institution + " email: " + jd.meta_author[o].email + "</p>"

     }
     HTML += '</p></div>';


     UserMsgBox("body", HTML);
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
