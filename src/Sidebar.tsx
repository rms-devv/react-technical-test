// src/components/Sidebar.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import { useIssueStore } from "./Context/issueStore";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { issueUrl, setIssueUrl } = useIssueStore();
  const [inputValue, setInputValue] = useState<string>(issueUrl);


  // Fonction pour gérer les changements dans le champ de saisie
  // Cette fonction met à jour l'état local inputValue
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = () => {
    const regex = /^[^/]+\/[^/]+\/issues\/\d+$/;
    if (regex.test(inputValue)) {
      setIssueUrl(inputValue);
      toast("URL d'issue mise à jour avec succès");
    } else {
      toast("Format invalide. Utilisez le format: owner/repo/issues/number");
    }
  };

  // Fonction pour gérer l'événement de touche
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
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
    </Sheet>
  );
}
