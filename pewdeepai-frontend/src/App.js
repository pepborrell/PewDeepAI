import React, { useState } from "react";
import logo from "./PewDeepAI.png";
import { makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import { Paper, CircularProgress, Typography, Button } from "@material-ui/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const phrases = [
  "Better post it to r/funny...",
  "Normie detected!",
  "That should be good... For r/memes",
  "That looks like some dank OC!"
];
const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    textAlign: "center",
    minHeight: "100vh",
    backgroundColor: "#f9013f",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E\")"
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    maxWidth: "90vw"
  },
  paper: {
    maxWidth: "80vw",
    display: "inline-block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    overflow: "hidden"
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  memePreview: {
    width: "100%",
    maxWidth: "20em",
    marginTop: theme.spacing(2),
    borderRadius: 5
  },
  score: {
    height: "15em",
    marginBottom: "-6em"
  },
  scoreDesc: {
    textAlign: "center",
    marginBottom: theme.spacing(2)
  },
  comment: {
    textAlign: "center",
    fontStyle: "italic"
  },
  dropzone: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(2)
  }
}));

function sendRequest(file) {
  let data = new FormData();
  data.append("meme", file);

  return fetch("https://0cd35734.ngrok.io/evaluate", {
    // Your POST endpoint
    method: "POST",
    body: data // This is your file object
  })
    .then(
      response => response.json() // if the response is a JSON object
    )
    .then(
      success => {
        console.log(success);
        return success;
      } // Handle the success response object
    );
}

function App() {
  const classes = useStyles();
  const [meme, setMeme] = useState(null);
  const [result, setResult] = useState({});
  const [score, setScore] = useState(0);

  const handleChange = files => {
    if (files.length > 0) reader.readAsDataURL(files[0]);
    sendRequest(files[0]).then(res => {
      setResult(res);
      setTimeout(() => {
        setScore(res.score, 200);
      });
    });
  };
  const reader = new FileReader();

  reader.onloadend = () => {
    setMeme(reader.result);
    setScore(0);
  };
  return (
    <div className={classes.root}>
      <img src={logo} className={classes.title} alt="PewDeepAI" />
      <Paper className={classes.paper}>
        {meme == null ? (
          <DropzoneArea
            onChange={handleChange}
            acceptedFiles={["image/*"]}
            filesLimit={1}
            dropzoneText="Give me your fresh memes!"
            showPreviewsInDropzone={false}
            dropzoneClass={classes.dropzone}
          />
        ) : Object.entries(result).length === 0 ? (
          <div className={classes.resultContainer}>
            <CircularProgress />
            <Typography variant="body1">Analyzing dankness...</Typography>
            <img src={meme} className={classes.memePreview} alt="Meme" />
          </div>
        ) : (
          <div className={classes.resultContainer}>
            {!!result.error ? (
              <Typography variant="body1">Error: {result.error}</Typography>
            ) : (
              <div>
                <CircularProgressbar
                  className={classes.score}
                  value={score}
                  text={`Score: ${result.score}`}
                  circleRatio={0.5}
                  styles={buildStyles({
                    rotation: -0.25,
                    // Text size
                    textSize: "1em",
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,
                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',
                    // Colors
                    pathColor: "#f9013f",
                    textColor: "#000000",
                    trailColor: "#d6d6d6"
                  })}
                />
                <Typography variant="h5" className={classes.scoreDesc}>
                  {phrases[Math.floor(result.score / (100 / phrases.length))]}
                </Typography>
                <Typography variant="h6">Your random comment: </Typography>
                <Typography variant="body1" className={classes.comment}>
                  "{result.comment}"
                </Typography>
              </div>
            )}
            <img src={meme} className={classes.memePreview} alt="Meme" />
            <Button
              color="secondary"
              variant="outlined"
              component="span"
              className={classes.button}
              onClick={() => {
                setMeme(null);
                setResult({});
              }}
            >
              Check another!
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default App;
