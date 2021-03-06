
var ExPanels = (function() {
  // Init variables
  var totalPanels = document.getElementsByClassName('exPan').length;
  var defaultOpenPanel = 0; //leave 0 for no panel open
  var accordian = true; //set panels to behave like an accordian, with one panel only ever open at once
  var panelHeight = [];
  var currentPanel = defaultOpenPanel;
  var iconHeight = parseInt(window.getComputedStyle(document.getElementsByClassName('icon-close-open')[0]).getPropertyValue('height'), 10);
  var highlightOpen = true;

  return {
    resetPanels: function() {
      for (var i = 1; i <= totalPanels; i += 1) {
        if (currentPanel != i.toString()) {
          document.getElementById('cp-' + i + '-icon').setAttribute("style", "background-position: 0px 0px;");
          document.getElementById('cp-' + i + '-exPanCont').setAttribute("style", "margin-top: -" + panelHeight[i] + "px;")
          if (highlightOpen) {
            document.getElementById('cp-' + i + '-exPanHead').classList.remove("header-active");
          }
        }
      }
    },
    init: function() {
      for (var i = 1; i <= totalPanels; i += 1) {
        var thisPanel = document.getElementById("cp-" + i + "-exPanCont");
        panelHeight[i] = parseInt(window.getComputedStyle(thisPanel).height, 10);
        thisPanel.setAttribute("style", "margin-top: " + -panelHeight[i] + ";");
        if (defaultOpenPanel === i) {
          document.getElementById('cp-' + i + '-icon').setAttribute("style", "background-position: 0px -" + iconHeight + "px;");
          thisPanel.setAttribute("style", "margin-top: 0;");
        }
      }

      // init user count value for each panel
      for (var k = 1; k <= totalPanels; k += 1) {
        document.getElementById("cp-" + k.toString() + "-panCnt").value = 0;
        document.getElementById("cp-" + k +  "-exPanHead").addEventListener("click", ExPanels.panelClick);
      }
    },
    panelClick: function() {
      var objid = this.id.split('-')[1];
      currentPanel = objid;
      if (accordian) {
        ExPanels.resetPanels();
      }

      var contentPanel = document.getElementById('cp-' + objid + '-exPanCont');
      if (parseInt(window.getComputedStyle(contentPanel).getPropertyValue('margin-top'), 10) <= -panelHeight[objid]) {
        // open panel
        document.getElementById('cp-' + objid + '-icon').setAttribute("style", "background-position: 0px -" + iconHeight + "px;");
        contentPanel.setAttribute("style", "margin-top: 0px;")
        if (highlightOpen) {
          document.getElementById('cp-' + currentPanel + '-exPanHead').classList.add("header-active");
        }
      } else {
        // close panel
        document.getElementById('cp-' + objid + '-icon').setAttribute("style", "background-position: 0px 0px;");
        contentPanel.setAttribute("style", "margin-top: -" + panelHeight[objid] + "px;")
        if (highlightOpen) {
          document.getElementById('cp-' + currentPanel + '-exPanHead').classList.remove("header-active");
        }
      }
    }
  };
}());


window.onresize = ExPanels.init;
window.onload = ExPanels.init;
