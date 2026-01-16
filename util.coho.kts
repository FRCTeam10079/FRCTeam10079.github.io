fun makeNavBar(navBarData: List<Map<String, Any?>>) = "nav"("class" to "site-nav") {
    for (navItem in navBarData) {
        if ("children" in navItem) {
            // Make dropdown
            "div"("class" to "dropdown") {
                "button"("class" to "dropbtn") {
                    append(navItem["title"])
                }
                "div"("class" to "dropdown-content") {
                    for (navChild in navItem["children"] as List<Map<String, Any?>>) {
                        "a"("href" to navItem["url"]) {
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