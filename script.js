// NEXT TODO: Use attributes to make use of loadedSlides list
const mainContainer = document.getElementById("mainContainer")
var intervalList = {slide: 0, intervals: []}
var animInterval1

document.addEventListener("DOMContentLoaded", () => {
    mainContainer.scrollTop = 0;
    lastScrollTop = mainContainer.scrollTop
    
    loadSlides()
    lastLoadedSlides = loadedSlides
    console.log("SLIDES LOADED:")
    console.log(slides)
    console.log("-----------------------------")
    
    animInterval1 = setInterval(() => bounceAnim(document.getElementById("scrollReminder1"), "10px", "25px"), 800)
})

var slides = [] // FORMAT: {div: html element, height: height relative to the rest of the slides}
var loadedSlides = [] // FORMAT: {index: # associated with slide, div: html element}

// Called once on page load to populate table automatically
function loadSlides() {
    var heightTotal = 0
    for(let i = 0; i <= 100; i++) {
        if(i == 100) {
            // For is used in place of while(true) to catch errors instead of crashing. 100 is an arbitrary value
            throw new Error("Error loading slides")
        }

        if(document.getElementById(`slide${i}`)) {
            const target = document.getElementById(`slide${i}`)
            heightTotal += target.offsetHeight
            slides.push({div: target, height: heightTotal})
            
            if(viewPosition(i) == "in") {
                loadedSlides.push({index: i, div: target})
                target.setAttribute("data-visible", true)
            }
        } else {break}
    }
}

// Returns a string based on the current position of the slide in frame
function viewPosition(index) {
    const scroll = mainContainer.scrollTop
    const winHeight = window.innerHeight
    const eleHeight = slides[index]["div"].offsetHeight
    const stackHeight = slides[index]["height"]
    
    if(scroll + winHeight < stackHeight - eleHeight) {return "down"}
    else if(scroll > stackHeight) {return "up"}
    else {return "in"}
}

// Vars for scroll event:
var lastScrollTop
var scrollEventTimeout
var mainScrollCooldown = 0

// See scroll event
function scrollEventMain() {
    if(mainContainer.scrollTop > lastScrollTop) {
        // SCROLLING DOWN:
        for(let i = Number(loadedSlides[0]["index"]); i < slides.length; i++) {
            // Loops from start -> end, deleting slides that are no longer in frame
            if(viewPosition(i) != "in") {
                loadedSlides.shift()
                slides[i]["div"].removeAttribute("data-visible")
            } else {break}
        }

        for(let i = Number(loadedSlides[loadedSlides.length - 1]["index"]) + 1; i < slides.length; i++) {
            // Loops from end+1 -> failure/max slides, adding slides that are newly in frame
            if(viewPosition(i) == "in") {
                loadedSlides.push({index: i, div: slides[i]["div"]})
                slides[i]["div"].setAttribute("data-visible", true)
            } else {break}
        }

    } else {
        // SCROLLING UP:
        for(let i = Number(loadedSlides[loadedSlides.length - 1]["index"]); i >=0; i--) {
            // Loops from end -> start, deleting slides that are no longer in frame
            if(viewPosition(i) != "in") {
                loadedSlides.pop()
                slides[i]["div"].removeAttribute("data-visible")
            } else {break}
        }

        for(let i = Number(loadedSlides[0]["index"]) - 1; i >= 0; i--) {
            // Loops from start -> failure/min slides, adding slides that are newly in frame
            if(viewPosition(i) == "in") {
                loadedSlides.unshift({index: i, div: slides[i]["div"]})
                slides[i]["div"].setAttribute("data-visible", true)
            } else {break}
        }
    }

    lastScrollTop = mainContainer.scrollTop
}

// Simply checks all slides that are currently loaded without scrollEvent process
function checkAllLoaded() {
    var loaded = []
    for(let slide in slides) {
        if(viewPosition(slide) == "in") {
            loaded.push({index: slide, div: slides[slide]["div"]})
            slides[slide]["div"].setAttribute("data-visible", true)
        } else {
            slides[slide]["div"].removeAttribute("data-visible")
        }
    }
    
    return loaded
}

// Updates loadedSlides array "efficiently"
mainContainer.addEventListener("scroll", event => {
    const MAIN_COOLDOWN_TIME = 0
    const TIMEOUT_COOLDOWN = 200
    
    if(event.timeStamp > mainScrollCooldown + MAIN_COOLDOWN_TIME) {
        mainScrollCooldown = event.timeStamp
        
        try{scrollEventMain()}
        catch(error) {
            console.warn("User scrolled too fast. loadedSlides has been reset properly")
            loadedSlides = checkAllLoaded()
        }
        
        updateAnims()
        
        // Double checks system, but is only run after the user has stopped scrolling for TIMEOUT_COOLDOWN's duration
        clearTimeout(scrollEventTimeout)
        scrollEventTimeout = setTimeout(() => {
            const newActive = checkAllLoaded()
            if (newActive.length != loadedSlides.length) {console.warn("Consider decreasing scroll event cooldown")}
            
            loadedSlides = newActive
            updateAnims()
        }, TIMEOUT_COOLDOWN)

    }
})

// Goal: detect if loadedSlides has changed (and start/stop intervals accordingly, but that hasn't been added yet)
// Timing is dictated by MAIN_COOLDOWN_TIME (cooldown for the entire scroll function) and TIMEOUT_COOLDOWN (runs when the user has stopped scrolling for the set number of ms) above
// If MAIN_COOLDOWN_TIME is smaller/0, it's more precise but everything has to be run much more frequently
// If I set my cooldowns to be way to high it sometimes detects change, but it should work regardless of cooldown speed
// On live preview, slides with a blue background are currently in loadedSlides

var lastLoadedSlides
function updateAnims() {
    console.log(`last loaded length: ${lastLoadedSlides.length}`)
    console.log(lastLoadedSlides)
    console.log(`current length: ${loadedSlides.length}`)
    console.log(loadedSlides)
    
    if(lastLoadedSlides.length == loadedSlides.length) { // I know this conditional needs to be more thorough to detect change, this will just detect the typical case of having more/less slides loaded
        console.log("yes")
    } else {console.log("no")}
    
    lastLoadedSlides = loadedSlides // Despite setting this AFTER the conditional above has been checked, somehow always already =s lastLoadedSlides (without way too high of a cooldown above). Also set once on DOM load
    
    console.log("---------------------")
}

// Remember to set position to something that uses top (like relative) and define transition using css
function bounceAnim(target, defaultPX, maxPX) {
    if (target.style.top != maxPX) {
        target.style.transitionDelay = "0.5s"
        target.style.top = maxPX
    } else {
        target.style.transitionDelay = "0s"
        target.style.top = defaultPX
    }
}