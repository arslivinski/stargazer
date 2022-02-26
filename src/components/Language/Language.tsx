import { LanguagueColors } from './LanguageColors';

interface LanguageProps {
  language: string | null;
}

function Language(props: LanguageProps): JSX.Element {
  const { language } = props;

  const hasLanguage = language != null && language !== '';
  const hasColor = hasLanguage && LanguagueColors[language]?.color != null;

  const languageElement = <span>{hasLanguage ? language : ''}</span>;

  if (hasColor) {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '8px',
            backgroundColor: LanguagueColors[language]?.color!,
          }}
        />
        &nbsp;
        {languageElement}
      </div>
    );
  }

  return languageElement;
}

export { Language };
