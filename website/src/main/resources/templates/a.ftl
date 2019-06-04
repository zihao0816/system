<!DOCTYPE html>
<html>
<head lang="en">
    <title>Spring Boot Demo - FreeMarker</title>
    <link href="/static/css/index.css" rel="stylesheet">
    <script type="text/javascript" src="/jars/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="/static/css/js/index.js"></script>
</head>
<body>
<h2>首页<h2>

    <font>
    <#list userList as item>
    ${item!}<br />
    </#list>
    </font>

    <button class="a"> click me</button>
</body>
</html>