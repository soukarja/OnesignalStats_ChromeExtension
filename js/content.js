chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    if (window.location.href.includes("app.onesignal.com/apps")) {
      window.open("https://app.onesignal.com/stats", "_self");
      window.location.href = "https://app.onesignal.com/stats";
    } else {
      alert("This Extension will only work on the Onesignal Dashboard");
    }
  }
});

if (window.location.href == "https://app.onesignal.com/stats") getData();
else if (window.location.href == "https://app.onesignal.com/stats1") getData(1);
else if (window.location.href == "https://app.onesignal.com/stats2") getData(2);
else if (window.location.href == "https://app.onesignal.com/stats3") getData(3);
else if (window.location.href == "https://app.onesignal.com/stats4") getData(4);
else if (window.location.href == "https://app.onesignal.com/stats5") getData(5);
else if (window.location.href == "https://app.onesignal.com/stats6") getData(6);
else if (!window.location.href.includes("app.onesignal.com/apps")) getData(3);

function getData(sortmethod = 3) {
  document.title = "Loading Stats...";
  document.body.innerHTML =
    "<font color='red'>Loading Stats... Please Wait</font>";
  $.get("https://app.onesignal.com/unified/apps?view=stats", function (data) {
    // console.log(data);
    var link = document.createElement("link");
    link.href = chrome.extension.getURL("css/main.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    document.body.innerHTML = "";
    if (data.success) {
      document.title = "App Stats";

      var objectValues = data.payload.items;

      var container = document.createElement("div");
      container.className = "onesignal_stats";

      var tempRow = document.createElement("div");
      tempRow.className = "rows";

      var tempSpan = document.createElement("a");
      tempSpan.innerText = "App Name";
      tempSpan.href = "https://app.onesignal.com/stats1";
      if (sortmethod == 1) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      tempSpan = document.createElement("a");
      tempSpan.innerText = "Total Downloads";
      tempSpan.href = "https://app.onesignal.com/stats2";
      if (sortmethod == 2) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      tempSpan = document.createElement("a");
      tempSpan.innerText = "Avg Monthly Downloads";
      tempSpan.href = "https://app.onesignal.com/stats3";
      if (sortmethod == 3) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      tempSpan = document.createElement("a");
      tempSpan.innerText = "Avg Daily Downloads";
      tempSpan.href = "https://app.onesignal.com/stats4";
      if (sortmethod == 4) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      tempSpan = document.createElement("a");
      tempSpan.innerText = "24H Downloads";
      tempSpan.href = "https://app.onesignal.com/stats5";
      if (sortmethod == 5) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      tempSpan = document.createElement("a");
      tempSpan.innerText = "% Change";
      tempSpan.href = "https://app.onesignal.com/stats6";
      if (sortmethod == 6) tempSpan.className = "selected";
      tempRow.appendChild(tempSpan);

      container.appendChild(tempRow);

      document.body.appendChild(container);

      if (sortmethod == 1) {
        objectValues.sort((a, b) => (a.name > b.name ? 1 : -1));
      } else if (sortmethod == 2) {
        objectValues.sort((a, b) => (a.user_count < b.user_count ? 1 : -1));
      } else if (sortmethod == 3) {
        objectValues.sort((a, b) =>
          a.estimated_monthly_active_user_count <
          b.estimated_monthly_active_user_count
            ? 1
            : -1
        );
      } else if (sortmethod == 4) {
        objectValues.sort((a, b) =>
          a.estimated_monthly_active_user_count /
            a.cumulative_monthly_data.length <
          b.estimated_monthly_active_user_count /
            b.cumulative_monthly_data.length
            ? 1
            : -1
        );
      } else if (sortmethod == 5) {
        objectValues.sort((a, b) =>
          a.cumulative_monthly_data[a.cumulative_monthly_data.length - 1] -
            a.cumulative_monthly_data[a.cumulative_monthly_data.length - 2] <=
          b.cumulative_monthly_data[b.cumulative_monthly_data.length - 1] -
            b.cumulative_monthly_data[b.cumulative_monthly_data.length - 2]
            ? 1
            : -1
        );
      } else if (sortmethod == 6) {
        objectValues.sort((a, b) =>
          a.user_percentage_change < b.user_percentage_change ? 1 : -1
        );
      }
      showTable(objectValues);
    } else {
      alert("Cannot Connect to Onesignal");
      document.body.innerHTML =
        "<font color='red'>Cannot Connect to Onesignal</font>";
    }
  });
}
function clearTable() {
  var list = document.querySelectorAll(".onesignal_stats > .rows");
  var count = 0;
  list.forEach(function (data) {
    if (count > 0) {
      data.remove();
    }
    count++;
  });
}

function showTable(objectValues) {
  var content = "";
  var totalDownloads = 0;
  var totalApps = 0;
  var totalAvgMonthly = 0;
  var totalAvgDaily = 0;
  var total24H = 0;
  var total24HPast = 0;
  var totalPercChange = 0;

  objectValues.forEach(function (value) {
    var name = value.name;
    var user_count = value.user_count;
    var estimated_monthly_active_user_count =
      value.estimated_monthly_active_user_count;

    if (user_count > 0) {
      totalApps++;
      totalDownloads += user_count;
      totalAvgMonthly += estimated_monthly_active_user_count;
      totalAvgDaily += Math.round(
        estimated_monthly_active_user_count /
          value.cumulative_monthly_data.length
      );
      total24HPast +=
        value.cumulative_monthly_data[
          value.cumulative_monthly_data.length - 2
        ] -
        value.cumulative_monthly_data[value.cumulative_monthly_data.length - 3];

      total24H +=
        value.cumulative_monthly_data[
          value.cumulative_monthly_data.length - 1
        ] -
        value.cumulative_monthly_data[value.cumulative_monthly_data.length - 2];

      totalPercChange += Math.round(value.user_percentage_change * 100) / 100;

      content += `<div class="rows">
          <span>${name}</span>
          <span>${formatNumber(user_count)}</span>
          <span>${formatNumber(estimated_monthly_active_user_count)}+</span>
          <span>${formatNumber(
            Math.round(
              estimated_monthly_active_user_count /
                value.cumulative_monthly_data.length
            )
          )}+</span>
          <span>${formatNumber(
            value.cumulative_monthly_data[
              value.cumulative_monthly_data.length - 2
            ] -
              value.cumulative_monthly_data[
                value.cumulative_monthly_data.length - 3
              ]
          )} (${formatNumber(
        value.cumulative_monthly_data[
          value.cumulative_monthly_data.length - 1
        ] -
          value.cumulative_monthly_data[
            value.cumulative_monthly_data.length - 2
          ]
      )})</span>
          <span>${Math.round(value.user_percentage_change * 100) / 100}%</span>
      </div>`;
    }
  });

  content += `<div class="rows total">
          <span>Total (${formatNumber(totalApps)} apps)</span>
          <span>${formatNumber(totalDownloads)}</span>
          <span>${formatNumber(Math.round(totalAvgMonthly / totalApps))}+</span>
          <span>${formatNumber(Math.round(totalAvgDaily / totalApps))}+</span>
          <span>${formatNumber(total24HPast)} (${formatNumber(total24H)})</span>
          <span>${Math.round(totalPercChange / totalApps)}%</span>
      </div>`;

  document.querySelector(".onesignal_stats").innerHTML =
    document.querySelector(".onesignal_stats").innerHTML + content;
}

function formatNumber(number) {
  if (number < 1000) return number;

  if (number < 1000000) {
    var temp = Math.round(number / 100) / 10;
    return temp + "K";
  }

  var temp = Math.round(number / 100000) / 10;
  return temp + "M";
}
