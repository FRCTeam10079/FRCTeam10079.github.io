root {
    includes = listOf(src("util.coho.kts"))


    val manualNavBar = listOf(
        mapOf("title" to "Home", "url" to "index.html"),
        mapOf("title" to "About Us", "children" to listOf(
            mapOf("title" to "Our Team", "url" to "team.html"),
            mapOf("title" to "Calendar & Schedule", "url" to "calendar.html"),
            mapOf("title" to "Organization Chart (PDF)", "url" to "#"),
            mapOf("title" to "Baseline Schedule (PDF)", "url" to "#")
        )),
        mapOf("title" to "Media", "children" to listOf(
            mapOf("title" to "Events & Results", "url" to "events.html"),
            mapOf("title" to "Newsletters", "url" to "#")
        )),
        mapOf("title" to "Resources", "url" to "resources.html"),
        mapOf("title" to "Support", "children" to listOf(
            mapOf("title" to "Donate", "url" to "donate.html"),
            mapOf("title" to "Contact Us", "url" to "contact.html")
        ))
    )

    KtHtmlFile.globalContext = mapOf(
        "sponsors" to yaml(src("sponsors.yaml")),
        "navBarData" to manualNavBar
    )

    ktHtml(src("calendar.html"))
    html(src("calendar.css"))
    ktHtml(src("contact.html"))
    html(src("contact.css"))
    ktHtml(src("donate.html"))
    html(src("donate.css"))
    ktHtml(src("events.html"))
    html(src("events.css"))
    ktHtml(src("index.html"))
    ktHtml(src("resources.html"))
    html(src("resources.css"))
    ktHtml(src("team.html"))
    html(src("style.css"))
    cp(src("script.js"))
    cp(src("contact.js"))
    cp(src("slider.js"))

    path("images") {
        source.files().forEach { cp(src(it.name)) }
    }
}