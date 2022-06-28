(function($){  

    
    //Tab switch
    $(".tab-item:nth-child(1)").on('click', () => {
        $(".tab-item:nth-child(2)").removeClass("active")
        $(".tab-item:nth-child(1)").addClass("active")
        $(".c-section").css({"display": "flex"})
        $(".s-section").css({"display": "none"})
    })

    $(".tab-item:nth-child(2)").on('click', () => {
        $(".tab-item:nth-child(1)").removeClass("active")
        $(".tab-item:nth-child(2)").addClass("active")
        $(".c-section").css({"display": "none"})
        $(".s-section").css({"display": "flex"})
    })

    
    //Close message box
    $("#close").on('click', () => {
        $("#message-box").fadeOut(500)
    })

    
    //Download from channel
    $('#c-button').on('click', () =>{
        var link = document.getElementById("channel-link").value
        var videos_count = document.getElementById("video-count").value
        var start_range = document.getElementById("start-range").value
        var end_range = document.getElementById("end-range").value

        if(link === ''){
            $("#message-box").css({"background-color": 'red'})
            document.getElementById("message").innerHTML = 'Link cannot be empty'
            $("#message-box").fadeIn(500)
            setTimeout(() => $("#message-box").fadeOut(500), 5000)
        } else if(parseInt(start_range) === 0){
            $("#message-box").css({"background-color": 'red'})
            document.getElementById("message").innerHTML = 'Start number cannot be zero'
            $("#message-box").fadeIn(500)
            setTimeout(() => $("#message-box").fadeOut(500), 5000)
        } else if(parseInt(start_range) > 0 && (parseInt(end_range) < parseInt(start_range) || end_range === '')){
            $("#message-box").css({"background-color": 'orange'})
            document.getElementById("message").innerHTML = 'End number cannot be less than start number'
            $("#message-box").fadeIn(500)
            setTimeout(() => $("#message-box").fadeOut(500), 5000)
        } else {
            if(videos_count === 0 || videos_count === ''){
                videos_count = 'All'
            }
            $(".loader").css({"display": 'flex'})
            $("#tab").css({"display": "none"})
            $(".c-section").css({"display": "none"})
            $.ajax({
                url: `http://${window.location.hostname}:8000/channel/`,
                method: 'POST',
                headers: {
                    "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
                },
                data: {
                    link: link,
                    start_range: start_range === '' ? 0 : start_range,
                    end_range: end_range === '' ? 0 : end_range,
                    videos_count: videos_count
                },
                success: (data) => {
                    $("#message-box").css({"background-color": 'green'})
                    document.getElementById("message").innerHTML = 'All your videos have been downloaded!'
                    $("#message-box").fadeIn(500)
                    setTimeout(() => $("#message-box").fadeOut(500), 5000)

                    $(".loader").css({"display": 'none'})
                    $("#tab").css({"display": "flex"})
                    $(".c-section").css({"display": "flex"})
                },
                error: (err) => {
                    if(err.status === 400){
                        $("#message-box").css({"background-color": 'red'})
                        document.getElementById("message").innerHTML = 'Enter a valid channel link'
                        $("#message-box").fadeIn(500)
                        setTimeout(() => $("#message-box").fadeOut(500), 5000)

                        $(".loader").css({"display": 'none'})
                        $("#tab").css({"display": "flex"})
                        $(".c-section").css({"display": "flex"})
                    }
                    if(err.status === 500){
                        $("#message-box").css({"background-color": 'red'})
                        document.getElementById("message").innerHTML = 'Something went wrong! Please check your input'
                        $("#message-box").fadeIn(500)
                        setTimeout(() => $("#message-box").fadeOut(500), 5000)

                        $(".loader").css({"display": 'none'})
                        $("#tab").css({"display": "flex"})
                        $(".c-section").css({"display": "flex"})
                    }
                }
            })
        }
    })

    
    //Download single video
    $('#s-button').on('click', () =>{
        var link = document.getElementById("video-link").value
        if(link === ''){
            $("#message-box").css({"background-color": 'red'})
            document.getElementById("message").innerHTML = 'Link cannot be empty'
            $("#message-box").fadeIn(500)
            setTimeout(() => $("#message-box").fadeOut(500), 5000)
        } else {
            document.getElementById("video-link").value = ""
            $(".loader").css({"display": 'flex'})
            $("#tab").css({"display": "none"})
            $(".s-section").css({"display": "none"})
            $.ajax({
                url: `http://${window.location.hostname}:8000/single/`,
                method: 'POST',
                headers: {
                    "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
                },
                data: {
                    video_link: link
                },
                success: (data) => {
                    $("#message-box").css({"background-color": 'green'})
                    document.getElementById("message").innerHTML = 'Your video has been downloaded!'
                    $("#message-box").fadeIn(500)
                    setTimeout(() => $("#message-box").fadeOut(500), 5000)

                    $(".loader").css({"display": 'none'})
                    $("#tab").css({"display": "flex"})
                    $(".s-section").css({"display": "flex"})
                },
                error: (err) => {
                    if(err.status === 400){
                        $("#message-box").css({"background-color": 'red'})
                        document.getElementById("message").innerHTML = 'Enter a valid link'
                        $("#message-box").fadeIn(500)
                        setTimeout(() => $("#message-box").fadeOut(500), 5000)

                        $(".loader").css({"display": 'none'})
                        $("#tab").css({"display": "flex"})
                        $(".s-section").css({"display": "flex"})
                    }
                    if(err.status === 500){
                        $("#message-box").css({"background-color": 'red'})
                        document.getElementById("message").innerHTML = 'Enter a valid link'
                        $("#message-box").fadeIn(500)
                        setTimeout(() => $("#message-box").fadeOut(500), 5000)

                        $(".loader").css({"display": 'none'})
                        $("#tab").css({"display": "flex"})
                        $(".s-section").css({"display": "flex"})
                    }
                }
            })
        }
    })


    //Slider
    $(".slider").slick({
        dots: false,
        arrows: false,
        swipe: false,
        adaptiveHeight: true
    });

    $("#nextButton").on('click', () => {
        if(document.getElementById("channel-link").value === ''){
            $("#message-box").css({"background-color": 'red'})
            document.getElementById("message").innerHTML = 'Link cannot be empty'
            $("#message-box").fadeIn(500)
            setTimeout(() => $("#message-box").fadeOut(500), 5000)
        } else {
            $(".slider").slick('slickNext');
            $("#nextButton").css({"display": "none"})
            $("#c-button").css({"display": "block"})
        }
    })

})(jQuery)  