import Support from "~/components/common/Support";
import { getEditionImageUrl } from "~/lib/surveys/helpers/getEditionImageUrl";
import { rscMustGetSurveyEditionFromUrl } from "~/app/(mainLayout)/survey/[slug]/[year]/rsc-fetchers";
import { DebugRSC } from "~/components/debug/DebugRSC";
import Faq from "~/components/common/Faq";
import Translators from "~/components/common/Translators";

import SurveyCredits from "~/components/surveys/SurveyCredits";
import EditionMessage from "~/components/surveys/SurveyMessage";

import { type EditionMetadata } from "@devographics/types";
import { EditionMain } from "~/app/(mainLayout)/survey/[slug]/[year]/client-components";

import { DEFAULT_REVALIDATE_S } from "~/app/revalidation";
import TokyoDev from "~/components/common/TokyoDev";
import { setLocaleIdServerContext } from "~/i18n/rsc-context";
import { DynamicT } from "@devographics/react-i18n";
import SurveyOpeningWords from "~/components/page/SurveyOpeningWords";
import { Suspense } from "react";
import { Loading } from "~/components/ui/Loading";

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
}: {
  edition: EditionMetadata;
  imageUrl?: string;
}) => {
  const { survey } = edition;
  const { name } = survey;
  return (
    <div className="survey-page contents-medium">
      <EditionMessage edition={edition} />

      <h1 className="survey-title">
        State of <span>React Native</span>
        <br /> 2024
      </h1>
      <h3 className="survey-subtitle">
        A survey about everything <span>React Native</span>
      </h3>

      <SurveyOpeningWords />

      <div className="survey-page-block">
        {/**
         * If moving to a client component,
         * we can use a token expression instead "general.{{editionId}}.survey_intro"
         */}
        <DynamicT token={`general.${edition.id}.survey_intro`} />
        <Suspense>
          <EditionMain edition={edition} />
        </Suspense>
      </div>
      <Faq edition={edition} />
      <SurveyCredits edition={edition} />
    </div>
  );
};

export default async function SurveyPage({
  params,
}: {
  params: SurveyPageServerProps;
}) {
  setLocaleIdServerContext(params.lang); // Needed for "ServerT"
  const { slug, year } = params;
  const { data: edition, ___metadata: ___rscMustGetSurveyEditionFromUrl } =
    await rscMustGetSurveyEditionFromUrl({
      slug,
      year,
    });
  return (
    <div>
      <DebugRSC {...{ ___rscMustGetSurveyEditionFromUrl }} />
      <EditionPageComponent edition={edition} />
      {edition.survey.partners && <Support edition={edition} />}
    </div>
  );
}
