fun makeNavBar(data: Any?): String {
    val list = data as? List<*>
    
  
    if (list == null) {
        return "<!-- Error: Navbar data is missing or invalid -->"
    }

    val sb = StringBuilder()
    sb.append("<nav class=\"site-nav\">")

    for (item in list) {
        val navItem = item as? Map<*, *> ?: continue
        val title = navItem["title"]?.toString() ?: "Untitled"
        val url = navItem["url"]?.toString() ?: "#"
        
        if (navItem.containsKey("children")) {
        
            sb.append("<div class=\"dropdown\">")
            sb.append("<button class=\"dropbtn\">$title</button>")
            sb.append("<div class=\"dropdown-content\">")
            
            val children = navItem["children"] as? List<*> ?: emptyList<Any>()
            for (childItem in children) {
                val child = childItem as? Map<*, *> ?: continue
                val childTitle = child["title"]?.toString() ?: "Untitled"
                val childUrl = child["url"]?.toString() ?: "#"
                sb.append("<a href=\"$childUrl\">$childTitle</a>")
            }
            
            sb.append("</div>") 
            sb.append("</div>") 
        } else {
 
            sb.append("<a href=\"$url\">$title</a>")
        }
    }

    sb.append("</nav>")
    return sb.toString()
}