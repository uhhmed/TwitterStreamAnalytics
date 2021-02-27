// initialize global counter to not overwhelm front-end with tweets
var tweet_counter = 0;
var tweets;


function feed(data) {
    // func to loop through data passed and created element on client with tweet info.
    // console.log(tweet_counter);
    // console.log(data[0])
    // insertData(tweet_counter, data)
    if (tweet_counter < 50) {
        // for (let i = 0; i < data.length; i++) {
            // if (data){
        console.log(data);
        insertData(data);
        ++tweet_counter;
                // console.log(tweet_counter);
            // }
            
        // }
    }
};

function insertData() {
    // func that creates a "div" for each tweet with the corresponding struct, and insert values of latest stream tweet.
    // additionally, a random border color is chosen based on bootstrap's predefined styles.
    if (tweets) {
        for (let i = 0; i < tweets.length; i++) {

            if (tweets[i]['done']){
                console.log(tweets[i])
                console.log('tweet already has been fed!!👍👍👍👍')
            }
            else if (tweet_counter < 50) {
                
                var borderTypes = ["primary", "secondary", "success", "danger", "warning", "info", "dark"]
                var random = Math.floor(Math.random() * borderTypes.length);

                let newClass = "box-"+String(tweet_counter)
                $( ".row" ).prepend("<div class='"+"shadow p-4 col-3 m-1 box "+newClass+"'><div class='post'></div><br/><div class='metadata'><span class='author'></span><i class='fas fa-map-marker-alt'><span class='location'></span></i><span class='created'></span><span class='username'></span></div></div>" );
                // $('.box').addClass("border border-"+borderTypes[random])


                if (tweets[i]['tweet'] != ''){
                    $('.'+newClass+' .post')[0].innerText = tweets[i]['tweet']
                }
                else {
                    $('.'+newClass+' .post')[0].innerText = tweets[i]['full_tweet']
                }
                $('.'+newClass+' .author')[0].innerText = tweets[i]['screen_name']
                $('.'+newClass+' .location')[0].innerText = ' '+tweets[i]['location']
                $('.'+newClass+' .created')[0].innerText = moment(tweets[i]['created']).format('LT - MMM D, YYYY');
                $('.'+newClass+' .username')[0].innerText = '@'+tweets[i]['author']
                ++tweet_counter
                tweets[i]['done'] = 1
            }
            else {
                console.log('holding off on the tweets 🤚🤚🤚🤚🤚');
            }

        }
    }
};



async function refresh() {
//   btn.disabled = true;
//   dynamicPart.innerHTML = "Loading..."
    console.log('starting to feed data...');
    tweets = await(await fetch(url)).json();
    insertData()
    setTimeout(refresh,1000);
};

let url="http://127.0.0.1:5000/data"
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
    // $( "#tweets" )[0].innerHTML = await(await fetch(url).text();
    // setTimeout(refresh,2000);
    // console.log('Stream button clicked!')
    // feed(await(await fetch(url)).text());
    // setTimeout(getData,5000);

};


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

    console.log('started auto refresh!')
    refresh()


});

// // map "Stop" button to func, and clear "interval" refresh.
$(".stop").on("click", function(){
    // clearInterval(timerId);
    console.log('stopped data fetching');
    stopStream()
    console.log('disconnected data stream');
});




// on page load to show [FOR TESTING]
// getData()

