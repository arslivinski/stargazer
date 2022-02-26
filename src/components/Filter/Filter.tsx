import { Button, MultiSelect, NumberInput, Select } from '@mantine/core';
import { useState } from 'react';

import { Container } from '../Container/Container';

type Sort = 'Repository' | 'Stars' | 'Language'
type SortDirection = 'ASC' | 'DESC';

interface FilterData {
  selectedLanguages: string[];
  selectedTopics: string[];
  starsRange: [number, number];
  selectedArchived: string | null;
  selectedTemplate: string | null;
  selectedSort: Sort | null;
  sortDirection: SortDirection;
}

interface FilterProps {
  languages: string[];
  topics: string[];
  starsRange: [number, number];
  onChange: (data: FilterData) => void;
}

function Filter(props: FilterProps): JSX.Element {
  const {
    languages,
    topics,
    starsRange: [starsMin, starsMax],
    onChange,
  } = props;

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStarsMin, setSelectedStarsMin] = useState(starsMin);
  const [selectedStarsMax, setSelectedStarsMax] = useState(starsMax);
  const [selectedArchived, setSelectedArchived] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<Sort | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');

  function handleClickClear() {
    setSelectedLanguages([]);
    setSelectedTopics([]);
    setSelectedStarsMin(starsMin);
    setSelectedStarsMax(starsMax);
    setSelectedArchived(null);
    setSelectedTemplate(null);
    setSelectedSort(null);
    setSortDirection('ASC');

    onChange({
      selectedLanguages: [],
      selectedTopics: [],
      starsRange: [starsMin, starsMax],
      selectedArchived: null,
      selectedTemplate: null,
      selectedSort: null,
      sortDirection: 'ASC',
    });
  }

  function handleClickApply() {
    onChange({
      selectedLanguages,
      selectedTopics,
      starsRange: [selectedStarsMin, selectedStarsMax],
      selectedArchived,
      selectedTemplate,
      selectedSort,
      sortDirection,
    });
  }

  return (
    <Container>
      <MultiSelect
        label="Languages"
        placeholder="Filter repositories by programming language"
        data={languages}
        value={selectedLanguages}
        onChange={setSelectedLanguages}
        nothingFound="Nothing found"
        searchable
      />
      <MultiSelect
        label="Topics"
        placeholder="Filter repositories by topics"
        data={topics}
        value={selectedTopics}
        onChange={setSelectedTopics}
        nothingFound="Nothing found"
        searchable
      />
      <div style={{ display: 'flex', gap: '16px' }}>
        <NumberInput
          label="Stars Min"
          description={`From ${starsMin} to ${selectedStarsMax}`}
          style={{ flexGrow: 1 }}
          value={selectedStarsMin}
          onChange={(value) => (value != null ? setSelectedStarsMin(value) : void 0)}
          min={starsMin}
          max={selectedStarsMax}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
        <NumberInput
          label="Stars Max"
          description={`From ${selectedStarsMin} to ${starsMax}`}
          style={{ flexGrow: 1 }}
          value={selectedStarsMax}
          onChange={(value) => (value != null ? setSelectedStarsMax(value) : void 0)}
          min={selectedStarsMin}
          max={starsMax}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
      </div>
      <Select
        label="Archived"
        placeholder="Filter repositories that are archived or not"
        data={['Yes', 'No']}
        value={selectedArchived}
        onChange={setSelectedArchived}
        clearable
      />
      <Select
        label="Template"
        placeholder="Filter repositories that are template or not"
        data={['Yes', 'No']}
        value={selectedTemplate}
        onChange={setSelectedTemplate}
        clearable
      />
      <div style={{ display: 'flex', gap: '16px' }}>
        <Select
          label="Sort"
          placeholder="Define how to sort the repositories"
          data={['Repository', 'Stars', 'Language'] as Sort[]}
          value={selectedSort}
          onChange={(value) => setSelectedSort(value as Sort)}
          style={{ flexGrow: 1 }}
          clearable
        />
        <Select
          label="Direction"
          placeholder="Sort direction"
          data={['ASC', 'DESC'] as SortDirection[]}
          value={sortDirection}
          onChange={(value) => (value != null ? setSortDirection(value as SortDirection) : void 0)}
        />
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button onClick={handleClickClear} variant="light" fullWidth>
          Clear
        </Button>
        <Button onClick={handleClickApply} fullWidth>
          Apply
        </Button>
      </div>
    </Container>
  );
}

export type { FilterData, Sort, SortDirection };
export { Filter };
