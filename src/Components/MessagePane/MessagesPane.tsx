import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "../ChatBubble/ChatBubble";
import useFetch from "../../useFetch";
import { useIssueStore } from "../../Store/issueStore";
import { useEffect } from "react";
import { useUsersStore } from "../../Store/userStore";
import { GITHUB_API_URL } from "../../Config";

type User = {
  login: string;
  avatar_url: string;
};

type Issue = {
  id: number;
  created_at: string;
  user: User;

  number: number;
  title: string;
  body: string;
  comments_url: string;
};

type Comment = {
  id: number;
  created_at: string;
  user: User;

  body: string;
};

export default function MessagesPane() {
  const { issueUrl } = useIssueStore();
  const { addUser, incrementMessageCount, resetUsers, isUserHidden } = useUsersStore();

  const issue = useFetch<Issue>({
    url: `${GITHUB_API_URL}/${issueUrl}`
  });

  const comments = useFetch<Comment[]>(
    { url: issue.data?.comments_url },
    { enabled: issue.isFetched }
  );

  // Je réinitialise les utilisateurs quand on change d'issue
  useEffect(() => {
    resetUsers();
  }, [issueUrl, resetUsers]);

  // J'ajoute l'auteur de l'issue et j'incrémente son compteur
  useEffect(() => {
    if (issue.data) {
      const { login, avatar_url } = issue.data.user;
      addUser(login, avatar_url);
      incrementMessageCount(login);
    }
  }, [issue.data, addUser, incrementMessageCount]);

  // J'ajoute les auteurs des commentaires et j'incrémente leurs compteurs
  useEffect(() => {
    if (comments.data) {
      comments.data.forEach(comment => {
        const { login, avatar_url } = comment.user;
        addUser(login, avatar_url);
        incrementMessageCount(login);
      });
    }
  }, [comments.data, addUser, incrementMessageCount]);

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {issue.data && (
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.body",
          }}
          py={{ xs: 2, md: 2 }}
          px={{ xs: 1, md: 2 }}
        >
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
            endDecorator={
              <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{
                  borderRadius: "sm",
                }}
              >
                #{issue.data?.number}
              </Chip>
            }
          >
            {issue.data.title}
          </Typography>
          <Typography level="body-sm">{issue.data.user.login}</Typography>
        </Stack>
      )}
      {comments.data && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          {/* J'affiche l'issue seulement si son auteur n'est pas filtré */}
          {issue.data && !isUserHidden(issue.data.user.login) && (
            <ChatBubble variant="solid" {...issue.data} />
          )}

          {/* Ici j'affiche les messages des utilisateurs selon si ils sont séléctionnés */}
          {comments.data
            .filter(comment => !isUserHidden(comment.user.login))
            .map((comment) => (
              <ChatBubble
                key={comment.id}
                variant={comment.user.login === issue.data!.user.login ? "solid" : "outlined"}
                {...comment}
              />
            ))}

          {/* J'affiche ce message si tous les utilisateurs sont masqués */}
          {((issue.data && isUserHidden(issue.data.user.login)) || !issue.data) &&
           (comments.data.length === 0 || comments.data.every(comment => isUserHidden(comment.user.login))) && (
            <Typography
              level="body-lg"
              textAlign="center"
              sx={{ py: 4, color: 'text.tertiary' }}
            >
              Aucun message à afficher avec les filtres actuels
            </Typography>
          )}
        </Stack>
      )}
    </Sheet>
  );
}
