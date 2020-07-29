// alert("Data Updated. There is no newer data.")

const ctx = document.getElementById("myChart").getContext("2d");

var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
gradient1.addColorStop(0, "rgba(147,142,245,1)");
gradient1.addColorStop(0.3, "rgba(122,199,238,1)");
gradient1.addColorStop(1, "rgba(147,142,245,0)");




$.get("/getsomething",(data)=>{
const chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "line",
  responsive: true,
  maintainAspectRatio: false,
  // The data for our dataset
  data: {
    labels: data.timestamps,
    datasets: [
      {
        label: "Price(K)",
        backgroundColor: gradient1,
        borderColor: "rgba(147,142,245,1)",
        borderWidth: 2,
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        pointHoverBackgroundColor: "#505790",
        pointHoverBorderColor: "rgba(122,199,238,1)",
        data: data.prices,
      },
    ],
  },

  // Configuration options go here
  options: {
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    legend: {
      display: false,
    },
    animation: {
      duration: 1000,
    },
    scales: {
      yAxes: [
        {
          position: "right",
          ticks: {
            stepSize: 0.2,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        }
      ],
    },
  },
});
});
