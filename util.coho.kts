fun makeNavBar(data: Any?): String {

    if (data == null) {
        println("MakeNavBar Error: Data passed in is strictly NULL.")
        return "<!-- Error: navBarData is NULL. Check if 'navbar-data.yaml' exists in the src folder -->"
    }


    var list = data as? List<*>


    //    We check if it is a Map, and if so, grab the first value that looks like a list.
    if (list == null && data is Map<*, *>) {
        list = data.values.firstOrNull { it is List<*> } as? List<*>
    }


    if (list == null) {
        return "<!-- Error: Data exists but is type ${data::class.simpleName}, not List. Content: $data -->"
    }

    return "nav"("class" to "site-nav") {
        for (item in list) {
            val navItem = item as? Map<*, *> ?: continue
            val title = navItem["title"]?.toString() ?: "Untitled"
            
            if (navItem.containsKey("children")) {

                "div"("class" to "dropdown") {
                    "button"("class" to "dropbtn") {
                        append(title)
                        
                        "i"("class" to "fa fa-caret-down") {} 
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