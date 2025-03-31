import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "../ChatBubble/ChatBubble";
import useFetch from "../../useFetch";
import { useIssueStore } from "../../Store/issueStore";
import React, { useEffect } from "react";
import { useUsersStore } from "../../Store/userStore";
import { GITHUB_API_URL } from "../../config";
import { Box, CircularProgress } from "@mui/joy";
import TimelineEvent from "./Timeline/TimeLineEvent";
import { Issue } from "../../../types/Issue";
import { Comment } from "../../../types/Comment";
import { User } from "../../../types/User";

type TimelineEventType = {
  id: number;
  event: string;
  actor: User;
  created_at: string;
  label?: {
    name: string;
    color: string;
  };
  state?: string;
};

// Type pour représenter un élément combiné (soit issue, commentaire ou événement)
type CombinedItem =
  | { type: 'issue'; data: Issue; created_at: string }
  | { type: 'comment'; data: Comment; created_at: string }
  | { type: 'timeline'; data: TimelineEventType; created_at: string };

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

  const timeline = useFetch<TimelineEventType[]>(
    { url: `${GITHUB_API_URL}/${issueUrl}/timeline` },
  );

// J'utilise useMemo ici pour éviter de recalculer cette liste à chaque rendu
const combinedItems = React.useMemo<CombinedItem[]>(() => {
  const items: CombinedItem[] = [];

  // j'ajoute l'issue initiale
  if (issue.data) {
    items.push({
      type: 'issue',
      data: issue.data,
      created_at: issue.data.created_at
    });
  }

  // j'ajoute les commentaires
  if (comments.data) {
    comments.data.forEach(comment => {
      items.push({
        type: 'comment',
        data: comment,
        created_at: comment.created_at
      });
    });
  }

  // j'ajoute les événements de timeline
  // Je les ajoute pour répondre à la consigne 5 qui demande d'ajouter les événements
  // comme les labels, changements de statut, etc
  if (timeline.data) {
    timeline.data.forEach(event => {
      items.push({
        type: 'timeline',
        data: event,
        created_at: event.created_at
      });
    });
  }

  // Je trie tous les éléments par date pour respecter la date de publication
  return items.sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
 }, [issue.data, comments.data, timeline.data]);


  // Je réinitialise les utilisateurs quand on change d'issue
  useEffect(() => {
    resetUsers();
  }, [issueUrl, resetUsers]);

  // J'ajoute l'auteur de l'issue et j'incrémente son compteur
  useEffect(() => {
    if (issue.data) {
      console.log(issue.data , "issue.data");
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

  // Fonction pour rendre chaque élément selon son type
  const renderItem = (item: CombinedItem, index: number) => {
    switch(item.type) {
      case 'issue':
        return <ChatBubble key={`issue-${item.data.id}`} variant="solid" {...item.data} />;

      case 'comment':
        return (
          <ChatBubble
            key={`comment-${item.data.id}`}
            variant={item.data.user.login === issue.data?.user.login ? "solid" : "outlined"}
            {...item.data}
          />
        );

      case 'timeline':
        return (
          <TimelineEvent
            key={`timeline-${item.data.id}-${index}`}
            event={item.data.event}
            actor={item.data.actor}
            created_at={item.data.created_at}
            label={item.data.label}
            state={item.data.state}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {/* Affichage d'un message d'erreur si l'issue n'existe pas */}
      {issue.isError && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 4,
          }}
        >
          <Typography level="h4" color="danger" sx={{ mb: 2 }}>
            Issue introuvable
          </Typography>
          <Typography level="body-md" textAlign="center" sx={{ color: 'text.secondary' }}>
            L'issue spécifiée n'existe pas ou n'est pas accessible.
            Veuillez vérifier l'URL et réessayer.
          </Typography>
        </Box>
      )}

      {/* Contenu normal quand l'issue existe */}
      {!issue.isError && (
        <>
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

          {/* J'affiche un spinner pendant le chargement */}
          {(issue.isLoading || comments.isLoading || timeline.isLoading) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                p: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {(issue.data || comments.data) && (
            <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
              {/* Liste combinée des commentaires et événements */}
              {combinedItems
                .filter(item => {
                  // Je filtre selon la visibilité des utilisateurs
                  if (item.type === 'issue' || item.type === 'comment') {
                    return !isUserHidden(item.data.user.login);
                  }
                  return true;
                })
                .map((item, index) => renderItem(item, index))}

              {/* J'affiche ce message si tous les utilisateurs sont masqués dans le filtre */}
              {combinedItems.length === 0 ||
               (combinedItems.every(item =>
                  (item.type === 'issue' || item.type === 'comment') &&
                  isUserHidden(item.data.user.login)
               )) && (
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
        </>
      )}
    </Sheet>
  );
}
