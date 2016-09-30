$(document).ready(function() {
    console.log(jsonData[0].meta_level);
    build_topmenu();
    build_collapsed_details();

    $(".btn_overblik").click(function() {
        var num = $(this).index(".btn_overblik");

        build_overview(num);

    });
});


var lorem = "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"


function build_collapsed_details() {
    for (var i = 0; i < jsonData.length; i++) {
        var jd = jsonData[i];
        console.log(jsonData[i].meta_imgUrl);


        var HTML = '<div class="post-box col-sm-12 col-md-6 col-lg-4">'; //' ">';
        HTML += '<div class="thumbnail col-xs-12">';
        HTML += '<div class="thumb_img_container col-xs-9">';
        HTML += '<img class="img-responsive" src="' + jd.meta_imgUrl + '" alt="...">';
        HTML += '<a target="_blank" href="' + jd.meta_objUrl + '"></a></div>';
        HTML += '<div class="col-xs-3 fag_label_container"><h4 class="fag_label_h4"> <span class="label label-primary fag_label"> ' + jd.meta_subject + ' </span></h4 ></div>';
        HTML += '<div class="col-xs-12">';
        HTML += '<h3>' + jd.meta_objTitel + '</h3>';
        HTML += '<p><b>Objekttype: </b><em>';
        for (var o = 0; o < jd.meta_objType.length; o++) {
            HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
        }
        HTML += '</em></p>';
        HTML += '<div class="link_container"><span class="btn btn-sm btn-info"> Se </span> <span class="btn btn-sm btn-info"> Hent link </span> <span class="btn btn-sm btn-info"> Indsæt i LMS </span> </div>';
        HTML += '<p><b>Kursistformål: </b>  ' + jd.meta_studentPurpose + '</p>';
        HTML += "<div class='col-xs-4 tag_label_container'>"
        for (var u = 0; u < jd.meta_tags.length; u++) {
            HTML += "<span class='btn btn-info btn-sm tag_label'> # " + jd.meta_tags[u] + "</span>";
        }
        HTML += "</div><div class='btn btn-primary btn_overblik'><span class='glyphicon glyphicon-exclamation-sign'></span> Se total info om objektet</div></div>";
        HTML += '</div> </div> </div>';

        //console.log(HTML);
        $(".tn_container").append(HTML);
    }


}

function build_topmenu() {
    var fag_Array = ["KS", "KEMI", "HISTORIE", "DANSK", "TYSK", "ENGELSK", "SPANSK", "PSYKOLOGI", "TYSK"];

    for (var i = 0; i < fag_Array.length; i++) {
        $(".fag_btn_container").append("<span class='btn btn btn-info btn-fag'>" + fag_Array[i] + "</span>");
    }
}


function showthemdetails(obj) {
    $(".extrainfo").remove();
    var indeks = obj.parent().parent().index(".thumbnail");
    console.log(indeks);
    var HTML = "<div class='extrainfo col-xs-12'><div class=''><p><b>Læringsmål: </b> " + lorem.slice(0, Math.random() * 500) + "</p></div>";
    HTML += "</div><div class='btn btn-info btn_overblik'>Se overblik</div></div>";
    $(".thumbnail").eq(indeks).append(HTML);
    $(".tn_container").masonry();
    $(".glyphicon-play").eq(indeks).css("-webkit-transform", "rotate(90deg)").css("-ms-transform", "rotate(90deg)").css("transform", "rotate(90deg)");
    $(".readmore_container").eq(indeks).addClass("selected");
}

function hidethemdetails(obj) {

    var indeks = obj.parent().parent().index(".thumbnail");
    console.log(indeks);
    $(".extrainfo").remove();
    $(".tn_container").masonry();
    $(".glyphicon-play").eq(indeks).css("-webkit-transform", "rotate(0deg)").css("-ms-transform", "rotate(0deg)").css("transform", "rotate(0deg)");
    $(".readmore_container").eq(indeks).removeClass("selected");
}


function build_overview(indeks) {
    var jd = jsonData[indeks];

    var HTML = "<h2>Overblik over læringsobjekt - " + jd.meta_objTitel + "</h2>";

    HTML += '<p><b>Objekttype: </b><em>';
    for (var o = 0; o < jd.meta_objType.length; o++) {
        HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';
    HTML += "<p><b>URL til objektet: </b><a href='" + jd.meta_objUrl + "'>" + jd.meta_objUrl + "</a></p>";
    HTML += "<p><b>Kursistformål: </b>" + jd.meta_studentPurpose + "</p>";
    //HTML += "<img src='"+jd.meta_imgUrl+"' class='img-responsive'/>";
    HTML += "<p><b>Kursistforudsætninger: </b>" + jd.meta_studentPrerequisites + "</p>";
    HTML += "<p><b>Arbejdsmetode: </b>" + jd.meta_workMethod + "</p>";
    HTML += '<p><b>Læringsmål: </b><em>';
    for (var p = 0; p < jd.meta_teachingPurpose.length; p++) {
        HTML += jd.meta_teachingPurpose[p] + ((p == jd.meta_teachingPurpose.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';
    HTML += '<p><b>Aktivitetsform: </b><em>';
    for (var o = 0; o < jd.meta_activityForm.length; o++) {
        HTML += jd.meta_activityForm[o] + ((o == jd.meta_activityForm.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';

    HTML += '<p><b>Tags: </b><em>';
    for (var o = 0; o < jd.meta_tags.length; o++) {
        HTML += jd.meta_tags[o] + ((o == jd.meta_tags.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';

    HTML += '<p><b>Niveau: </b><em>';
    for (var o = 0; o < jd.meta_level.length; o++) {
        HTML += jd.meta_level[o] + ((o == jd.meta_level.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';

    HTML += '<p><b>Tema: </b><em>';
    for (var o = 0; o < jd.meta_theme.length; o++) {
        HTML += jd.meta_theme[o] + ((o == jd.meta_theme.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';
    HTML += "<p><b>Varighed: </b>" + jd.meta_duration + "</p>";
    HTML += "<p><b>Sværhedsgrad: </b>" + jd.meta_difficulty + "</p>";
    HTML += '<p><b>Form: </b><em>';
    for (var o = 0; o < jd.meta_form.length; o++) {
        HTML += jd.meta_form[o] + ((o == jd.meta_form.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';
    HTML += "<p><b>Medietype: </b>" + jd.meta_media_type + "</p>";

    HTML += '<p><b>Forfattere: </b><p>';
    for (var o = 0; o < jd.meta_author.length; o++) {
        console.log(jd.meta_author[o].firstname);
         HTML += jd.meta_author[o].titel + " " + jd.meta_author[o].firstname + " " + jd.meta_author[o].lastname +" - ";
         HTML += jd.meta_author[o].institution + " email: " + jd.meta_author[o].email + "</p>"

    }
    HTML += '</em></p>';


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
