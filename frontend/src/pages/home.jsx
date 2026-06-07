import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import './HomeComponent.css';
import { Button, IconButton, TextField, Box } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/logo2.png';

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const { addToUserHistory, setUserData } = useContext(AuthContext);

  const handleJoinVideoCall = async (e) => {
    if (e) e.preventDefault();

    if (!meetingCode || !meetingCode.trim()) {
      alert('Please enter a valid meeting code!');
      return;
    }

    try {
      await addToUserHistory(meetingCode.trim());
      navigate(`/${meetingCode.trim()}`);
    } catch (err) {
      console.error('Error joining meeting:', err);
      navigate(`/${meetingCode.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setUserData) {
      setUserData({});
    }
    navigate('/auth');
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2>MeetMaster Video Call</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton
            onClick={() => navigate('/history')}
            aria-label="meeting history"
            color="primary"
          >
            <RestoreIcon />
          </IconButton>

          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just Like Quality Education</h2>

            <Box
              component="form"
              onSubmit={handleJoinVideoCall}
              sx={{ display: 'flex', gap: '10px', mt: 2 }}
            >
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                value={meetingCode}
                id="outlined-basic"
                label="Meeting Code"
                variant="outlined"
                size="small"
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary">
                Join
              </Button>
            </Box>
          </div>
        </div>
        <div className="rightPanel">
          <img src={Logo} alt="MeetMaster Landing Illustration" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
