"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";

export default function DashboardMetricSection({ data }: { data?: any }) {
  const dashboardMetricsData = [
    {
      id: 0,
      label: "Number of pets",
      value: data.length,
    },
    {
      id: 1,
      label: "Number of matches",
      value: 0,
    },
    {
      id: 2,
      label: "Completed adoptions",
      value: 0,
    },
    {
      id: 3,
      label: "Ongoing adoptions",
      value: 0,
    },
  ];
  return (
    <div className="flex flex-row flex-wrap items-center justify-center w-full gap-12">
      {dashboardMetricsData.map((metric) => (
        <Card key={metric.id} className="w-[200px] h-[120px]" shadow="sm">
          <CardBody className="flex items-center justify-center">
            <div className="flex flex-col items-start justify-center ">
              <p>{metric.label}</p>
              <p className="font-semibold">{metric.value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
