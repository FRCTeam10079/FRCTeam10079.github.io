fun makeNavBar(data: Any?): String {
    val dataType = if (data == null) "NULL (File might be missing or empty)" else data::class.java.name
    val dataContent = data.toString()

    var list = data as? List<*>

    if (list == null && data is Map<*, *>) {
        list = data.values.firstOrNull { it is List<*> } as? List<*>
    }

    if (list == null) {
        return """
            <div style="background-color: #ffcccc; color: #cc0000; padding: 10px; border: 2px solid red; font-family: monospace; font-size: 12px; z-index:9999; position: relative;">
                <strong>NAVBAR ERROR:</strong><br/>
                <strong>Received Type:</strong> $dataType<br/>
                <strong>Content:</strong> $dataContent
            </div>
        """.trimIndent()
    }

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