fun makeNavBar(data: Any?) = "nav"("class" to "site-nav") {
    val navBarData = data as List<Map<String, Any?>>
    for (navItem in navBarData) {
        if ("children" in navItem) {
            // Make dropdown
            "div"("class" to "dropdown") {
                "button"("class" to "dropbtn") {
                    append(navItem["title"])
                }
                "div"("class" to "dropdown-content") {
                    for (navChild in navItem["children"] as List<Map<String, Any?>>) {
                        "a"("href" to navChild["url"]) {
                            append(navChild["title"].toString())
                        }
                    }
                }
            }
        } else {
            // Make single
            "a"("href" to navItem["url"]) {
                append(navItem["title"])
            }
        }
    }
}