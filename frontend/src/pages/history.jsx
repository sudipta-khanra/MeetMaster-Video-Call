import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import {
  IconButton,
  Container,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history : history.data || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        setError('Could not load meeting history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => routeTo('/home')}
          color="primary"
          aria-label="go to home"
          sx={{ mr: 2 }}
        >
          <HomeIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Meeting History
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : meetings.length !== 0 ? (
        <Grid container spacing={3}>
          {meetings.map((meeting) => (
            <Grid item xs={12} sm={6} key={meeting._id || meeting.meetingCode}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Meeting Code
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1.5, fontFamily: 'monospace' }}
                  >
                    {meeting.meetingCode}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Date: {formatDate(meeting.date)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            p: 4,
            bgcolor: '#f9f9f9',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No meeting history found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Meetings you join or create will appear here.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
