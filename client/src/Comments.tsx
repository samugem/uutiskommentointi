import {
  Typography,
  List,
  ListItemText,
  Stack,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  TextField,
  Alert,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";

interface Comment {
  commentId: number;
  newsId: number;
  username: string;
  comment: string;
  timestamp: Date;
}
interface CommentData {
  comments: Comment[];
  error: string;
  fetched: boolean;
}
interface FetchSettings {
  method: string;
  headers?: any;
  body?: string;
}
const Comments = ({ apiData, token, handleOpenSignIn, username }: any) => {
  const [commentData, setCommentData] = useState<CommentData>({
    comments: [],
    error: "",
    fetched: false,
  });
  const formRef = useRef<HTMLFormElement>();
  const [newsId, setNewsId] = useState(1);

  const addNewComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.comment.value) {
      const connection = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          newsId: newsId,
          comment: formRef.current?.comment.value,
        }),
      });

      if (connection.status === 200) {
        apiCall();
      }
    }
  };
  const selectNewsId = (e: any) => {
    setNewsId(e.target.value);
  };

  const apiCall = async (method?: string): Promise<void> => {
    if (token.length > 0) {
      let settings: FetchSettings = {
        method: method || "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      };

      try {
        const connection = await fetch("/api/comments", settings);

        if (connection.status === 200) {
          const comments = await connection.json();

          if (comments.length > 0) {
            setCommentData({
              ...commentData,
              comments: comments,
              fetched: true,
            });
          } else {
            setCommentData({
              ...commentData,
              fetched: true,
            });
          }
        } else {
          let errorMsg: string = "";

          switch (connection.status) {
            case 401:
              errorMsg = "Kirjautumisessa tapahtui virhe (Virheellinen token)";
              break;
            default:
              errorMsg = "Palvelimella tapahtui odottamaton virhe";
              break;
          }
          setCommentData({
            ...commentData,
            error: errorMsg,
            fetched: true,
          });
        }
      } catch (e: any) {
        setCommentData({
          ...commentData,
          error: "Palvelimeen ei saada yhteyttä",
          fetched: true,
        });
      }
    }
  };
  useEffect(() => {
    apiCall();
  }, [token]);

  return token ? (
    <Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5">Kommentit</Typography>
      <List>
        {commentData.comments.map((comment: Comment, idx: number) => {
          const newsHeadline = apiData.news[comment.newsId - 1]?.headline;
          return (
            <ListItem key={idx}>
              <ListItemAvatar>
                <Avatar alt={comment.username} />
              </ListItemAvatar>
              <Stack>
                <ListItemText
                  primary={comment.username}
                  secondary={new Intl.DateTimeFormat("fi-FI", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(comment.timestamp))}
                  sx={{ wordWrap: "wrap" }}
                />
              </Stack>
              <Stack sx={{ ml: 1 }}>
                <ListItemText
                  primary={
                    comment.newsId + " - " + newsHeadline?.slice(0, 40) + "..."
                  }
                />
                <Typography
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #D3D3D3",
                    p: 1,
                    mb: 0,
                  }}
                >
                  {comment.comment}
                </Typography>
              </Stack>
            </ListItem>
          );
        })}
      </List>
      {commentData.error ? (
        <Alert severity="error">{commentData.error}</Alert>
      ) : null}
      <Box component="form" onSubmit={addNewComment} ref={formRef}>
        <Stack spacing={1}>
          <TextField id="comment" multiline rows={2} required></TextField>
          <FormControl fullWidth>
            <InputLabel id="newsId-label">Kommentoitava uutinen</InputLabel>
            <Select
              labelId="newsId-label"
              id="newsId"
              value={newsId}
              label="Kommentoitava uutinen"
              onChange={selectNewsId}
              required
            >
              {apiData.news.map((news: any, idx: number) => {
                return (
                  <MenuItem value={news.newsId} key={idx}>
                    {`${news.newsId} -  ${news.headline?.slice(0, 40)}...`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Lähetä kommentti
          </Button>
        </Stack>
      </Box>
    </Stack>
  ) : (
    <Button
      variant="contained"
      onClick={() => handleOpenSignIn()}
      sx={{ mt: 1 }}
    >
      Kirjaudu sisään kommentoidaksesi
    </Button>
  );
};
export default Comments;
