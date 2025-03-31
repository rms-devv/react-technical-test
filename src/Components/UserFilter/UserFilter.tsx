import React from "react";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import { useUsersStore } from "../../Store/userStore";

const UserFilter: React.FC = () => {
  const { users, hiddenUsers, toggleUserVisibility, showAllUsers, hideAllUsers } = useUsersStore();

  // Je convertis l'objet users en tableau pour le traitement
  const usersList = Object.values(users);

  // S'il n'y a pas d'utilisateurs, je n'affiche pas le filtre
  if (usersList.length === 0) {
    return null;
  }

  // Ici j'ai liste des utilisateurs visibles
  const visibleUsers = usersList.filter((user) => !hiddenUsers.has(user.login));

  const selectText =
    visibleUsers.length === 0
      ? "Aucun utilisateur affiché"
      : visibleUsers.length === usersList.length
        ? "Tous les utilisateurs"
        : `${visibleUsers.length} utilisateur(s) affiché(s)`;

  return (
    <Box sx={{ mb: 2, mt: 2 }}>
      <Typography level="body-sm" sx={{ mb: 1 }}>
        Filtrer les messages par utilisateur:
      </Typography>
      <Select
        placeholder="Filtrer"
        value={[]}
        multiple
        indicator={null}
        renderValue={() => <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>{selectText}</Box>}
        slotProps={{
          listbox: {
            sx: {
              width: "300px",
              maxWidth: "100vw",
            },
          },
        }}
        sx={{ width: "40%" }}
      >
        <MenuItem onClick={showAllUsers} sx={{ width: "100%" }}>
          <Typography level="body-sm" fontWeight="bold">
            Afficher tous les utilisateurs
          </Typography>
        </MenuItem>
        <MenuItem onClick={hideAllUsers} sx={{ width: "100%" }}>
          <Typography level="body-sm" fontWeight="bold">
            Masquer tous les utilisateurs
          </Typography>
        </MenuItem>
        <ListDivider />
        {usersList.map((user) => {
          const isHidden = hiddenUsers.has(user.login);
          return (
            <Option
              key={user.login}
              value={user.login}
              onClick={() => toggleUserVisibility(user.login)}
              sx={{ width: "100%" }}
            >
              <ListItemDecorator>
                <Avatar size="sm" src={user.avatar_url} />
              </ListItemDecorator>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "calc(100% - 60px)",
                }}
              >
                <Typography level="body-sm" noWrap sx={{ maxWidth: "150px" }}>
                  {user.login}
                </Typography>
                <Chip size="sm" variant="soft" color={isHidden ? "neutral" : "primary"}>
                  {user.messageCount}
                </Chip>
              </Box>
              <Box sx={{ ml: 1, minWidth: "20px", textAlign: "center" }}>{isHidden ? "☐" : "☑"}</Box>
            </Option>
          );
        })}
      </Select>
    </Box>
  );
};

export default UserFilter;
