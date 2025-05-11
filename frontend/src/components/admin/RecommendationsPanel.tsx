import React from 'react';
import {
Box, Typography, List, ListItem,
ListItemIcon, ListItemText, Chip,
Button, Divider, Collapse
} from '@mui/material';
import {
Error as ErrorIcon,
Warning as WarningIcon,
Info as InfoIcon,
ExpandMore as ExpandMoreIcon,
ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const priorityIcons = {
HIGH: <ErrorIcon color="error" />,
MEDIUM: <WarningIcon color="warning" />,
LOW: <InfoIcon color="info" />
};

const recommendationTypes = {
MISSING_INTENT: {
title: "Intent Manquante",
description: "Ces questions fréquentes n'ont pas de bonne réponse",
color: "error"
},
IMPROVE_INTENT: {
title: "Amélioration d'Intent",
description: "Ces intents pourraient être améliorées",
color: "warning"
}
};

export const RecommendationsPanel = ({ recommendations }) => {
const [expanded, setExpanded] = React.useState({});

const toggleExpand = (id) => {
setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
};

return (
<Box>
<Typography variant="h6" gutterBottom>
Recommandations du Système
</Typography>

<List>
{recommendations.map((rec, index) => (
<React.Fragment key={index}>
<ListItem
button
onClick={() => toggleExpand(index)}
sx={{
bgcolor: 'background.paper',
mb: 1,
borderRadius: 1
}}
>
<ListItemIcon>
{priorityIcons[rec.priority]}
</ListItemIcon>
<ListItemText
primary={
<Box sx={{ display: 'flex', alignItems: 'center' }}>
<Chip
label={recommendationTypes[rec.type].title}
color={recommendationTypes[rec.type].color}
size="small"
sx={{ mr: 2 }}
/>
{rec.tag}
</Box>
}
secondary={`${rec.count} occurrences`}
/>
{expanded[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
</ListItem>

<Collapse in={expanded[index]} timeout="auto" unmountOnExit>
<Box sx={{ pl: 9, pr: 2, pb: 2 }}>
<Typography variant="body2" paragraph>
{recommendationTypes[rec.type].description}
</Typography>

{rec.type === 'MISSING_INTENT' && rec.sampleQuestions && (
<>
<Typography variant="subtitle2">
Exemples de questions:
</Typography>
<ul>
{rec.sampleQuestions.map((q, i) => (
<li key={i}>
<Typography variant="body2">{q}</Typography>
</li>
))}
</ul>
</>
)}

{rec.type === 'IMPROVE_INTENT' && (
<Typography variant="subtitle2">
Confiance moyenne: {(rec.avgConfidence * 100).toFixed(1)}%
</Typography>
)}

<Box sx={{ mt: 2 }}>
<Button
variant="outlined"
size="small"
sx={{ mr: 2 }}
>
Voir les détails
</Button>
<Button
variant="contained"
size="small"
color="primary"
>
Prendre en charge
</Button>
</Box>
</Box>
</Collapse>

<Divider sx={{ my: 1 }} />
</React.Fragment>
))}
</List>
</Box>
);
};