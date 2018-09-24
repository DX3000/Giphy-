$(document).ready(function () {
    const apikey = "DtDLfvse4qHEYkdQh4a9sYMlws7shZwd";
    let url = "https://api.giphy.com/v1/gifs/search?";
    let search = "cat";
    let limit = 10;
    let topics = [
        "Sex",
        "Drugs",
        "Guns",
        "Rock n Roll"
    ];
    let queryUrl = buildUrl();

    // gen starting buttons
    buildButtons();

    function buildButtons() {
        $("#topic-list").html("");
        for (let i = 0; i < topics.length; i++) {
            let topicBtn = $("<button>");
            topicBtn.text(topics[i]);
            topicBtn.addClass("topic-btn");
            $("#topic-list").append(topicBtn);
            search = topics[i];
        }
    }

    $("#topic-list").on("click", ".topic-btn", function (event) {
        event.preventDefault();
        search = $(this).text();
        doAjax();
    });

    function buildUrl() {
        let params = {
            q: search,
            api_key: apikey,
            limit: limit
        }
        let queryUrl = url + $.param(params);
        console.log(queryUrl);
        return queryUrl;
    }

    function doAjax() {
        $("#gifs-list").html("");
        queryUrl = buildUrl();
        $("#loading").show();
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (res) {
            let data = res.data;
            console.log(res);
            $("#loading").hide();
            if (data.length > 0) {
                console.log(res);
                let counter = 0;
                data.forEach(function (gif) {
                    let imgContainer = $("<div class='img-container'>");
                    imgContainer.append(
                        `<figure>
                        <img class='img-fluid' src='${gif.images.fixed_width_still.url}'>
                        <figcaption>rating: ${gif.rating} status: <span class="status">paused<span></figcaption>
                        </figure>`);
                    $("#gifs-list").append(imgContainer);
                    console.log(gif.images);
                    counter++;
                });
            } else {
                $("#gifs-list").html("<h2>Sorry, could not find gifs, please try again.</h2>");
            }
        }).fail(function (err) {
            console.log(err);
        });
    }

    $("#submitName").on("click", function (event) {
        event.preventDefault();
        if ($("#searchName").val() !== "") {
            search = $("#searchName").val();
            topics.push(search);
            buildButtons();
            queryUrl = buildUrl();
            doAjax();
            $("#searchName").val("");
        } else {
            $("#gifs-list").html("<h2>Please enter a search.</h2>");
        }
    });

    $("#gifs-list").on("click", ".img-container", function () {
        let newSrc = $(this).find("img").attr("src");
        let status = "paused";
        if (newSrc.includes("_s.gif")) {
            newSrc = newSrc.replace("_s.gif", ".gif");
            status = "playing";
        } else {
            newSrc = newSrc.replace(".gif", "_s.gif");
            status = "paused";
        }
        console.log(newSrc);
        $(this).find("img").attr({ src: newSrc });
        $(this).find(".status").text(status);
    });
});