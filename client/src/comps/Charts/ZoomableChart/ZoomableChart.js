import ReactApexChart from "react-apexcharts";
import { format } from "date-fns";

const ZoomableChart = ({ data, factor }) => {
  const formattedData = data.map((item) => ({
    x: new Date(item.createdAt),
    y: item[factor],
  }));

  const options = {
    chart: {
      //type: "line",
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        // MM/dd/yyyy
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
      text: "WellBeing Factor",
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
