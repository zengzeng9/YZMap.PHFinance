window.host = location.origin
window.api = "/"
function fluttercCallJSForLocation(argc){
    window.$app.$emit("locate",argc)
}