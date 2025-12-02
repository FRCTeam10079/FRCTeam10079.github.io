data class Sponsor(val name: String, val url: String, val image: String) {
    fun toMap() = mapOf(
        "name" to name,
        "url" to url,
        "image" to image,
    )
}


root {
    val sponsors = listOf(
        Sponsor("Fluke", "https://www.fluke.com/", "images/flukesponsor.png"),
        Sponsor("Nasa", "https://www.nasa.gov/", "images/nasasponsor1.png"),
        Sponsor("Dunn", "#", "images/dunnlumbersponsor.png"),
        Sponsor("Boeing", "https://www.boeing.com/", "images/boeingsponsor.png"),
        Sponsor("First Robotics", "https://www.firstinspires.org/", "images/firstrobosponsor.png"),
        Sponsor("Fluke", "https://www.fluke.com/", "images/flukesponsor.png"),
    )

    KtHtmlFile.globalContext = mapOf(
        "sponsors" to sponsors.map { it.toMap() },
    )

    html(src("calendar.html"))
    html(src("calendar.css"))
    html(src("contact.html"))
    html(src("contact.css"))
    html(src("events.html"))
    html(src("events.css"))
    ktHtml(src("index.html"))
    html(src("resources.html"))
    html(src("resources.css"))
    html(src("team.html"))
    html(src("style.css"))
    cp(src("script.js"))
    cp(src("contact.js"))

    path("images") {
        source.files().forEach { cp(src(it.name)) }
    }
}
