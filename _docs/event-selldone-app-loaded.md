## `selldone-app-loaded` Event

### Overview

The `selldone-app-loaded` event is dispatched to notify listeners that the Selldone application has finished loading. This can be useful to trigger other processes or hide loading interfaces once the application is ready.

### Emitting the Event

To signal that the Selldone app has finished loading, the following code is executed:

```javascript
const event = new Event("selldone-app-loaded");
document.dispatchEvent(event); // Dispatch the event.
```

### Listening for the Event

To perform actions once the `selldone-app-loaded` event has been dispatched, you can attach an event listener to the document:

```javascript
document.addEventListener("selldone-app-loaded", function (event) {
    // Code to be executed when the Selldone app has loaded
});
```

### Example: Hiding a Loading View

If you have an element (e.g., a loading spinner or screen) that you want to hide once the Selldone app has loaded, you can use the following script:

```javascript
<script>
    // Hide the loading view when the Selldone app has loaded
    document.addEventListener("selldone-app-loaded", function (event) {
        document.getElementById('first_loading_view').style.display = "none";
    });

    // Additionally, hide the loading view once all page contents are fully loaded
    document.onreadystatechange = () => {
        if (document.readyState === "complete") {
            document.getElementById('first_loading_view').style.display = "none";
        }
    }
</script>
```

In the above script:
- The first event listener hides the element with the id `first_loading_view` when the `selldone-app-loaded` event is dispatched.
- The `onreadystatechange` event also hides the same element, but it does so when the entire page (including all resources) has completely loaded. This provides a fallback to ensure the loading view is hidden even if the `selldone-app-loaded` event doesn't fire for any reason.
