import {
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  List,
  Stack,
  ListItem,
  Container,
  Button,
  Card,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import Registration from "./Registration";
import SignIn from "./SignIn";
import Comments from "./Comments";

interface News {
  newsId: number;
  headline: string;
  content: string;
}
interface ApiData {
  news: News[];
  error: string;
  fetched: boolean;
}
interface FetchSettings {
  method: string;
  headers?: any;
  body?: string;
}

const Main: React.FC = (): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    news: [],
    error: "",
    fetched: false,
  });
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    String(localStorage.getItem("username"))
  );
  const [openRegistration, setOpenRegistration] = useState<boolean>(false);
  const [token, setToken] = useState<string>(
    String(localStorage.getItem("token"))
  );

  const apiCall = async (method?: string): Promise<void> => {
    let settings: FetchSettings = {
      method: method || "GET",
    };

    try {
      const connection = await fetch("/api/news", settings);

      if (connection.status === 200) {
        const news = await connection.json();

        if (news.length < 1) {
          setApiData({
            ...apiData,
            error: "Ei uutisia",
            fetched: true,
          });
        } else {
          setApiData({
            ...apiData,
            news: news,
            fetched: true,
          });
        }
      } else {
        setApiData({
          ...apiData,
          error: "Palvelimella tapahtui odottamaton virhe",
          fetched: true,
        });
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetched: true,
      });
    }
  };
  const splitContent = (content: string) => {
    let splittedContent = content.split("\\r\\n");
    return splittedContent;
  };
  useEffect(() => {
    apiCall();
  }, []);

  const handleSignOut = async () => {
    setToken("");
    localStorage.setItem("token", "");
  };

  const handleOpenSignIn = () => {
    if (openSignIn === false) {
      setOpenSignIn(true);
    }
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };
  const handleOpenRegistration = () => {
    if (openRegistration === false) {
      setOpenRegistration(true);
    }
  };
  const handleCloseRegistration = () => {
    setOpenRegistration(false);
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center">
        IT uutiset
      </Typography>
      <SignIn
        openSignIn={openSignIn}
        handleClose={handleCloseSignIn}
        setToken={setToken}
        setUsername={setUsername}
        setOpenSignIn={setOpenSignIn}
      />
      <Registration
        openRegistration={openRegistration}
        handleClose={handleCloseRegistration}
        token={token}
        setToken={setToken}
        setUsername={setUsername}
      />

      {token ? (
        <Box
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => handleSignOut()}>Kirjaudu ulos</Button>
          <Typography variant="h5">{username}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={() => handleOpenRegistration()}>
            Rekisteröidy
          </Button>
          <Button variant="outlined" onClick={() => handleOpenSignIn()}>
            Kirjaudu
          </Button>
        </Box>
      )}

      <Stack>
        {Boolean(apiData.error) ? (
          <Alert severity="error">{apiData.error}</Alert>
        ) : apiData.fetched ? (
          <List>
            {apiData.news.map((news: News, idx: number) => {
              return (
                <ListItem key={idx}>
                  <Card sx={{ minWidth: 275, padding: 5 }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                      {news.headline}
                    </Typography>

                    {splitContent(news.content).map(
                      (string: string, idx: number) => {
                        return (
                          <Typography key={idx} variant="body1">
                            {string}
                          </Typography>
                        );
                      }
                    )}
                  </Card>
                </ListItem>
              );
            })}
            <Comments
              apiData={apiData}
              token={token}
              handleOpenSignIn={handleOpenSignIn}
              username={username}
            />
          </List>
        ) : (
          <Backdrop open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Stack>
    </Container>
  );
};

export default Main;
