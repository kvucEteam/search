$(document).ready(function() {
    console.log("embed up and running!");

    $(".btn-search_embed").click(function() {
        linktoSearchSite();
    });

    $(".closeinput").click(function() {
        $(".search_textfield").val("");
    });

    $(document).on("keypress", function(e) {
        // use e.which
        if (e.keyCode == 13) {
            linktoSearchSite();
        }
    });
});



function linktoSearchSite() {
    var search_string = $(".search_textfield").val();

    search_string = search_string.split(' ').join('+');


    console.log("clicked search: " + search_string);

    var searchURL = "https://www.vucdigital.dk/search?q=" + search_string;

    //window.location.href = searchURL;

    window.open(
        searchURL,
        '_blank' // <- This is what makes it open in a new window.
    );
}
