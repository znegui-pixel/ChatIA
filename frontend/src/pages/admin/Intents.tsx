import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

export default function Intents() {
  const [list, setList] = useState([]);
  const [tag, setTag] = useState("");
  const [patterns, setPatterns] = useState("");
  const [responses, setResponses] = useState("");

  useEffect(() => {
    axios.get("/admin/intents").then((res) => setList(res.data));
  }, []);

  const addIntent = async () => {
    await axios.post("/admin/intents", {
      tag,
      patterns: patterns.split("\n").filter(Boolean),
      responses: responses.split("\n").filter(Boolean),
    });
    setTag(""); setPatterns(""); setResponses("");
    const res = await axios.get("/admin/intents");
    setList(res.data);
  };

  return (
    <Box>
      <Typography variant="h5">Ajouter une intent</Typography>
      <Box display="flex" gap={2} my={2}>
        <TextField label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        <TextField multiline label="Patterns" value={patterns} onChange={(e) => setPatterns(e.target.value)} />
        <TextField multiline label="Responses" value={responses} onChange={(e) => setResponses(e.target.value)} />
        <Button variant="contained" onClick={addIntent}>Ajouter</Button>
      </Box>

      <Typography variant="h6">Intents existantes</Typography>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </Box>
  );
}
