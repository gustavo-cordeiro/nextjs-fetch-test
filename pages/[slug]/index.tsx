import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CardMedia, Card, Container, CardHeader, Avatar, CardContent, Typography, ButtonGroup, CardActions, Button } from "@mui/material";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const query = useQuery(gql`
    query Post ($slug: String!) {
      post (slug: $slug) {
        name,
        description,
        featuredAt,
        thumbnail {
          url
        }
        media  {
          url(height: 280)
        }
        votesCount,
        isVoted
      }
    }
  `, {
    skip: !router.query.slug,
    variables: {
      slug: router.query.slug
    }
  })
  const post = query.data && query.data.post;


  const elapseTime = new Date().getTime() - new Date(post ? post.featuredAt : 0).getTime();
  const featuredSince = Math.floor( elapseTime / (100 * 60 * 60 * 24));

  return (
    <Container>
      {post && (
        <>
          <Card sx={{
            my: 2,
          }}>
            <CardMedia
              component="img"
              image={post.media[0].url}
              height={280}
            />
          </Card>
          <Card sx={{
            mb: 12,
          }}>
            <CardHeader
              avatar={
                <Avatar src={post.thumbnail.url} variant="rounded">{post.name}</Avatar>
              }
              title={post.name}
            />
            <CardContent>
              <Typography variant="body1">{post.description}</Typography>
            </CardContent>
            {
              post.featuredAt && (
                <Card sx={{
                  m: 2,
                }}>
                  <CardHeader
                    avatar={
                      <WorkspacePremiumIcon color="warning" />
                    }
                    title={'#Product of the day'}
                    subheader={`${featuredSince} days ago`}
                  />
                </Card>
              )
            }
          </Card>
          <Card sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            p: 2,
          }}>
            <CardActions>
              <Container disableGutters sx={{
                display: 'flex',
                justifyContent: 'space-between',
                '& .MuiButton-root': {
                  width: '45%',
                }
              }}>
                <Button component={Link} href="/" variant="outlined">
                  Get it
                </Button>
                <Button disabled={post.isVoted} variant="contained">
                  Upvote ({post.votesCount})
                </Button>
                </Container>
            </CardActions>
          </Card>
        </>
      )}
      
    </Container>
  )
}

export default Page;