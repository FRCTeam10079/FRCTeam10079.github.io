root {
    includes = listOf(src("util.coho.kts"))

    val sponsors = (yaml(src("sponsors.yaml")) as List<*>).let { it + it }
    KtHtmlFile.globalContext = mapOf(
        "sponsors" to sponsors,
        "navbarData" to yaml(src("navbar.yaml")),
        "navbarHtml" to "header"("class" to "site-header") {
            "div"("class" to "header-container") {
                "div"("class" to "logo-text") {
                    "a"("href" to "index.html") {
                        append("Bothell Robotics")
                    }
                }
                "div"("class" to "mobile-menu-btn") {
                    "span"() {}
                    "span"() {}
                    "span"() {}
                }
                append(makeNavBar(yaml(src("navbar.yaml"))))
            }
        },
    )

    ktHtml(src("calendar.html"))
    cp(src("calendar.css"))
    ktHtml(src("contact.html"))
    cp(src("contact.css"))
    ktHtml(src("donate.html"))
    cp(src("donate.css"))
    ktHtml(src("events.html"))
    cp(src("events.css"))
    ktHtml(src("index.html"))
    ktHtml(src("resources.html"))
    cp(src("resources.css"))
    ktHtml(src("team.html"))
    cp(src("style.css"))
    cp(src("script.js"))
    cp(src("contact.js"))
    cp(src("slider.js"))

    path("images") {
        source.files().forEach { cp(src(it.name)) }
    }
}
