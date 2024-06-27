import Support from "~/components/common/Support";
import { getEditionImageUrl } from "~/lib/surveys/helpers/getEditionImageUrl";
import {
  rscMustGetSurveyEditionFromUrl,
} from "./rsc-fetchers";
import { DebugRSC } from "~/components/debug/DebugRSC";
import Faq from "~/components/common/Faq";
import Translators from "~/components/common/Translators";
import { tokens as tokensTranslators } from "~/components/common/Translators.tokens";
import SurveyCredits from "~/components/surveys/SurveyCredits";
import EditionMessage from "~/components/surveys/SurveyMessage";
import { tokens as tokensEditionMessage } from "~/components/surveys/SurveyMessage.tokens";
import { type EditionMetadata } from "@devographics/types";
import { EditionMain } from "./client-components";
import { tokens as tokensEditionMain } from "./client-components.tokens"
import { DEFAULT_REVALIDATE_S } from "~/app/revalidation";
import TokyoDev from "~/components/common/TokyoDev";
import { setLocaleIdServerContext } from "~/i18n/rsc-context";
import { ServerT } from "~/i18n/components/ServerT";
import { rscLocaleFromParams } from "~/lib/api/rsc-fetchers";
import { filterClientSideStrings } from "@devographics/i18n/server";
import { I18nContextProvider } from "@devographics/react-i18n";

const clientTokens = [...tokensEditionMain, ...tokensTranslators, ...tokensEditionMessage]

// revalidating is important so we get fresh values from the cache every now and then without having to redeploy
export const revalidate = DEFAULT_REVALIDATE_S;
export const dynamicParams = true;
/**
 * NOTE: ideally we would load surveys in the layout directly
 * but this is not possible to mix static and dynamic pages in the same parent layout (yet)
 * @see https://github.com/vercel/next.js/issues/44712
 */
/*
FIXME weird bug it gives 404 on unknown languages...
export async function generateStaticParams() {
  const editionParams = (
    await rscGetEditionsMetadata({ removeHidden: true })
  ).map((e) => getEditionParams(e));
  // lang should be added too, for the moment we only statically render en-US but more could be added
  return editionParams.map((p) => ({ ...p, lang: "en-US" }));
}*/

interface SurveyPageServerProps {
  slug: string;
  year: string;
  // inherited from above segment
  lang: string;
}

const EditionPageComponent = ({
  edition,
  imageUrl,
}: {
  edition: EditionMetadata;
  imageUrl?: string;
}) => {
  const { survey } = edition;
  const { name } = survey;
  return (
    <div className="survey-page contents-narrow">
      <EditionMessage edition={edition} />

      {!!imageUrl && (
        <h1 className="survey-image">
          <img
            width={600}
            height={400}
            src={imageUrl}
            alt={`${name} ${edition.year}`}
          />
        </h1>
      )}
      <div className="survey-page-block">
        {/** 
         * If moving to a client component,
         * we can use a token expression instead "general.{{editionId}}.survey_intro"
         */}
        <ServerT token={`general.${edition.id}.survey_intro`} />
        <EditionMain edition={edition} />
      </div>
      <Faq edition={edition} />
      {edition.credits && <SurveyCredits edition={edition} />}

      <TokyoDev />
      <Translators />
    </div>
  );
};

export default async function SurveyPage({
  params,
}: {
  params: SurveyPageServerProps;
}) {
  setLocaleIdServerContext(params.lang) // Needed for "ServerT"
  const { locale, localeId, error } = await rscLocaleFromParams(params)
  if (error) return <div>Can't load translations</div>
  // TODO: get correct tokens
  const clientSideLocale = filterClientSideStrings<{}>(locale, clientTokens, {}, { pageName: "survey_slug_year" })
  const { slug, year } = params;
  const { data: edition, ___metadata: ___rscMustGetSurveyEditionFromUrl } =
    await rscMustGetSurveyEditionFromUrl({
      slug,
      year,
    });

  const imageUrl = getEditionImageUrl(edition);
  return (
    <div>
      <I18nContextProvider locale={clientSideLocale}>
        <DebugRSC {...{ ___rscMustGetSurveyEditionFromUrl }} />
        <EditionPageComponent edition={edition} imageUrl={imageUrl} />
        {edition.survey.partners && <Support edition={edition} />}
      </I18nContextProvider>
    </div>
  );
}
