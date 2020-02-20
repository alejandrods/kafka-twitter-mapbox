// Load Loading Animation
var lottieAnimation = bodymovin.loadAnimation({
  container: document.getElementById('anim'),
  path: '../static/resources/Twitter_Anim.json',
  renderer: 'svg',
  loop: true,
  autoplay: true,
})

//// Redirect Function
//function redirectIt(obj){
//    var goToLink = obj.getAttribute("href");
//    window.location.href=goToLink;
//}