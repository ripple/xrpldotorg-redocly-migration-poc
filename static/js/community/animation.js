function networkNodeAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("networkNode"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: networkNodeLight,
  });
}

function networkNodeSmallAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("networkNode-small"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: networkNodeLight,
  });
}
function xrplGrantsAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("xrplGrantsDark"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: xrplGrantsDark,
  });
}

function xrplGrantsSmallAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("xrplGrantsDark-small"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: xrplGrantsDark,
  });
}
function careersAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("careersDark"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: careersDark,
  });
}

function careersSmallAnimation() {
  bodymovin.loadAnimation({
    container: document.getElementById("careersDark-small"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: careersDark,
  });
}
careersAnimation();
careersSmallAnimation();
xrplGrantsAnimation();
xrplGrantsSmallAnimation();
networkNodeSmallAnimation();
networkNodeAnimation();
