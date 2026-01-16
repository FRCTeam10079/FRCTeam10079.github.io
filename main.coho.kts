root {
    includes = listOf(src("util.coho.kts"))

    KtHtmlFile.globalContext = mapOf(
        "sponsors" to yaml(src("sponsors.yaml")),
        "navBarData" to yaml(src("navbar-data.yaml")),
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
