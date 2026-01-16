fun makeNavBar(data: Any?): String {
    val list = data as? List<*> ?: return "<!-- Navbar data was null -->"
    
    return "nav"("class" to "site-nav") {
        for (item in list) {
            val navItem = item as? Map<*, *> ?: continue
            
            if (navItem.containsKey("children")) {
                // Make dropdown
                "div"("class" to "dropdown") {
                    "button"("class" to "dropbtn") {
                        append(navItem["title"].toString())
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
                    append(navItem["title"].toString())
                }
            }
        }
    }
}