root {
    html(src("calendar.html"))
    html(src("calendar.css"))
    html(src("contact.html"))
    html(src("contact.css"))
    html(src("events.html"))
    html(src("events.css"))
    html(src("index.html"))
    html(src("resources.html"))
    html(src("resources.css"))
    html(src("team.html"))
    html(src("style.css"))

    path("images") {
        source.files().forEach { cp(src(it.name)) }
    }
}
