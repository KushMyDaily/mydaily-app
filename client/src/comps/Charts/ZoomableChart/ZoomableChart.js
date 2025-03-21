import ReactApexChart from "react-apexcharts";
import { format } from "date-fns";

const ZoomableChart = ({ data, factor }) => {
  const getHeadingByKey = (key) => {
    switch (key) {
      case "workload":
        return "Workload";
      case "autonomy":
        return "Autonomy";
      case "communication":
        return "Communication";
      case "relationship":
        return "Relationships";
      case "timeBoundaries":
        return "Time Boundaries";
      default:
        return "";
    }
  };

  const formattedData = data.map((item) => ({
    x: new Date(item.createdAt),
    y: item[factor],
  }));

  const options = {
    chart: {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        tools: {
          pan: false, // Disables the hand icon (pan tool)
        },
        autoSelected: "zoom",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (value) => format(new Date(value), "MM/dd"),
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: getHeadingByKey(factor),
      align: "left",
    },
  };

  const series = [
    {
      name: factor,
      data: formattedData,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
      width={500}
    />
  );
};

export default ZoomableChart;
