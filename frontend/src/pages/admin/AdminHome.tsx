import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Card, CardContent, Grid, Avatar
} from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { People, Lightbulb, QuestionAnswer, EmojiEmotions } from "@mui/icons-material";

const COLORS = ["#00C49F", "#FF8042"];

const StatCard = ({ icon, label, value, color, bgcolor }) => (
  <Card
    sx={{
      height: 280,
      borderRadius: 4,
      p: 4,
      backgroundColor: bgcolor,
      color: "#fff",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <Avatar sx={{ bgcolor: "#fff", color: bgcolor, width: 80, height: 80, mb: 2 }}>
      {icon}
    </Avatar>
    <Typography variant="h6" gutterBottom>{label}</Typography>
    <Typography variant="h3" fontWeight="bold">{value}</Typography>
  </Card>
);

const AdminHome = () => {
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalIntents: 0,
    totalQuestions: 0,
    usersPerRole: { admin: 0, user: 0 },
    satisfactionRate: 0
  });
  const [chatStats, setChatStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const globalRes = await axios.get("http://localhost:5000/api/v1/stats/global");
        const dailyVolumeRes = await axios.get("http://localhost:5000/api/v1/stats/daily-volume");

        setGlobalStats(globalRes.data);
        setChatStats(
          dailyVolumeRes.data.map(d => ({
            date: d._id,
            messages: d.count
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };

    fetchStats();
  }, []);

  const usersStats = [
    { name: "Users", value: globalStats.usersPerRole?.user || 0 },
    { name: "Admins", value: globalStats.usersPerRole?.admin || 0 }
  ];

  const satisfactionStats = [
    { name: "Satisfaits", value: globalStats.satisfactionRate || 0 },
    { name: "Insatisfaits", value: 100 - (globalStats.satisfactionRate || 0) }
  ];

  return (
    <Box sx={{ p: 5, bgcolor: "#f4f6fa", minHeight: "100vh" }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center" color="#2958a3">
        Dashboard Admin
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={5} mb={10} justifyContent="center">
      <Grid item xs={12} md={6} lg={4}>
          <StatCard
            icon={<People fontSize="large" />}
            label="Total Utilisateurs"
            value={globalStats.totalUsers}
            color="#fff"
            bgcolor="#2958a3"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatCard
            icon={<Lightbulb fontSize="large" />}
            label="Total Intents"
            value={globalStats.totalIntents}
            color="#fff"
            bgcolor="#38c1ed"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatCard
            icon={<QuestionAnswer fontSize="large" />}
            label="Total Questions"
            value={globalStats.totalQuestions}
            color="#fff"
            bgcolor="#00c49f"
          />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={8} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 3 }} textAlign="center" color="#2958a3">
            Répartition Utilisateurs
          </Typography>
          <Box display="flex" justifyContent="center">
            <PieChart width={400} height={400}>
              <Pie data={usersStats} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value" label>
                {usersStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 3 }} textAlign="center" color="#2958a3">
            Messages envoyés par jour
          </Typography>
          <Box display="flex" justifyContent="center">
            <BarChart width={500} height={400} data={chatStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" fill="#38c1ed" />
            </BarChart>
          </Box>
        </Grid>

        {/* Taux de satisfaction */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 3 }} textAlign="center" color="#2958a3">
            Taux de satisfaction des utilisateurs
          </Typography>
          <Box display="flex" justifyContent="center">
            <PieChart width={400} height={400}>
              <Pie
                data={satisfactionStats}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                <Cell fill="#00C49F" />
                <Cell fill="#FF4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;
