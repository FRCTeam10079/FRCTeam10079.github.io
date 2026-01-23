root {
    includes = listOf(src("util.coho.kts"))

    KtHtmlFile.globalContext = mapOf(
        "sponsors" to yaml(src("sponsors.yaml")),
        "navbarData" to yaml(src("navbar.yaml")),
    )

    ktHtml(src("calendar.html"))
    cp(src("calendar.css"))
    ktHtml(src("contact.html"))
    cp(src("contact.css"))
    ktHtml(src("events.html"))
    cp(src("events.css"))
    ktHtml(src("index.html"))
    ktHtml(src("resources.html"))
    cp(src("resources.css"))
    ktHtml(src("team.html"))
    cp(src("style.css"))
    cp(src("script.js"))
    cp(src("contact.js"))

    path("images") {
        source.files().forEach { cp(src(it.name)) }
    }
}
