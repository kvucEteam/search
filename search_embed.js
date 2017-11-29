$(document).ready(function() {
    console.log("embed up and running!");

    $(".new_window_link").remove();

//$("btn-search").off();    

    $(".btn-search_embed").click(function() {
        linktoSearchSite("intet_fag");
    });

    $(".closeinput").click(function() {
        $(".search_textfield").val("");
    });

    $(document).on("keypress", function(e) {
        // use e.which
        if (e.keyCode == 13) {
            linktoSearchSite("intet_fag");
        }
    });
    //$(".input_text").focus();

    $(".btn-fag").addClass("btn-sm btn-embed");
    $(".logo_text_embed").removeClass("logo_text");

    $(".btn-fag").off(); //("off"); 

    $(".btn-fag").on("click", function() {
        var fag = $(this).html().toLowerCase();
        //$(".search_textfield").val("");
        linktoSearchSite(fag);
    });

    $(".embed_cont_fluid").css("padding-top", "0px");
    
});



function linktoSearchSite(fag) {

    


    var search_string = $(".search_textfield").val();

    search_string = search_string.split(' ').join('+');


    console.log("clicked search: " + search_string + ", fag: " + fag);




    if (fag != "intet_fag") {
        var searchURL = "https://www.vucdigital.dk/search?q=" + fag + " " + search_string;
        console.log("Det er et fag");
    } else {
        var searchURL = "https://www.vucdigital.dk/search?q=" + search_string; }

console.log("text døgning");

    //window.location.href = searchURL;

    window.open(
        searchURL,
        '_blank' // <- This is what makes it open in a new window.
    );
}
