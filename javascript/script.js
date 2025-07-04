console.log("Lets write javascript") ;
let currsong = new Audio() ;
let songs ;
let currFolder ;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(song) {
    currFolder = song ;
    let a = await fetch(`/${song}/`) ;
    let response = await a.text() ;
    // console.log(response) ; 
    let div = document.createElement("div") ;
    div.innerHTML = response ;
    let as = div.getElementsByTagName("a") ;
    songs = [] ;

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${song}/`)[1]) ;
        }
    }

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0] ;
    songUl.innerHTML = "" ;
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                <img class="invert" src="../image/music(1).svg" alt="">
                <div class="info"> 
                    <div>${song}</div>
                    <div>Raj</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="../image/play.svg" alt="">
                </div> </li>` ;
    }

    // Attach the event listner in each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" , element => {
            console.log() ;
            playMusic(e.querySelector(".info").firstElementChild.innerHTML) ;
        })
    });
    return songs ;
}
 
const playMusic = (track , pause = false) => {
    currsong.src = `/${currFolder}/` + track ;
    if(!pause) {
        currsong.play() ;
        play.src = "../image/pause.svg" ;
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track) ;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00" ; 
}

async function main(song) { 
    await getSongs("song/ncs") ;
    playMusic(songs[0] , true) ; 
    console.log(songs) ;

    play.addEventListener("click" , () => {
        if(currsong.paused) {
            currsong.play() ;
            play.src = "../image/pause.svg" ;
        }
        else {
            currsong.pause() ;
            play.src = "../image/play.svg" ;
        }
    });

    // update time
    currsong.addEventListener("timeupdate" , () => {
        // console.log(currsong.currentTime , currsong.duration) ;
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)}/${secondsToMinutesSeconds(currsong.duration)}` ;
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration)* 100 + "%";
    }) ;


    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = ((currsong.duration) * percent) / 100
    })

    // Add event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "0%" ;
    });

    // Add event listner for close button 
    document.querySelector(".close").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "-120%" ;
    });

    document.querySelector("#previous").addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currsong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);

        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });


    document.querySelector("#next").addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currsong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);

        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });


    // volume badhana
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        currsong.volume = parseInt(e.target.value)/100 ;
    });

    // Load kro playlist ko , when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach( e=> {
        e.addEventListener("click" , async item => {
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`) ;
        })
    })

    // Add mute button 
    document.querySelector(".volume img").addEventListener("click" , (e) => {
        if(e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace ("volume.svg" , "mute.svg") ;
            currsong.volume = 0 ;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0 ;
        }
        else {
            e.target.src = e.target.src.replace ("mute.svg" , "volume.svg") ;
            currsong.volume = .1 ; 
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30 ;
        }
    });
} 
main("song") 