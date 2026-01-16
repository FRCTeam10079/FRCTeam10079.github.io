fun makeNavBar(data: Any?): String {
    val list = data as? List<*> ?: return "<!-- Error: Navbar data is null or not a List -->"
    
    return "nav"("class" to "site-nav") {
        for (item in list) {
            val navItem = item as? Map<*, *> ?: continue
            val title = navItem["title"]?.toString() ?: "Untitled"
            
            if (navItem.containsKey("children")) {
             
                "div"("class" to "dropdown") {
                    "button"("class" to "dropbtn") {
                        append(title)
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
             
                "a"("href" to navItem["url"]) {
                    append(title)
                }
            }
        }
    }
}