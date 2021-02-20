// initialize global counter to not overwhelm front-end with tweets
var tweet_counter = 0;



function feed(data) {
    // func to loop through data passed and created element on client with tweet info.
    // console.log(tweet_counter);

    if (tweet_counter < 20) {
        for (let i = 0; i < data.length; i++) {
            if (data){

                insertData(tweet_counter, data)
                ++tweet_counter
            }
            
        }
    }
}

function insertData(index, values) {
    // func that creates a "div" for each tweet with the corresponding struct, and insert values of latest stream tweet.
    // additionally, a random border color is chosen based on bootstrap's predefined styles.

    var borderTypes = ["primary", "secondary", "success", "danger", "warning", "info", "dark"]
    var random = Math.floor(Math.random() * borderTypes.length);

    let newClass = "box-"+String(index)
    $( ".row" ).append("<div class='"+"shadow p-4 col-3 m-1 box "+newClass+"'><div class='post'></div><br/><div class='metadata'><span class='author'></span><span class='created'></span><span class='username'></span></div></div>" );
    // $('.box').addClass("border border-"+borderTypes[random])

    if (values[index]) {
        if (values[index]['tweet'] != ''){
            $('.'+newClass+' .post')[0].innerText = values[index]['tweet']
        }
        else {
            $('.'+newClass+' .post')[0].innerText = values[index]['full_tweet']
        }
            $('.'+newClass+' .author')[0].innerText = values[index]['author']
            $('.'+newClass+' .created')[0].innerText = moment(values[index]['created']).format('LT - MMM D, YYYY');
            $('.'+newClass+' .username')[0].innerText = '@'+values[index]['author']
    }
}

function getData() {
    // fetch data from db endpoint, and feed to func to create tweet on client end.

    fetch('http://127.0.0.1:5000/data')
        .then(response => response.json())
        .then(data => {
        // console.log(data[0]['tweet'])
        // if (data.slice(-1)[0] != null){
        feed(data)
        // }
    });
}

function startStream() {
    // func to map "Stream" button and start streaming.

    fetch('http://127.0.0.1:5000/dataStream')
        .then(response => response)
        .then(response => {
            console.log(response)
        })
}

function stopStream() {
    // func mapped to "Stop" button to disconnect stream.

    fetch('http://127.0.0.1:5000/stopStream')
        .then(response => response)
        .then(response => {
            console.log(response)
        })
}

let timerId;

// map "Stream" button to func to start stream.
$(".stream").on("click", function(){
    startStream()

    // start an interval every second to update client end with latest streamed tweets
    timerId = setInterval(() => {
        getData()
        $().load('http://127.0.0.1:5000/')
    }, 1000);

});

// map "Stop" button to func, and clear "interval" refresh.
$(".stop").on("click", function(){
    clearInterval(timerId);
    console.log('stopped data fetching');
    stopStream()
    console.log('disconnected data stream');
});




// on page load to show [FOR TESTING]
getData()

