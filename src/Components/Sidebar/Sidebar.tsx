// src/components/Sidebar.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";

import { toast } from "react-toastify";

import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import { useIssueStore } from "../../Store/issueStore";
import { useUsersStore } from "../../Store/userStore";
import UserFilter from "../UserFilter/UserFilter";


export default function Sidebar() {
  const { issueUrl, setIssueUrl } = useIssueStore();
  const [inputValue, setInputValue] = useState<string>(issueUrl);
  const { users } = useUsersStore();

  // Je transforme mon objet users en tableau pour pouvoir le trier
  const usersList = Object.values(users).sort((a, b) =>
    b.messageCount - a.messageCount // Je trie par nombre de messages décroissant
  );

  // Fonction pour gérer les changements dans le champ de saisie
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = () => {
    const regex = /^[^/]+\/[^/]+\/issues\/\d+$/;
    if (regex.test(inputValue)) {
      setIssueUrl(inputValue);
      toast.success("URL d'issue mise à jour avec succès");
    } else {
      toast.error("Format invalide. Utilisez le format: owner/repo/issues/number");
    }
  };

  // Fonction pour gérer l'événement de touche
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: "sticky",
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="owner/repo/issues/number"
          sx={{ flexGrow: 1 }}
        />
        <Button onClick={handleSubmit}>Charger</Button>
      </div>

      {usersList.length > 0 && <UserFilter />}

      {/* J'affiche la liste des utilisateurs uniquement si j'en ai */}
      {usersList.length > 0 && (
        <>
          <Divider sx={{ my: 1 }}>Participants ({usersList.length})</Divider>
          <List>
            {usersList.map((user) => (
              <ListItem key={user.login}>
                <ListItemDecorator>
                  <Avatar
                    size="sm"
                    src={user.avatar_url}
                    alt={user.login}
                  />
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="body-sm">{user.login}</Typography>
                </ListItemContent>
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                >
                  {user.messageCount}
                </Chip>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Sheet>
  );
}
