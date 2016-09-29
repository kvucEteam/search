$(document).ready(function() {
    console.log(jsonData[0].meta_level);
    build_topmenu();
    build_collapsed_details();

    $(".readmore_container").click(function() {
        that = $(this);
        if ($(this).hasClass("selected") == true) {
            console.log("hide it" + that);
            hidethemdetails(that);
        } else {
            showthemdetails(that);
            console.log("show it" + that);
        }
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
