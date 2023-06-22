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
        media {
          url
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
          <Card>
            <CardMedia
              component="img"
              image={post.media[0].url}
            />
          </Card>
          <Card>
            <CardHeader
              avatar={
                <Avatar src={post.thumbnail.url}>{post.name}</Avatar>
              }
              title={post.name}
            />
            <CardContent>
              <Typography variant="body1">{post.description}</Typography>
            </CardContent>
            {
              post.featuredAt && (
                <Card>
                  <CardHeader
                    avatar={
                      <WorkspacePremiumIcon />
                    }
                    title={'Product of the day'}
                    subheader={`${featuredSince} days ago`}
                  />
                </Card>
              )
            }
          </Card>
          <Card>
            <CardActions>
              <ButtonGroup>
                <Button component={Link} href="/">
                  Get it
                </Button>
                <Button disabled={post.isVoted}>
                  Upvote ({post.votesCount})
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </>
      )}
      
    </Container>
  )
}

export default Page;