import { Badge, Button, Loader, Table, Text, TextInput } from '@mantine/core';
import { Octokit } from 'octokit';
import { useMemo, useState } from 'react';

import { Container } from './components/Container/Container';
import { Filter, type FilterData } from './components/Filter/Filter';
import { Language } from './components/Language/Language';
import { Topics } from './components/Topics/Topics';
import { Visibility } from './components/Visibility/Visibility';
import type { StarredRepository } from './model/StarredRepository';

const NONE = '<None>';

function getLanguage(language: string | null): string {
  if (language == null) {
    return '';
  }
  return language;
}

function App(): JSX.Element {
  const [token, setToken] = useState('');
  const [api, setApi] = useState<Octokit>();
  const [user, setUser] = useState('');
  const [repositories, setRepositories] = useState<StarredRepository[] | undefined>();
  const [filterData, setFilterData] = useState<FilterData>();
  const [loading, setLoading] = useState<boolean>(false);

  const languages = useMemo(() => {
    const set = new Set<string>();

    for (const repository of repositories ?? []) {
      if (repository.language != null) {
        set.add(repository.language);
      } else {
        set.add(NONE);
      }
    }

    return Array.from(set).sort();
  }, [repositories]);

  const topics = useMemo(() => {
    const set = new Set<string>();

    for (const repository of repositories ?? []) {
      for (const topic of repository.topics ?? []) {
        set.add(topic);
      }
    }

    return Array.from(set).sort();
  }, [repositories]);

  const [starsMin, starsMax] = useMemo(() => {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    for (const repository of repositories ?? []) {
      if (repository.stargazers_count > max) {
        max = repository.stargazers_count;
      }

      if (repository.stargazers_count < min) {
        min = repository.stargazers_count;
      }
    }

    return [min, max];
  }, [repositories]);

  const filteredRepositories = useMemo(() => {
    if (!Array.isArray(repositories)) {
      return [];
    }

    let result = repositories;

    if (filterData == null) {
      return result;
    }

    if (Array.isArray(filterData.selectedLanguages) && filterData.selectedLanguages.length > 0) {
      result = result.filter((repository) => {
        return filterData.selectedLanguages!.includes(repository.language == null ? NONE : repository.language);
      });
    }

    if (Array.isArray(filterData.selectedTopics) && filterData.selectedTopics.length > 0) {
      result = result.filter((repository) => {
        if (!Array.isArray(repository.topics)) {
          return false;
        }

        return filterData.selectedTopics!.every((selectedTopic) => {
          return repository.topics!.includes(selectedTopic);
        });
      });
    }

    result = result.filter((repository) => {
      if (Array.isArray(filterData.starsRange)) {
        return (
          repository.stargazers_count >= filterData.starsRange[0] &&
          repository.stargazers_count <= filterData.starsRange[1]
        );
      }
      return true;
    });

    result = result.filter((repository) => {
      if (filterData.selectedArchived == null) {
        return true;
      }
      if (filterData.selectedArchived === 'Yes' && repository.archived) {
        return true;
      }
      if (filterData.selectedArchived === 'No' && !repository.archived) {
        return true;
      }
      return false;
    });

    result = result.filter((repository) => {
      if (filterData.selectedTemplate == null) {
        return true;
      }
      if (filterData.selectedTemplate === 'Yes' && repository.is_template === true) {
        return true;
      }
      if (filterData.selectedTemplate === 'No' && repository.is_template === false) {
        return true;
      }
      return false;
    });

    if (filterData.selectedSort != null) {
      if (filterData.selectedSort === 'Repository') {
        if (filterData.sortDirection === 'ASC') {
          result.sort((a, b) => {
            return a.full_name.toLowerCase() > b.full_name.toLowerCase() ? 1 : -1;
          });
        } else {
          result.sort((a, b) => {
            return a.full_name.toLowerCase() < b.full_name.toLowerCase() ? 1 : -1;
          });
        }
      }
      if (filterData.selectedSort === 'Language') {
        if (filterData.sortDirection === 'ASC') {
          result.sort((a, b) => {
            return getLanguage(a.language) > getLanguage(b.language) ? 1 : -1;
          });
        } else {
          result.sort((a, b) => {
            return getLanguage(a.language) < getLanguage(b.language) ? 1 : -1;
          });
        }
      }
      if (filterData.selectedSort === 'Stars') {
        if (filterData.sortDirection === 'ASC') {
          result.sort((a, b) => {
            return a.stargazers_count - b.stargazers_count;
          });
        } else {
          result.sort((a, b) => {
            return b.stargazers_count - a.stargazers_count;
          });
        }
      }
    }

    return result;
  }, [repositories, filterData]);

  async function handleAuthenticate(): Promise<void> {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.users.getAuthenticated();

    if (data.login != null && data.login !== '') {
      setApi(octokit);
      setUser(data.login);
    }
  }

  async function handleFetchStars(): Promise<void> {
    setLoading(true);

    const result = await api?.paginate(api?.rest.activity.listReposStarredByAuthenticatedUser, {
      sort: 'created',
      per_page: 100,
    });

    setRepositories(result);
    setLoading(false);
  }

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (user === '') {
    return (
      <Container>
        <TextInput
          label="GitHub AcessToken"
          value={token}
          onChange={(event) => setToken(event.currentTarget.value)}
          required
        />
        <Button onClick={handleAuthenticate}>Authenticate</Button>
      </Container>
    );
  }

  if (!Array.isArray(repositories)) {
    return (
      <Container>
        <Text>Hello {user}</Text>
        <Button onClick={handleFetchStars}>Fetch Stars</Button>
      </Container>
    );
  }

  return (
    <>
      <Filter languages={languages} topics={topics} starsRange={[starsMin, starsMax]} onChange={setFilterData} />
      <Text size="xl" style={{ margin: '32px' }}>
        Count: {filteredRepositories.length}
      </Text>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Description</th>
            <th>Stars</th>
            <th>Language</th>
            <th>Visibility</th>
            <th>Archived</th>
            <th>Template</th>
            <th>Topics</th>
          </tr>
        </thead>
        <tbody>
          {filteredRepositories.map((repository) => (
            <tr key={repository.id}>
              <td>
                <a href={`https://github.com/${repository.full_name}`} target="_blank" rel="noopener noreferrer">
                  {repository.full_name}
                </a>
              </td>
              <td>{repository.description}</td>
              <td>⭐&nbsp;{repository.stargazers_count}</td>
              <td>
                <Language language={repository.language} />
              </td>
              <td>
                <Visibility visibility={repository.visibility} />
              </td>
              <td>{repository.archived ? <Badge color="red">Archived</Badge> : null}</td>
              <td>{repository.is_template ? <Badge color="yellow">Template</Badge> : null}</td>
              <td>
                <Topics topics={repository.topics} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export { App };
