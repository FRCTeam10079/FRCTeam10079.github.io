fun makeNavBar(data: Any?) = "nav"("class" to "site-nav") {
    val list = data as? List<*>
    if (list != null) {
        for (item in list) {
            val navItem = item as? Map<*, *> ?: continue
            
            if (navItem.containsKey("children")) {
                // Make dropdown
                "div"("class" to "dropdown") {
                    "button"("class" to "dropbtn") {
                        append(navItem["title"])
                    }
                    "div"("class" to "dropdown-content") {
                        val children = navItem["children"] as? List<*> ?: emptyList<Any>()
                        for (childItem in children) {
                            val child = childItem as? Map<*, *> ?: continue
                            "a"("href" to child["url"]) {
                                append(child["title"].toString())
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
    } else {
        // Fallback or error indication (optional, or just empty)
        append("<!-- Navbar data was null or invalid -->")
    }
}