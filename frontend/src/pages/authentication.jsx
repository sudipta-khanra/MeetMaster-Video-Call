import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import "./Authentication.css";
import authBg from "../assets/auth.png";

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [name, setName] = React.useState();
  const [error, setError] = React.useState();
  const [message, setMessage] = React.useState();
  const [formState, setFormstate] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      setError("");
      if (formState === 0) {
        let result = await handleLogin(username, password);
      }

      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log("result", result);
        setMessage(result);
        setOpen(true);
        setFormstate(0);
        setError("");
        setPassword("");
        setUsername("");
      }
    } catch (err) {
      let message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" className="auth-grid">
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className="auth-wallpaper" />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          className="auth-form-container"
        >
          <Box className="auth-form-box">
            <Avatar className="auth-avatar">
              <LockOutlinedIcon />
            </Avatar>
            <div className="auth-toggle-buttons">
              <Button
                variant={formState === 0 ? "contained" : ""}
                onClick={() => setFormstate(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : ""}
                onClick={() => setFormstate(1)}
              >
                Register
              </Button>
            </div>
            <Box component="form" noValidate>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Full Name"
                  label="Full Name"
                  value={name}
                  name="username"
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                value={username}
                name="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <p className="auth-error">{error}</p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                className="auth-submit-button"
                onClick={handleAuth}
              >
                {formState === 0 ? "Sign In" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={() => setOpen(false)}
        message={message}
      />
    </ThemeProvider>
  );
}
