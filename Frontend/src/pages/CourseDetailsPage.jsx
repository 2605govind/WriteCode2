import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { axiosAuth } from '../utils/axiosClient.js';
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Link,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  position: 'sticky',
  top: 20,
  transition: 'all 0.3s ease'
}));

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosAuth.get(`/course/getCourse/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="secondary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'error.dark' : 'error.light' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.light' }}>
          Course not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <StyledCard>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom color="text.primary">
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Last updated: {new Date(course.updatedAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip 
              label={`${course.materials?.length || 0} Videos`} 
              color="primary" 
            />
            <Chip 
              label={`${course.contentList?.length || 0} Sections`} 
              variant="outlined" 
              color="secondary"
            />
          </Box>
          <Typography variant="body1" paragraph color="text.primary">
            {course.description || 'No description available'}
          </Typography>
        </CardContent>
      </StyledCard>

      {/* Course Content */}
      <Grid container spacing={4}>
        {/* Content List */}
        <Grid item xs={12} md={4} order={isMobile ? 2 : 1}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom sx={{ pb: 1 }} color="text.primary">
              Course Sections
            </Typography>
            {course.contentList?.length > 0 ? (
              <List dense>
                {course.contentList.map((content, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`${index + 1}. ${content}`}
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.primary'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.light' }}>
                No sections available
              </Alert>
            )}
          </StyledPaper>
        </Grid>

        {/* Materials/Videos */}
        <Grid item xs={12} md={8} order={1}>
          <Typography variant="h5" gutterBottom color="text.primary">
            Course Materials
          </Typography>
          
          {course.materials?.length === 0 ? (
            <Alert severity="info" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.light' }}>
              No materials available for this course yet
            </Alert>
          ) : (
            <List>
              {course.materials?.map((material, index) => (
                <StyledCard key={material._id || index}>
                  <CardContent>
                    <Typography variant="h6" component="div" color="text.primary">
                      {index + 1}. {material.title}
                    </Typography>
                    <Link 
                      href={material.videoLink} 
                      target="_blank" 
                      rel="noopener" 
                      sx={{ 
                        mt: 1, 
                        display: 'inline-block',
                        color: theme.palette.mode === 'dark' ? 'secondary.light' : 'primary.main'
                      }}
                    >
                      Watch Video
                    </Link>
                  </CardContent>
                </StyledCard>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetailsPage;