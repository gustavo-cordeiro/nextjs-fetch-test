import { Container, Tabs, Tab, Card, CardHeader, Avatar, CardActions, Button, Badge, IconButton, NoSsr, CardActionArea, Box, Skeleton } from "@mui/material";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

type PH_PANELS = 'RANKING' | 'NEWEST';

const PHCard = ({
  id, slug,name, isVoted, votesCount, description, thumbnail,
}: {
  id: string, slug: string, name: string, isVoted: boolean, votesCount: number, description: string, thumbnail: string,
}) => {
  return (
    <Card sx={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <CardActionArea LinkComponent={Link} href={`/${slug}`}>
        <CardHeader
          avatar={
            <Avatar src={thumbnail} />
          }
          title={name}
          subheader={description}

          sx={{
            '& .MuiCardHeader-subheader' : {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              '-webkit-line-clamp': '1',
              '-webkit-box-orient': 'vertical',
            }
          }}
        />
      </CardActionArea>
      <CardActions>
        <Button
          aria-label="Up Vote"
          disabled={isVoted}
          color="inherit"
          startIcon={<ArrowDropUpRoundedIcon />}
          variant="outlined"
          sx={{
            borderColor: '#e7eaeb',
            flexDirection: "column",
            '& .MuiButton-startIcon': {
              margin: 0,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '40px !important',
              margin: -2,
            }
          }}
        >
          {votesCount}
        </Button>
      </CardActions>
    </Card>
  )
}

const Page = () => {
  const router = useRouter();

  const query = useQuery(gql`
    query HomePosts (
      $featured: Boolean,
      $first: Int,
      $order: PostsOrder 
    ) {
      posts (
        featured: $featured,
        first: $first,
        order: $order 
      ) {
        nodes {
          id,
          name,
          isVoted,
          votesCount,
          description,
          slug,
          thumbnail {
            url
          }
        }
      }
    }
  `, {
      skip: !router.query.panel,
      variables: {
        featured: false,
        first: 50,
        order: router.query.panel
      }
    })

  useEffect(() => {
    if (!router.query.panel) {
      router.push({
        pathname: '/',
        query: { panel: 'RANKING' },
      })
    }
  }, [router])

  const HandleTabNavigation = (event: React.SyntheticEvent, value: PH_PANELS) => {
    router.push({
      pathname: '/',
      query: { panel: value },
    })
  };

  return (
    <Container disableGutters>
      <Tabs
        value={router.query.panel || 'RANKING'}
        onChange={HandleTabNavigation}
        aria-label="ProductHunt Panels" sx={{
          '& .MuiTab-root': {
            width: '50%',
            maxWidth: '50%',
            textTransform: 'capitalize',
          }
        }}>
        <Tab label="Popular" id="popular" value='RANKING' aria-controls="producthunt-popular-panel" />
        <Tab label="Newest" id="newest" value='NEWEST' aria-controls="producthunt-newest-panel" />
      </Tabs>
      <Container>
        <NoSsr>
          <Box sx={{
            '& ol': {
              p: 0,
              listStyle: 'none',
            },
            '& li, & .MuiSkeleton-root': {
              my: 2,
            },
            pb: 4,
          }}>
            <ol>
              {
                
                query.data ?
                  // @ts-ignore
                  query.data.posts.nodes.map(p => {
                    return (
                      <li key={p.id}>
                        <PHCard id={p.id} slug={p.slug} name={p.name} isVoted={p.isVoted} votesCount={p.votesCount} description={p.description} thumbnail={p.thumbnail.url} />
                      </li>
                    )
                  })
                : (
                  Array.from([,,,,,,,,,,]).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height="80px" sx={{
                      borderRadius: 2,
                    }}/>
                  ))
                )
              }
            </ol>
          </Box>
        </NoSsr>
      </Container>
    </Container>
  );
}

export default Page;