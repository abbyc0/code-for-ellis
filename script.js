var animInterval1
var testInterval1

document.addEventListener("DOMContentLoaded", () => {
    animInterval1 = setInterval(() => bounceAnim(document.getElementById("scrollReminder1"), "10px", "25px"), 800)
    testInterval1 = setInterval(() => {
        //console.log(document.body.firstElementChild.scrollTop)
        console.log(viewPosition(2))
        console.log(window.scrollX)
    }, 1000)
    loadSlides()
    console.log(slides)
    console.log(loadedSlides)
})

function bounceAnim(target, defaultPX, maxPX) {
    if (target.style.top != maxPX) {
        target.style.transitionDelay = "0.5s"
        target.style.top = maxPX
    } else {
        target.style.transitionDelay = "0s"
        target.style.top = defaultPX
    }
}

var slides = []
var loadedSlides = []
// Called on load to populate table automatically
function loadSlides() {
    var i = 0
    var heightTotal = 0
    while(true) {
        console.log("please please please please please dont crash: "+`slide${i}`)
        if(document.getElementById(`slide${i}`)) {
            const target = document.getElementById(`slide${i}`)
            heightTotal += target.offsetHeight
            slides.push({div: target, height: heightTotal})
            if(viewPosition(i) == "in") {
                loadedSlides.push(target)
            }
        } else {
            return
        }
        i++
    }
}

// Value returns the difference between the bottom of the div and the top of the current scroll position
function viewPosition(index) {
    const scroll = document.getElementById("mainContainer").scrollTop
    const winHeight = window.innerHeight
    const eleHeight = slides[index]["div"].offsetHeight
    const stackHeight = slides[index]["height"]
    
    if(scroll + winHeight < stackHeight - eleHeight) {return "down"}
    else if(scroll > stackHeight) {return "up"}
    else {return "in"}
}
