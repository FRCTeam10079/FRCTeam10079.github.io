
fun makeNavBar(data: Any?): String {

    val menuItems = listOf(
        mapOf("title" to "Home", "url" to "index.html"),
        mapOf("title" to "About Us", "children" to listOf(
            mapOf("title" to "Our Team", "url" to "team.html"),
            mapOf("title" to "Calendar & Schedule", "url" to "calendar.html"),
            mapOf("title" to "Organization Chart (PDF)", "url" to "#"),
            mapOf("title" to "Baseline Schedule (PDF)", "url" to "#")
        )),
        mapOf("title" to "Media", "children" to listOf(
            mapOf("title" to "Events & Results", "url" to "events.html"),
            mapOf("title" to "Newsletters", "url" to "#")
        )),
        mapOf("title" to "Resources", "url" to "resources.html"),
        mapOf("title" to "Support", "children" to listOf(
            mapOf("title" to "Donate", "url" to "donate.html"),
            mapOf("title" to "Contact Us", "url" to "contact.html")
        ))
    )


    val sb = StringBuilder()
    sb.append("<nav class=\"site-nav\">")

    for (item in menuItems) {
        val navItem = item as Map<String, Any>
        val title = navItem["title"].toString()
        
        if (navItem.containsKey("children")) {
          
            sb.append("<div class=\"dropdown\">")
            sb.append("<button class=\"dropbtn\">").append(title).append("</button>")
            sb.append("<div class=\"dropdown-content\">")
            
            val children = navItem["children"] as List<Map<String, Any>>
            for (child in children) {
                val childTitle = child["title"].toString()
                val childUrl = child["url"].toString()
                sb.append("<a href=\"").append(childUrl).append("\">").append(childTitle).append("</a>")
            }
            sb.append("</div></div>")
        } else {
          
            val url = navItem["url"].toString()
            sb.append("<a href=\"").append(url).append("\">").append(title).append("</a>")
        }
    }

    sb.append("</nav>")
    return sb.toString()
}