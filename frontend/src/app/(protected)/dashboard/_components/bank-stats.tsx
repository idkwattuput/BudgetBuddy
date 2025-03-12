"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useEffect, useState } from "react";
import SkeletonWrapper from "@/components/skeleton-wrapper";

interface BankStats {
  bank_name: string;
  amount: number;
  fill?: string;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export default function BankStats() {
  const axiosPrivate = useAxiosPrivate();
  const [bankStats, setBankStats] = useState<BankStats[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [loading, setLoading] = useState(true);

  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  useEffect(() => {
    async function getBankStats() {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/api/v1/transactions/bank");

        // Generate chart config
        const config: ChartConfig = {};
        response.data.data.forEach((bank: BankStats) => {
          const key = bank.bank_name.toLowerCase()
          config[key] = { label: bank.bank_name.toLowerCase(), color: getRandomColor() };
        });

        setChartConfig(config);

        // Set bank stats with assigned colors
        setBankStats(
          response.data.data.map((bank: BankStats) => ({
            bank_name: bank.bank_name.toLowerCase(),
            amount: Number(bank.amount),
            fill: config[bank.bank_name.toLowerCase()]?.color,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching bank stats:", error);
        setLoading(false);
      }
    }

    getBankStats();
  }, []);

  if (loading) {
    return (
      <SkeletonWrapper isLoading={loading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Fetching bank statistics...</CardDescription>
          </CardHeader>
          <CardContent>Loading...</CardContent>
        </Card>
      </SkeletonWrapper>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                hideLabel />}
            />
            <Pie
              data={bankStats}
              dataKey="amount"
              nameKey="bank_name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {bankStats.reduce((sum: number, item: BankStats) => sum + Number(item.amount), 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expense
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="bank_name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
