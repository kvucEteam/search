var active_tn;

$(document).ready(function() {

    build_topmenu();
    build_tn_grid();

    $(".btn_overblik").click(function() {
        var num = $(this).index(".btn_overblik");
        build_overview(num);
    });

    $(".btn-search").click(function() {
        perform_search();
    });

    $(".btn-fag").click(function() {
        click_fag($(this));
    });

    $(".thumbnail").click(function() {
        active_tn = $(this).index(".thumbnail");
        console.log(active_tn);
    });

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
            UserMsgBox("body", "<h4>Link kopieret til udklipsholderen!</h4>Indsæt linket i dit LMS eller på din webside<br/>" + help_moodle);
            return embedlink;

        }
    });

});


function perform_search() {
    var search_string = $(".search_textfield").val();

    for (var i = 0; i < $(".btn-fag").length; i++) {
        if ($(".btn-fag").eq(i).hasClass("active")) {
            search_string += " " + $(".btn-fag").eq(i).text();
        }
    }
    alert("Søgestrengen er: " + search_string);

}

function click_fag(obj) {
    var indeks = obj.index(".btn-fag");
    //hent_fag(indeks);
    console.log(indeks);
    if (obj.hasClass("active")) {
        console.log("has Class")
        obj.removeClass("btn-primary active");
        obj.addClass("btn-info");
    } else {
        obj.addClass("btn-primary active");
        obj.removeClass("btn-info");
    }

}

function hent_fag(obj_num) {
    alert("lad os vise dig alle objk")
}

function build_tn_grid() {
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

        HTML += '<div class="link_container"><span class="btn btn-sm btn-info btn-link_kat"><a id="copy_href" href="' + jd.meta_objUrl + '">Åbn objekt </a></span> <span class="btn btn-sm btn-info btn-get_link btn-link_kat"> Hent link </span> <span class="btn btn-sm btn-info btn-get_embed btn-link_kat"> Indsæt i LMS </span> </div>';
        HTML += '<p><b>Objekttype: </b><em>';
        for (var o = 0; o < jd.meta_objType.length; o++) {
            HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
        }
        HTML += '</em></p>';
        HTML += '<p><b>Kursistformål: </b>  <em>' + jd.meta_studentPurpose + '</em></p>';
        HTML += "<div class='col-xs-4 tag_label_container'>"
        for (var u = 0; u < jd.meta_tags.length; u++) {
            HTML += "<span class='btn btn-info btn-sm tag_label'>#" + jd.meta_tags[u] + "</span>";
        }
        HTML += "</div><div class='btn btn-primary btn_overblik'><span class='glyphicon '></span>Se al info om objektet</div></div>";
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



function build_overview(indeks) {
    var jd = jsonData[indeks];

    var HTML = "<h2>Overblik over læringsobjekt - " + jd.meta_objTitel + "</h2>";
    HTML += "<img src='" + jd.meta_imgUrl + "' class='img-responsive cropped'/>";
    HTML += '<h4>Detaljer om objektet: </h4>';
    HTML += '<p><b>Objekttype: </b><em>';
    for (var o = 0; o < jd.meta_objType.length; o++) {
        HTML += jd.meta_objType[o] + ((o == jd.meta_objType.length - 1) ? '' : ', ');
    }
    HTML += '</em></p>';
    HTML += "<p><b>URL til objektet: </b><a href='" + jd.meta_objUrl + "'>" + jd.meta_objUrl + "</a></p>";
    HTML += "<p><b>Kursistformål: </b>" + jd.meta_studentPurpose + "</p>";

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
        HTML += jd.meta_author[o].titel + " " + jd.meta_author[o].firstname + " " + jd.meta_author[o].lastname + " - ";
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
