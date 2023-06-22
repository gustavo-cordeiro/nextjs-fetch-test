import { Container, Tabs, Tab, Card, CardHeader, Avatar, CardActions, Button, Badge, IconButton, NoSsr, CardActionArea } from "@mui/material";
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
      overflow: "visible",
    }}>
      <CardActionArea LinkComponent={Link} href={`/${slug}`} sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <CardHeader
          avatar={
            <Avatar src={thumbnail} />
          }
          title={name}
          subheader={description}
        />
        <CardActions>
          <Badge badgeContent={votesCount} max={9999} color={isVoted ? 'success' : 'primary'} anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}>
            <IconButton aria-label="Up Vote" disabled={isVoted}>
              <ArrowDropUpRoundedIcon />
            </IconButton>
          </Badge>
        </CardActions>
      </CardActionArea>
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
    <Container>
      <Tabs aria-label="ProductHunt Panels" value={router.query.panel || 'RANKING'} onChange={HandleTabNavigation}>
        <Tab label="Popular" id="popular" value='RANKING' aria-controls="producthunt-popular-panel" />
        <Tab label="Newest" id="newest" value='NEWEST' aria-controls="producthunt-newest-panel" />
      </Tabs>
      <NoSsr>
        <ol>
          {
            // @ts-ignore
            query.data && query.data.posts.nodes.map(p => {
              return (
                <li key={p.id}>
                  <PHCard id={p.id} slug={p.slug} name={p.name} isVoted={p.isVoted} votesCount={p.votesCount} description={p.description} thumbnail={p.thumbnail.url} />
                </li>
              )
            })
          }
        </ol>
      </NoSsr>
    </Container>
  );
}

export default Page;