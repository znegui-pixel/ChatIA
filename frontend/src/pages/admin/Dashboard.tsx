import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Typography } from "@mui/material";

export default function Dashboard() {
  const [perTag, setPerTag] = useState([]);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    axios.get("/admin/analytics/questions-per-tag").then((r) => setPerTag(r.data));
    axios.get("/admin/analytics/daily-volume").then((r) => setDaily(r.data));
  }, []);

  return (
    <>
      <Typography variant="h5">Questions par tag</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={perTag}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h5" mt={4}>Volume quotidien</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={daily}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line dataKey="count" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
