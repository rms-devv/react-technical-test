import React from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Avatar from "@mui/joy/Avatar";
import LabelIcon from "@mui/icons-material/Label";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { getContrastText } from "../../../utils/getContrastText";
import { User } from "../../../../types/User";

type TimelineEventProps = {
  event: string;
  actor?: User;
  created_at: string;
  label?: {
    name: string;
    color: string;
  };
  state?: string;
};

export default function TimelineEvent({ event, actor, created_at, label }: TimelineEventProps) {
  const formattedDate = new Date(created_at).toLocaleDateString();

  // Si il n'y a pas de user login alors j'affiche "Utilisateur inconnu"
  const actorName = actor?.login || "Utilisateur inconnu";
  const actorAvatar = actor?.avatar_url;

  let content = null;
  let icon = null;

  switch (event) {
    case "labeled":
      icon = <LabelIcon />;
      content = (
        <>
          <Typography level="body-sm" fontWeight="bold">
            {actorName} a ajouté le label
          </Typography>
          {label && (
            <Chip
              size="sm"
              sx={{
                backgroundColor: `#${label.color || "000000"}`,
                color: getContrastText(label.color || "000000"),
              }}
            >
              {label.name}
            </Chip>
          )}
        </>
      );
      break;

    case "unlabeled":
      icon = <LabelIcon />;
      content = (
        <>
          <Typography level="body-sm" fontWeight="bold">
            {actorName} a retiré le label
          </Typography>
          {label && (
            <Chip
              size="sm"
              sx={{
                backgroundColor: `#${label.color || "000000"}`,
                color: getContrastText(label.color || "000000"),
              }}
            >
              {label.name}
            </Chip>
          )}
        </>
      );
      break;

    case "closed":
      icon = <ErrorIcon color="error" />;
      content = (
        <Typography level="body-sm" fontWeight="bold">
          {actorName} a fermé cette issue
        </Typography>
      );
      break;

    case "reopened":
      icon = <CheckCircleIcon color="success" />;
      content = (
        <Typography level="body-sm" fontWeight="bold">
          {actorName} a réouvert cette issue
        </Typography>
      );
      break;

    default:
      content = (
        <Typography level="body-sm" fontWeight="bold">
          {actorName} a effectué l'action "{event}"
        </Typography>
      );
  }

  return (
    <Stack direction="row" spacing={2} sx={{ my: 1 }}>
      <Avatar size="sm" src={actorAvatar} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
          borderRadius: "md",
          bgcolor: "background.level2",
          width: "100%",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", gap: 1 }}>{content}</Box>
          <Typography level="body-xs">{formattedDate}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
